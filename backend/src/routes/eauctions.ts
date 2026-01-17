import express, { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import EAuctionProperty from '../models/EAuctionProperty';
import EAuctionBid from '../models/EAuctionBid';
import EAuctionParticipant from '../models/EAuctionParticipant';
import EAuctionDocument from '../models/EAuctionDocument';
import User from '../models/User';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router: Router = express.Router();

const INSTITUTION_ROLES = ['ADMIN', 'BANK', 'NBFC', 'GOVT', 'COURT', 'INSTITUTION'];

/**
 * @route   GET /api/eauctions
 * @desc    List auctions
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const {
      status,
      propertyCategory,
      authorityType,
      institutionType,
      institutionName,
      q,
      city,
      state,
      district,
      minPrice,
      maxPrice,
      sortBy,
      startDate,
      endDate,
      page = 1,
      limit = 20,
    } = req.query;

    const query: any = {};

    if (status) query.status = status;
    if (propertyCategory) query.propertyCategory = propertyCategory;
    if (authorityType) query.authorityType = authorityType;
    if (institutionType) query['institution.type'] = institutionType;
    if (institutionName) query['institution.name'] = new RegExp(institutionName as string, 'i');
    if (q) {
      query.$or = [
        { title: new RegExp(q as string, 'i') },
        { description: new RegExp(q as string, 'i') },
        { authorityName: new RegExp(q as string, 'i') },
        { 'institution.name': new RegExp(q as string, 'i') },
      ];
    }
    if (city) query['location.city'] = new RegExp(city as string, 'i');
    if (state) query['location.state'] = new RegExp(state as string, 'i');
    if (district) query['location.area'] = new RegExp(district as string, 'i');
    if (minPrice || maxPrice) {
      query.reservePrice = {};
      if (minPrice) query.reservePrice.$gte = Number(minPrice);
      if (maxPrice) query.reservePrice.$lte = Number(maxPrice);
    }
    if (startDate || endDate) {
      query.startAt = {};
      if (startDate) query.startAt.$gte = new Date(startDate as string);
      if (endDate) query.startAt.$lte = new Date(endDate as string);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const sortMap: Record<string, any> = {
      endingSoon: { endAt: 1 },
      lowestReserve: { reservePrice: 1 },
      latest: { createdAt: -1 },
    };

    const auctions = await EAuctionProperty.find(query)
      .sort(sortMap[(sortBy as string) || 'endingSoon'] || { endAt: 1 })
      .skip(skip)
      .limit(Number(limit))
      .select('-__v');

    const total = await EAuctionProperty.countDocuments(query);

    res.json({
      success: true,
      auctions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error('Error fetching auctions:', error);
    res.status(500).json({
      error: 'Failed to fetch auctions',
      message: error.message,
    });
  }
});

/**
 * @route   GET /api/eauctions/grouped
 * @desc    Grouped auctions by institution type and name
 * @access  Public
 */
router.get('/grouped', async (req, res) => {
  try {
    const { status } = req.query;
    const query: any = {};
    if (status) query.status = status;

    const auctions = await EAuctionProperty.find(query)
      .sort({ endAt: 1 })
      .select('-__v')
      .limit(200);

    const grouped: Record<string, Record<string, any[]>> = {};
    auctions.forEach((auction) => {
      const type = auction.institution?.type || auction.authorityType || 'INSTITUTION';
      const name = auction.institution?.name || auction.authorityName || 'Institution';
      if (!grouped[type]) grouped[type] = {};
      if (!grouped[type][name]) grouped[type][name] = [];
      grouped[type][name].push(auction);
    });

    res.json({ success: true, grouped });
  } catch (error: any) {
    console.error('Error fetching grouped auctions:', error);
    res.status(500).json({
      error: 'Failed to fetch grouped auctions',
      message: error.message,
    });
  }
});

/**
 * @route   GET /api/eauctions/filters
 * @desc    Get filter options from database
 * @access  Public
 */
router.get('/filters', async (req, res) => {
  try {
    const [institutionNames, states, cities] = await Promise.all([
      EAuctionProperty.distinct('institution.name'),
      EAuctionProperty.distinct('location.state'),
      EAuctionProperty.distinct('location.city'),
    ]);

    res.json({
      success: true,
      data: {
        institutionTypes: ['BANK', 'NBFC', 'GOVT', 'COURT', 'INSTITUTION'],
        statuses: ['UPCOMING', 'LIVE', 'CLOSED'],
        categories: ['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'LAND', 'SPECIAL', 'ISLAND'],
        institutionNames: institutionNames.filter(Boolean).sort(),
        states: states.filter(Boolean).sort(),
        cities: cities.filter(Boolean).sort(),
      },
    });
  } catch (error: any) {
    console.error('Error fetching auction filters:', error);
    res.status(500).json({
      error: 'Failed to fetch auction filters',
      message: error.message,
    });
  }
});

/**
 * @route   GET /api/eauctions/:id
 * @desc    Get auction detail
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const auction = await EAuctionProperty.findById(req.params.id)
      .populate('documents')
      .select('-__v');

    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }

    const highestBid = await EAuctionBid.findOne({ auctionId: auction._id })
      .sort({ amount: -1 })
      .select('amount createdAt');

    res.json({
      success: true,
      auction,
      highestBid,
    });
  } catch (error: any) {
    console.error('Error fetching auction:', error);
    res.status(500).json({
      error: 'Failed to fetch auction',
      message: error.message,
    });
  }
});

/**
 * @route   POST /api/eauctions
 * @desc    Create auction (institution-only)
 * @access  Private
 */
router.post(
  '/',
  authenticate,
  authorize(...INSTITUTION_ROLES),
  [
    body('title').notEmpty().isLength({ min: 10, max: 200 }),
    body('description').notEmpty().isLength({ min: 50, max: 10000 }),
    body('propertyCategory').isIn(['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'LAND', 'SPECIAL', 'ISLAND']),
    body('authorityType').isIn(['BANK', 'NBFC', 'GOVT', 'COURT', 'INSTITUTION']),
    body('authorityName').notEmpty(),
    body('reservePrice').isFloat({ min: 1 }),
    body('bidIncrement').isFloat({ min: 1 }),
    body('emdRequired').isBoolean(),
    body('emdAmount').optional().isFloat({ min: 0 }),
    body('startAt').isISO8601(),
    body('endAt').isISO8601(),
    body('media.images').isArray({ min: 1 }),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const auction = new EAuctionProperty({
        ...req.body,
        createdBy: req.user!.userId,
      });

      await auction.save();

      res.status(201).json({
        success: true,
        auction,
      });
    } catch (error: any) {
      console.error('Error creating auction:', error);
      res.status(500).json({
        error: 'Failed to create auction',
        message: error.message,
      });
    }
  }
);

/**
 * @route   PUT /api/eauctions/:id
 * @desc    Update auction (institution-only)
 * @access  Private
 */
router.put(
  '/:id',
  authenticate,
  authorize(...INSTITUTION_ROLES),
  async (req: AuthRequest, res: Response) => {
    try {
      const auction = await EAuctionProperty.findById(req.params.id);
      if (!auction) {
        return res.status(404).json({ error: 'Auction not found' });
      }

      // Only creator or admin can update
      if (auction.createdBy.toString() !== req.user!.userId && req.user!.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Not authorized to update this auction' });
      }

      Object.assign(auction, req.body);
      await auction.save();

      res.json({
        success: true,
        auction,
      });
    } catch (error: any) {
      console.error('Error updating auction:', error);
      res.status(500).json({
        error: 'Failed to update auction',
        message: error.message,
      });
    }
  }
);

/**
 * @route   PUT /api/eauctions/:id/status
 * @desc    Update auction status (pause/cancel/close)
 * @access  Private
 */
router.put(
  '/:id/status',
  authenticate,
  authorize(...INSTITUTION_ROLES),
  [body('status').isIn(['UPCOMING', 'LIVE', 'CLOSED', 'CANCELLED', 'PAUSED'])],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const auction = await EAuctionProperty.findById(req.params.id);
      if (!auction) {
        return res.status(404).json({ error: 'Auction not found' });
      }

      if (auction.createdBy.toString() !== req.user!.userId && req.user!.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Not authorized to update status' });
      }

      auction.status = req.body.status;
      await auction.save();

      res.json({ success: true, auction });
    } catch (error: any) {
      console.error('Error updating auction status:', error);
      res.status(500).json({
        error: 'Failed to update auction status',
        message: error.message,
      });
    }
  }
);

/**
 * @route   POST /api/eauctions/:id/participants/accept-terms
 * @desc    Accept auction terms
 * @access  Private
 */
router.post('/:id/participants/accept-terms', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const auction = await EAuctionProperty.findById(req.params.id);
    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }

    const user = await User.findById(req.user!.userId).select('kycStatus');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const participant = await EAuctionParticipant.findOneAndUpdate(
      { auctionId: auction._id, userId: req.user!.userId },
      {
        auctionId: auction._id,
        userId: req.user!.userId,
        kycStatusSnapshot: user.kycStatus,
        termsAcceptedAt: new Date(),
        status: user.kycStatus === 'VERIFIED' ? 'ELIGIBLE' : 'INELIGIBLE',
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, participant });
  } catch (error: any) {
    console.error('Error accepting terms:', error);
    res.status(500).json({
      error: 'Failed to accept terms',
      message: error.message,
    });
  }
});

