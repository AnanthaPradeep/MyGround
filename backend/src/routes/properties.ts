import express, { Router, Response } from 'express';
import { body } from 'express-validator';
import Property from '../models/Property';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { validatePropertyListing, validateResidentialProperty, validateLandProperty, validateCommercialProperty } from '../utils/validation';
import { generateAssetId, createOrUpdateAssetDNA } from '../utils/assetDNA';
import { checkDuplicateListing, checkPriceAnomaly, checkListingRateLimit } from '../utils/fraudDetection';
import { validationResult } from 'express-validator';
import { 
  notifyPropertySubmitted, 
  notifyPropertyApproved, 
  notifyPropertyRejected,
  notifyPropertyDeleted,
  notifyPropertyPaused,
  notifyPropertyResumed,
  notifyNewPropertyAdded,
  notifyPublicPropertyDeleted,
  notifyPropertySoldOrRented
} from '../utils/notifications';

const router: Router = express.Router();

/**
 * @route   POST /api/properties
 * @desc    Create a new property listing
 * @access  Private (User, Owner, Broker, Developer, Admin)
 */
router.post(
  '/',
  authenticate,
  authorize('USER', 'OWNER', 'BROKER', 'DEVELOPER', 'ADMIN'),
  [
    ...validatePropertyListing(),
    body('media.images')
      .isArray({ min: 3 })
      .withMessage('At least 3 images are required'),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check rate limit
      const rateLimit = await checkListingRateLimit(req.user!.userId);
      if (!rateLimit.allowed) {
        return res.status(429).json({
          error: 'Rate limit exceeded',
          message: `You can only create ${rateLimit.remaining} more listings today`,
        });
      }

      // Check for duplicates
      const duplicateCheck = await checkDuplicateListing(req.body, req.user!.userId);
      if (duplicateCheck.isDuplicate) {
        return res.status(409).json({
          error: 'Duplicate listing detected',
          message: 'A similar property already exists at this location',
          similarProperties: duplicateCheck.similarProperties.map((p) => ({
            id: p._id,
            title: p.title,
            location: p.location,
          })),
        });
      }

      // Check price anomaly
      const priceCheck = await checkPriceAnomaly(req.body);
      if (priceCheck.isAnomaly) {
        // Warning but allow submission
        console.warn(`Price anomaly detected for user ${req.user!.userId}: ${priceCheck.reason}`);
      }

      // Generate Asset DNA ID
      const assetId = generateAssetId();

      // Clean and prepare property data
      const cleanedData: any = {
        ...req.body,
        assetId,
        listedBy: req.user!.userId,
        status: 'DRAFT', // Will be set to APPROVED on final submission (auto-approved, no admin review)
      };

      // Remove empty strings from enum fields (convert to undefined)
      const cleanEnumField = (value: any) => {
        return value === '' || value === null ? undefined : value;
      };

      // Clean residential fields
      if (cleanedData.residential) {
        if (cleanedData.propertyCategory !== 'RESIDENTIAL') {
          delete cleanedData.residential;
        } else {
          if (cleanedData.residential.furnishing !== undefined) {
            cleanedData.residential.furnishing = cleanEnumField(cleanedData.residential.furnishing);
          }
          if (cleanedData.residential.parking !== undefined) {
            cleanedData.residential.parking = cleanEnumField(cleanedData.residential.parking);
          }
        }
      }

      // Clean commercial fields
      if (cleanedData.commercial && cleanedData.propertyCategory !== 'COMMERCIAL') {
        delete cleanedData.commercial;
      }

      // Clean land fields
      if (cleanedData.land) {
        if (cleanedData.propertyCategory !== 'LAND') {
          delete cleanedData.land;
        }
      }

      // Ensure location.coordinates is properly formatted as GeoJSON Point (if provided)
      // Temporarily making coordinates optional
      if (cleanedData.location && cleanedData.location.coordinates) {
        let coords: [number, number] | undefined;
        
        // Extract coordinates from different possible structures
        if (cleanedData.location.coordinates.coordinates && Array.isArray(cleanedData.location.coordinates.coordinates)) {
          coords = cleanedData.location.coordinates.coordinates;
        } else if (Array.isArray(cleanedData.location.coordinates)) {
          coords = cleanedData.location.coordinates;
        } else {
          // Invalid format, remove coordinates
          delete cleanedData.location.coordinates;
        }

        // If we have valid coordinates, validate and format them
        if (coords && Array.isArray(coords) && coords.length === 2) {
          const [lng, lat] = coords;
          // Only validate if coordinates are provided and not [0, 0]
          if (lng !== 0 || lat !== 0) {
            if (!isNaN(lng) && !isNaN(lat) && lng !== undefined && lat !== undefined) {
              // Ensure coordinates are properly formatted as GeoJSON Point
              cleanedData.location.coordinates = {
                type: 'Point',
                coordinates: [Number(lng), Number(lat)], // Ensure numbers, [longitude, latitude]
              };
            } else {
              // Invalid coordinates, remove them
              delete cleanedData.location.coordinates;
            }
          } else {
            // [0, 0] is invalid, remove coordinates
            delete cleanedData.location.coordinates;
          }
        } else {
          // Invalid format, remove coordinates
          delete cleanedData.location.coordinates;
        }
      }

      // Create property
      const property = new Property(cleanedData);
      await property.save();

      // Create Asset DNA
      await createOrUpdateAssetDNA(property, assetId);
      await property.save();

      res.status(201).json({
        success: true,
        property: {
          id: property._id,
          assetId: property.assetId,
          status: property.status,
          assetDNA: property.assetDNA,
        },
        warnings: priceCheck.isAnomaly ? [priceCheck.reason] : [],
      });
    } catch (error: any) {
      console.error('Error creating property:', error);
      res.status(500).json({
        error: 'Failed to create property listing',
        message: error.message,
      });
    }
  }
);

