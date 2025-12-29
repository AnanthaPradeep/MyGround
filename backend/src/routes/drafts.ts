import express, { Router, Response } from 'express';
import Draft from '../models/Draft';
import Property from '../models/Property';
import { authenticate, AuthRequest } from '../middleware/auth';
import { randomUUID } from 'crypto';

const router: Router = express.Router();

/**
 * @route   GET /api/drafts
 * @desc    Get all drafts for the authenticated user
 * @access  Private
 */
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const drafts = await Draft.find({ userId })
      .sort({ updatedAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      drafts,
      count: drafts.length,
    });
  } catch (error: any) {
    console.error('Error fetching drafts:', error);
    res.status(500).json({
      error: 'Failed to fetch drafts',
      message: error.message,
    });
  }
});

/**
 * @route   GET /api/drafts/:draftId
 * @desc    Get a specific draft by ID
 * @access  Private (only owner)
 */
router.get('/:draftId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { draftId } = req.params;

    const draft = await Draft.findOne({ draftId, userId });

    if (!draft) {
      return res.status(404).json({ error: 'Draft not found' });
    }

    res.json({
      success: true,
      draft,
    });
  } catch (error: any) {
    console.error('Error fetching draft:', error);
    res.status(500).json({
      error: 'Failed to fetch draft',
      message: error.message,
    });
  }
});

/**
 * @route   POST /api/drafts
 * @desc    Create or update a draft
 * @access  Private
 */
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { draftId, propertyData, currentStep } = req.body;

    // Check if meaningful data exists
    const hasData = 
      propertyData?.title || 
      propertyData?.location?.city || 
      propertyData?.pricing?.expectedPrice || 
      propertyData?.pricing?.rentAmount || 
      propertyData?.description;

    if (!hasData && !draftId) {
      return res.status(400).json({ error: 'No data to save' });
    }

    let draft;
    const finalDraftId = draftId || randomUUID();

    if (draftId) {
      // Update existing draft
      draft = await Draft.findOneAndUpdate(
        { draftId, userId },
        {
          propertyData: propertyData || {},
          currentStep: currentStep || 1,
          lastSaved: new Date(),
        },
        { new: true, upsert: false }
      );

      if (!draft) {
        return res.status(404).json({ error: 'Draft not found' });
      }
    } else {
      // Create new draft
      draft = new Draft({
        userId,
        draftId: finalDraftId,
        propertyData: propertyData || {},
        currentStep: currentStep || 1,
        lastSaved: new Date(),
      });
      await draft.save();
    }

    res.json({
      success: true,
      draft: {
        draftId: draft.draftId,
        propertyData: draft.propertyData,
        currentStep: draft.currentStep,
        lastSaved: draft.lastSaved,
        updatedAt: draft.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Error saving draft:', error);
    res.status(500).json({
      error: 'Failed to save draft',
      message: error.message,
    });
  }
});

/**
 * @route   PUT /api/drafts/:draftId
 * @desc    Update a draft
 * @access  Private (only owner)
 */
router.put('/:draftId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { draftId } = req.params;
    const { propertyData, currentStep } = req.body;

    const draft = await Draft.findOneAndUpdate(
      { draftId, userId },
      {
        propertyData: propertyData || {},
        currentStep: currentStep || 1,
        lastSaved: new Date(),
      },
      { new: true }
    );

    if (!draft) {
      return res.status(404).json({ error: 'Draft not found' });
    }

    res.json({
      success: true,
      draft: {
        draftId: draft.draftId,
        propertyData: draft.propertyData,
        currentStep: draft.currentStep,
        lastSaved: draft.lastSaved,
        updatedAt: draft.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Error updating draft:', error);
    res.status(500).json({
      error: 'Failed to update draft',
      message: error.message,
    });
  }
});

/**
 * @route   POST /api/drafts/:draftId/submit
 * @desc    Submit draft as a property (convert draft to property)
 * @access  Private (only owner)
 */
router.post('/:draftId/submit', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { draftId } = req.params;

    // Get draft
    const draft = await Draft.findOne({ draftId, userId });

    if (!draft) {
      return res.status(404).json({ error: 'Draft not found' });
    }

    // Validate required fields
    const data = draft.propertyData;
    if (!data.title || !data.location?.city || (!data.pricing?.expectedPrice && !data.pricing?.rentAmount)) {
      return res.status(400).json({
        error: 'Incomplete draft',
        message: 'Please complete all required fields before submitting',
        missingFields: {
          title: !data.title,
          location: !data.location?.city,
          pricing: !data.pricing?.expectedPrice && !data.pricing?.rentAmount,
        },
      });
    }

    if (!data.media?.images || data.media.images.length < 3) {
      return res.status(400).json({
        error: 'Incomplete draft',
        message: 'At least 3 images are required',
      });
    }

    // Create property from draft
    const property = new Property({
      ...data,
      listedBy: userId,
      status: 'DRAFT', // Will be changed to APPROVED after submission
    });

    await property.save();

    // Delete draft after successful conversion
    await Draft.deleteOne({ draftId, userId });

    // Submit property (change to APPROVED)
    property.status = 'APPROVED';
    property.isVerified = true;
    property.publishedAt = new Date();
    await property.save();

    res.json({
      success: true,
      message: 'Draft submitted successfully',
      property: {
        id: property._id,
        status: property.status,
      },
    });
  } catch (error: any) {
    console.error('Error submitting draft:', error);
    res.status(500).json({
      error: 'Failed to submit draft',
      message: error.message,
    });
  }
});

/**
 * @route   DELETE /api/drafts/:draftId
 * @desc    Delete a draft
 * @access  Private (only owner)
 */
router.delete('/:draftId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { draftId } = req.params;

    const draft = await Draft.findOneAndDelete({ draftId, userId });

    if (!draft) {
      return res.status(404).json({ error: 'Draft not found' });
    }

    res.json({
      success: true,
      message: 'Draft deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting draft:', error);
    res.status(500).json({
      error: 'Failed to delete draft',
      message: error.message,
    });
  }
});

/**
 * @route   GET /api/drafts/count
 * @desc    Get draft count for the authenticated user
 * @access  Private
 */
router.get('/count/total', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const count = await Draft.countDocuments({ userId });

    res.json({
      success: true,
      count,
    });
  } catch (error: any) {
    console.error('Error fetching draft count:', error);
    res.status(500).json({
      error: 'Failed to fetch draft count',
      message: error.message,
    });
  }
});

export default router;