/**
 * @route   POST /api/eauctions/:id/participants/emd
 * @desc    Mark EMD paid (admin/institution)
 * @access  Private
 */
router.post(
  '/:id/participants/emd',
  authenticate,
  authorize(...INSTITUTION_ROLES),
  [body('userId').notEmpty(), body('paymentReference').optional().isString()],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const participant = await EAuctionParticipant.findOneAndUpdate(
        { auctionId: req.params.id, userId: req.body.userId },
        {
          emdPaid: true,
          emdPaidAt: new Date(),
          paymentReference: req.body.paymentReference,
          status: 'ELIGIBLE',
        },
        { upsert: true, new: true }
      );

      res.json({ success: true, participant });
    } catch (error: any) {
      console.error('Error updating EMD:', error);
      res.status(500).json({
        error: 'Failed to update EMD',
        message: error.message,
      });
    }
  }
);

/**
 * @route   POST /api/eauctions/:id/bids
 * @desc    Place bid
 * @access  Private
 */
router.post(
  '/:id/bids',
  authenticate,
  [body('amount').isFloat({ min: 1 })],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const auction = await EAuctionProperty.findById(req.params.id);
      if (!auction) {
        return res.status(404).json({ error: 'Auction not found' });
      }

      if (auction.status !== 'LIVE') {
        return res.status(400).json({ error: 'Auction is not live' });
      }

      const user = await User.findById(req.user!.userId).select('kycStatus');
      if (!user || user.kycStatus !== 'VERIFIED') {
        return res.status(403).json({ error: 'KYC verification required to bid' });
      }

      const participant = await EAuctionParticipant.findOne({
        auctionId: auction._id,
        userId: req.user!.userId,
      });

      if (!participant || !participant.termsAcceptedAt) {
        return res.status(403).json({ error: 'Accept auction terms before bidding' });
      }

      if (auction.emdRequired && !participant.emdPaid) {
        return res.status(403).json({ error: 'EMD payment required before bidding' });
      }

      const highestBid = await EAuctionBid.findOne({ auctionId: auction._id }).sort({ amount: -1 });
      const minBid = highestBid ? highestBid.amount + auction.bidIncrement : auction.reservePrice;

      if (Number(req.body.amount) < minBid) {
        return res.status(400).json({
          error: 'Bid amount too low',
          minimumRequired: minBid,
        });
      }

      const bid = new EAuctionBid({
        auctionId: auction._id,
        bidderId: req.user!.userId,
        amount: Number(req.body.amount),
      });

      await bid.save();

      res.status(201).json({
        success: true,
        bid,
      });
    } catch (error: any) {
      console.error('Error placing bid:', error);
      res.status(500).json({
        error: 'Failed to place bid',
        message: error.message,
      });
    }
  }
);