/**
 * @route   PUT /api/properties/:id
 * @desc    Update a property listing
 * @access  Private (Owner of listing, Admin)
 */
router.put(
  '/:id',
  authenticate,
  validatePropertyListing(),
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const property = await Property.findById(req.params.id);

      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }

      // Check ownership or admin
      if (property.listedBy.toString() !== req.user!.userId && req.user!.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Not authorized to update this property' });
      }

      // Don't allow changing assetId
      const { assetId, ...updateData } = req.body;

      // Clean and prepare update data
      const cleanEnumField = (value: any) => {
        return value === '' || value === null ? undefined : value;
      };

      // Clean residential fields
      if (updateData.residential !== undefined) {
        if (updateData.propertyCategory && updateData.propertyCategory !== 'RESIDENTIAL') {
          delete updateData.residential;
        } else if (updateData.residential) {
          if (updateData.residential.furnishing !== undefined) {
            updateData.residential.furnishing = cleanEnumField(updateData.residential.furnishing);
          }
          if (updateData.residential.parking !== undefined) {
            updateData.residential.parking = cleanEnumField(updateData.residential.parking);
          }
        }
      }

      // Clean commercial fields
      if (updateData.commercial !== undefined && updateData.propertyCategory && updateData.propertyCategory !== 'COMMERCIAL') {
        delete updateData.commercial;
      }

      // Clean land fields
      if (updateData.land !== undefined && updateData.propertyCategory && updateData.propertyCategory !== 'LAND') {
        delete updateData.land;
      }

      // Clean and format location coordinates if provided
      if (updateData.location && updateData.location.coordinates) {
        let coords: [number, number] | undefined;
        
        // Extract coordinates from different possible structures
        if (updateData.location.coordinates.coordinates && Array.isArray(updateData.location.coordinates.coordinates)) {
          coords = updateData.location.coordinates.coordinates;
        } else if (Array.isArray(updateData.location.coordinates)) {
          coords = updateData.location.coordinates;
        } else {
          // Invalid format, remove coordinates
          delete updateData.location.coordinates;
        }

        // If we have valid coordinates, validate and format them
        if (coords && Array.isArray(coords) && coords.length === 2) {
          const [lng, lat] = coords;
          // Only validate if coordinates are provided and not [0, 0]
          if (lng !== 0 || lat !== 0) {
            if (!isNaN(lng) && !isNaN(lat) && lng !== undefined && lat !== undefined) {
              // Ensure coordinates are properly formatted as GeoJSON Point
              updateData.location.coordinates = {
                type: 'Point',
                coordinates: [Number(lng), Number(lat)],
              };
            } else {
              // Invalid coordinates, remove them
              delete updateData.location.coordinates;
            }
          } else {
            // [0, 0] is invalid, remove coordinates
            delete updateData.location.coordinates;
          }
        } else {
          // Invalid format, remove coordinates
          delete updateData.location.coordinates;
        }
      }

      const oldStatus = property.status;
      Object.assign(property, updateData);
      await property.save();

      // Update Asset DNA if location or legal info changed
      if (updateData.location || updateData.legal) {
        await createOrUpdateAssetDNA(property, property.assetId);
        await property.save();
      }

      // Check if property status changed to SOLD or RENTED - create public notification
      if (updateData.status && oldStatus !== updateData.status) {
        if (updateData.status === 'SOLD' || updateData.status === 'RENTED') {
          await notifyPropertySoldOrRented(
            property._id,
            property.title,
            property.propertyCategory,
            property.transactionType,
            {
              city: property.location?.city,
              area: property.location?.area,
              state: property.location?.state,
            }
          );
        }
      }

      res.json({
        success: true,
        property: {
          id: property._id,
          ...property.toObject(),
        },
      });
    } catch (error: any) {
      console.error('Error updating property:', error);
      res.status(500).json({
        error: 'Failed to update property listing',
        message: error.message,
      });
    }
  }
);