/**
 * @route   GET /api/eauctions/:id/bids
 * @desc    Get bid history (masked)
 * @access  Private
 */
router.get('/:id/bids', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const bids = await EAuctionBid.find({ auctionId: req.params.id })
      .sort({ amount: -1, createdAt: -1 })
      .populate('bidderId', 'firstName lastName')
      .select('-__v');

    const masked = bids.map((bid) => ({
      id: bid._id,
      amount: bid.amount,
      createdAt: bid.createdAt,
      bidder: 'MG-' + bid._id.toString().slice(-6).toUpperCase(),
    }));

    res.json({ success: true, bids: masked });
  } catch (error: any) {
    console.error('Error fetching bids:', error);
    res.status(500).json({
      error: 'Failed to fetch bids',
      message: error.message,
    });
  }
});

/**
 * @route   POST /api/eauctions/:id/documents
 * @desc    Add legal document (institution-only)
 * @access  Private
 */
router.post(
  '/:id/documents',
  authenticate,
  authorize(...INSTITUTION_ROLES),
  [body('name').notEmpty(), body('url').isString().notEmpty()],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const doc = await EAuctionDocument.create({
        auctionId: req.params.id,
        name: req.body.name,
        type: req.body.type || 'OTHER',
        url: req.body.url,
        uploadedBy: req.user!.userId,
      });

      await EAuctionProperty.findByIdAndUpdate(req.params.id, {
        $addToSet: { documents: doc._id },
      });

      res.status(201).json({ success: true, document: doc });
    } catch (error: any) {
      console.error('Error adding document:', error);
      res.status(500).json({
        error: 'Failed to add document',
        message: error.message,
      });
    }
  }
);

export default router;