/**
 * @route   POST /api/properties/:id/submit
 * @desc    Submit property (auto-approve, change status from DRAFT to APPROVED)
 * @access  Private (Owner of listing)
 */
router.post(
  '/:id/submit',
  authenticate,
  async (req: AuthRequest, res) => {
    try {
      // Validate property ID
      if (!req.params.id || req.params.id === 'undefined' || req.params.id === 'null') {
        return res.status(400).json({ error: 'Invalid property ID' });
      }

      const property = await Property.findById(req.params.id);

      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }

      if (property.listedBy.toString() !== req.user!.userId) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      if (property.status !== 'DRAFT') {
        return res.status(400).json({
          error: 'Property is not in draft status',
          currentStatus: property.status,
        });
      }

      // Validate required fields
      if (!property.media.images || property.media.images.length < 3) {
        return res.status(400).json({
          error: 'At least 3 images are required before submission',
        });
      }

      // Temporarily making coordinates optional
      // if (!property.location.coordinates?.coordinates) {
      //   return res.status(400).json({
      //     error: 'Location coordinates are required',
      //   });
      // }

      // Auto-approve property (no admin approval needed)
      property.status = 'APPROVED';
      property.isVerified = true;
      property.publishedAt = new Date();
      await property.save();

      // Delete draft from Draft collection if draftId is provided
      // This ensures draft is removed when property is submitted
      const { draftId } = req.body;
      if (draftId) {
        try {
          const Draft = (await import('../models/Draft')).default;
          await Draft.deleteOne({ draftId, userId: req.user!.userId });
        } catch (draftError: any) {
          // Log but don't fail - draft might not exist or already deleted
          console.warn(`Failed to delete draft ${draftId} after property submission:`, draftError.message);
        }
      }

      // Create notification for property owner (ONLY to owner)
      await notifyPropertyApproved(
        property.listedBy,
        property._id.toString(),
        property.title
      );

      // Create public notification for all users (property added)
      await notifyNewPropertyAdded(
        property._id,
        property.title,
        property.propertyCategory,
        property.transactionType,
        {
          city: property.location?.city,
          area: property.location?.area,
          state: property.location?.state,
        }
      );

      res.json({
        success: true,
        message: 'Property created successfully and is now live',
        property: {
          id: property._id,
          status: property.status,
          assetDNA: property.assetDNA,
        },
      });
    } catch (error: any) {
      console.error('Error submitting property:', error);
      res.status(500).json({
        error: 'Failed to submit property',
        message: error.message,
      });
    }
  }
);

/**
 * @route   GET /api/properties/:id
 * @desc    Get property by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('listedBy', 'firstName lastName email role trustScore')
      .select('-__v');

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Increment views
    property.views += 1;
    await property.save();

    res.json({
      success: true,
      property,
    });
  } catch (error: any) {
    console.error('Error fetching property:', error);
    res.status(500).json({
      error: 'Failed to fetch property',
      message: error.message,
    });
  }
});

/**
 * @route   GET /api/properties
 * @desc    Get all properties with filters
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const {
      transactionType,
      propertyCategory,
      propertySubType,
      city,
      state,
      area,
      pincode,
      minPrice,
      maxPrice,
      minRentAmount,
      maxRentAmount,
      minLeaseValue,
      maxLeaseValue,
      minArea,
      maxArea,
      bhk,
      furnishing,
      parking,
      ownershipType,
      possessionStatus,
      reraRegistered,
      titleClear,
      encumbranceFree,
      verified,
      maxAge,
      status,
      page = 1,
      limit = 20,
    } = req.query;

    const query: any = {};

    // Basic filters
    if (transactionType) query.transactionType = transactionType;
    if (propertyCategory) query.propertyCategory = propertyCategory;
    if (propertySubType) query.propertySubType = propertySubType;
    
    // Location filters
    if (city) query['location.city'] = new RegExp(city as string, 'i');
    if (state) query['location.state'] = new RegExp(state as string, 'i');
    if (area) query['location.area'] = new RegExp(area as string, 'i');
    if (pincode) query['location.pincode'] = pincode;
    
    // Filter by listedBy if provided (for user's own properties in dashboard)
    if (req.query.listedBy) {
      query.listedBy = req.query.listedBy;
    }
    
    // Status filter
    if (status) {
      query.status = status;
    } else {
      // Default: show APPROVED, PENDING, and DRAFT (exclude PAUSED - paused properties are private)
      // PAUSED properties are hidden from public view
      // If listedBy filter is present, show all statuses including PAUSED (for owner's dashboard)
      if (req.query.listedBy) {
        // Owner viewing their own properties - show all including PAUSED
        query.status = { $in: ['APPROVED', 'PENDING', 'DRAFT', 'PAUSED'] };
      } else {
        // Public view - exclude PAUSED properties
        query.status = { $in: ['APPROVED', 'PENDING', 'DRAFT'] };
      }
    }

    // Pricing filters - handle different transaction types
    const pricingQuery: any = {};
    
    // For SELL or FRACTIONAL - use expectedPrice
    if ((transactionType === 'SELL' || transactionType === 'FRACTIONAL' || !transactionType) && (minPrice || maxPrice)) {
      if (minPrice) pricingQuery['pricing.expectedPrice'] = { $gte: Number(minPrice) };
      if (maxPrice) {
        pricingQuery['pricing.expectedPrice'] = {
          ...(pricingQuery['pricing.expectedPrice'] || {}),
          $lte: Number(maxPrice),
        };
      }
    }
    
    // For RENT or SUB_LEASE - use rentAmount
    if ((transactionType === 'RENT' || transactionType === 'SUB_LEASE') && (minRentAmount || maxRentAmount || minPrice || maxPrice)) {
      const minRent = minRentAmount || minPrice;
      const maxRent = maxRentAmount || maxPrice;
      if (minRent) pricingQuery['pricing.rentAmount'] = { $gte: Number(minRent) };
      if (maxRent) {
        pricingQuery['pricing.rentAmount'] = {
          ...(pricingQuery['pricing.rentAmount'] || {}),
          $lte: Number(maxRent),
        };
      }
    }
    
    // For LEASE - use leaseValue
    if (transactionType === 'LEASE' && (minLeaseValue || maxLeaseValue)) {
      if (minLeaseValue) pricingQuery['pricing.leaseValue'] = { $gte: Number(minLeaseValue) };
      if (maxLeaseValue) {
        pricingQuery['pricing.leaseValue'] = {
          ...(pricingQuery['pricing.leaseValue'] || {}),
          $lte: Number(maxLeaseValue),
        };
      }
    }
    
    // If no transaction type specified, check all pricing fields
    if (!transactionType && (minPrice || maxPrice)) {
      query.$or = [
        { 'pricing.expectedPrice': {} },
        { 'pricing.rentAmount': {} },
        { 'pricing.leaseValue': {} },
      ];
      if (minPrice) {
        query.$or[0]['pricing.expectedPrice'].$gte = Number(minPrice);
        query.$or[1]['pricing.rentAmount'].$gte = Number(minPrice);
        query.$or[2]['pricing.leaseValue'].$gte = Number(minPrice);
      }
      if (maxPrice) {
        query.$or[0]['pricing.expectedPrice'].$lte = Number(maxPrice);
        query.$or[1]['pricing.rentAmount'].$lte = Number(maxPrice);
        query.$or[2]['pricing.leaseValue'].$lte = Number(maxPrice);
      }
    } else if (Object.keys(pricingQuery).length > 0) {
      Object.assign(query, pricingQuery);
    }

    // Area filters
    if (minArea || maxArea) {
      const areaQuery: any = {};
      if (propertyCategory === 'LAND') {
        // For land, filter by land.plotArea
        if (minArea) areaQuery['land.plotArea'] = { $gte: Number(minArea) };
        if (maxArea) {
          areaQuery['land.plotArea'] = {
            ...(areaQuery['land.plotArea'] || {}),
            $lte: Number(maxArea),
          };
        }
      } else if (propertyCategory === 'RESIDENTIAL') {
        // For residential, might need to add area field or use a different approach
        // This would depend on your schema - you might need to add area to residential
        // For now, we'll skip residential area filtering or handle it differently
      } else {
        // For commercial/industrial, filter by commercial.builtUpArea
        if (minArea) areaQuery['commercial.builtUpArea'] = { $gte: Number(minArea) };
        if (maxArea) {
          areaQuery['commercial.builtUpArea'] = {
            ...(areaQuery['commercial.builtUpArea'] || {}),
            $lte: Number(maxArea),
          };
        }
      }
      if (Object.keys(areaQuery).length > 0) {
        Object.assign(query, areaQuery);
      }
    }

    // Residential specific filters
    if (bhk) query['residential.bhk'] = Number(bhk);
    if (furnishing) query['residential.furnishing'] = furnishing;
    if (parking) query['residential.parking'] = parking;

    // Property details filters
    if (ownershipType) query.ownershipType = ownershipType;
    if (possessionStatus) query.possessionStatus = possessionStatus;
    if (maxAge) {
      const currentYear = new Date().getFullYear();
      query.propertyAge = { $lte: Number(maxAge) };
    }

    // Legal filters
    if (reraRegistered === 'true') query['legal.reraNumber'] = { $exists: true, $ne: '' };
    if (titleClear === 'true') query['legal.titleClear'] = true;
    if (encumbranceFree === 'true') query['legal.encumbranceFree'] = true;
    if (verified === 'true') query.isVerified = true;

    const skip = (Number(page) - 1) * Number(limit);

    const properties = await Property.find(query)
      .populate('listedBy', 'firstName lastName role trustScore')
      .sort({ createdAt: -1, publishedAt: -1 }) // Sort by newest first (createdAt, then publishedAt)
      .skip(skip)
      .limit(Number(limit))
      .select('-__v');

    const total = await Property.countDocuments(query);

    res.json({
      success: true,
      properties,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error('Error fetching properties:', error);
    res.status(500).json({
      error: 'Failed to fetch properties',
      message: error.message,
    });
  }
});

/**
 * @route   POST /api/properties/:id/approve
 * @desc    Approve a property (Admin only)
 * @access  Private (Admin)
 */
router.post(
  '/:id/approve',
  authenticate,
  authorize('ADMIN'),
  async (req: AuthRequest, res) => {
    try {
      const property = await Property.findById(req.params.id);

      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }

      if (property.status !== 'PENDING') {
        return res.status(400).json({
          error: 'Property is not pending approval',
          currentStatus: property.status,
        });
      }

      property.status = 'APPROVED';
      property.isVerified = true;
      await property.save();

      // Create notification for property owner
      await notifyPropertyApproved(
        property.listedBy,
        property._id.toString(),
        property.title
      );

      res.json({
        success: true,
        message: 'Property approved successfully',
        property: {
          id: property._id,
          status: property.status,
          isVerified: property.isVerified,
        },
      });
    } catch (error: any) {
      console.error('Error approving property:', error);
      res.status(500).json({
        error: 'Failed to approve property',
        message: error.message,
      });
    }
  }
);

/**
 * @route   POST /api/properties/:id/reject
 * @desc    Reject a property (Admin only)
 * @access  Private (Admin)
 */
router.post(
  '/:id/reject',
  authenticate,
  authorize('ADMIN'),
  [
    body('reason').optional().isString().trim(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const property = await Property.findById(req.params.id);

      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }

      if (property.status !== 'PENDING') {
        return res.status(400).json({
          error: 'Property is not pending approval',
          currentStatus: property.status,
        });
      }

      property.status = 'REJECTED';
      await property.save();

      // Create notification for property owner
      await notifyPropertyRejected(
        property.listedBy,
        property._id.toString(),
        property.title,
        req.body.reason
      );

      res.json({
        success: true,
        message: 'Property rejected',
        property: {
          id: property._id,
          status: property.status,
        },
      });
    } catch (error: any) {
      console.error('Error rejecting property:', error);
      res.status(500).json({
        error: 'Failed to reject property',
        message: error.message,
      });
    }
  }
);

/**
 * @route   PUT /api/properties/:id/pause
 * @desc    Pause/Private a property (only owner can do this)
 * @access  Private (Owner only - strict ownership check)
 */
router.put('/:id/pause', authenticate, async (req: AuthRequest, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // STRICT OWNERSHIP CHECK - Only the person who created/uploaded the property can pause it
    // No admin override - only the creator can pause their own property
    if (property.listedBy.toString() !== req.user!.userId) {
      return res.status(403).json({ 
        error: 'Not authorized',
        message: 'Only the property owner can pause this property'
      });
    }

    // Change status to PAUSED (makes it private/hidden)
    property.status = 'PAUSED';
    await property.save();

    // Create notification for property owner (ONLY to owner)
    await notifyPropertyPaused(
      property.listedBy,
      property._id.toString(),
      property.title
    );

    res.json({
      success: true,
      message: 'Property paused successfully. It is now hidden from public view.',
      property: {
        id: property._id,
        status: property.status,
      },
    });
  } catch (error: any) {
    console.error('Error pausing property:', error);
    res.status(500).json({
      error: 'Failed to pause property',
      message: error.message,
    });
  }
});

/**
 * @route   PUT /api/properties/:id/resume
 * @desc    Resume/Unpause a property (only owner can do this)
 * @access  Private (Owner only - strict ownership check)
 */
router.put('/:id/resume', authenticate, async (req: AuthRequest, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // STRICT OWNERSHIP CHECK - Only the person who created/uploaded the property can resume it
    if (property.listedBy.toString() !== req.user!.userId) {
      return res.status(403).json({ 
        error: 'Not authorized',
        message: 'Only the property owner can resume this property'
      });
    }

    if (property.status !== 'PAUSED') {
      return res.status(400).json({
        error: 'Property is not paused',
        currentStatus: property.status,
      });
    }

    // Change status back to APPROVED
    property.status = 'APPROVED';
    await property.save();

    // Create notification for property owner (ONLY to owner)
    await notifyPropertyResumed(
      property.listedBy,
      property._id.toString(),
      property.title
    );

    res.json({
      success: true,
      message: 'Property resumed successfully. It is now visible to the public.',
      property: {
        id: property._id,
        status: property.status,
      },
    });
  } catch (error: any) {
    console.error('Error resuming property:', error);
    res.status(500).json({
      error: 'Failed to resume property',
      message: error.message,
    });
  }
});

/**
 * @route   DELETE /api/properties/:id
 * @desc    Delete a property listing (only owner can do this)
 * @access  Private (Owner only - strict ownership check)
 */
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // STRICT OWNERSHIP CHECK - Only the person who created/uploaded the property can delete it
    // No admin override - only the creator can delete their own property
    if (property.listedBy.toString() !== req.user!.userId) {
      return res.status(403).json({ 
        error: 'Not authorized',
        message: 'Only the property owner can delete this property'
      });
    }

    await Property.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Property deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting property:', error);
    res.status(500).json({
      error: 'Failed to delete property',
      message: error.message,
    });
  }
});

export default router;

