import express, { Router, Response } from 'express';
import Wishlist from '../models/Wishlist';
import Property from '../models/Property';
import { authenticate, AuthRequest } from '../middleware/auth';
import mongoose from 'mongoose';

const router: Router = express.Router();

/**
 * @route   GET /api/wishlist
 * @desc    Get user's wishlist items
 * @access  Private
 */
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { limit = 50, page = 1 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const wishlistItems = await Wishlist.find({ userId })
      .populate({
        path: 'propertyId',
        select: '-__v',
        populate: {
          path: 'listedBy',
          select: 'firstName lastName email',
        },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select('-__v');

    // Filter out items where property was deleted
    const validItems = wishlistItems.filter((item: any) => item.propertyId !== null);

    const total = await Wishlist.countDocuments({ userId });

    res.json({
      success: true,
      wishlist: validItems.map((item: any) => ({
        id: item._id,
        property: item.propertyId,
        createdAt: item.createdAt,
      })),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({
      error: 'Failed to fetch wishlist',
      message: error.message,
    });
  }
});

/**
 * @route   POST /api/wishlist
 * @desc    Add property to wishlist
 * @access  Private
 */
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { propertyId } = req.body;

    if (!propertyId) {
      return res.status(400).json({ error: 'Property ID is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ error: 'Invalid property ID' });
    }

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Check if already in wishlist
    const existing = await Wishlist.findOne({ userId, propertyId });
    if (existing) {
      return res.status(400).json({ error: 'Property already in wishlist' });
    }

    // Add to wishlist
    const wishlistItem = new Wishlist({
      userId,
      propertyId,
    });

    await wishlistItem.save();

    // Increment property saves count
    await Property.findByIdAndUpdate(propertyId, { $inc: { saves: 1 } });

    res.status(201).json({
      success: true,
      message: 'Property added to wishlist',
      wishlistItem: {
        id: wishlistItem._id,
        propertyId: wishlistItem.propertyId,
        createdAt: wishlistItem.createdAt,
      },
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Property already in wishlist' });
    }
    console.error('Error adding to wishlist:', error);
    res.status(500).json({
      error: 'Failed to add to wishlist',
      message: error.message,
    });
  }
});

/**
 * @route   DELETE /api/wishlist/:propertyId
 * @desc    Remove property from wishlist
 * @access  Private
 */
router.delete('/:propertyId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { propertyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ error: 'Invalid property ID' });
    }

    const wishlistItem = await Wishlist.findOneAndDelete({ userId, propertyId });

    if (!wishlistItem) {
      return res.status(404).json({ error: 'Property not found in wishlist' });
    }

    // Decrement property saves count
    await Property.findByIdAndUpdate(propertyId, { $inc: { saves: -1 } });

    res.json({
      success: true,
      message: 'Property removed from wishlist',
    });
  } catch (error: any) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({
      error: 'Failed to remove from wishlist',
      message: error.message,
    });
  }
});

/**
 * @route   GET /api/wishlist/check/:propertyId
 * @desc    Check if property is in user's wishlist
 * @access  Private
 */
router.get('/check/:propertyId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { propertyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ error: 'Invalid property ID' });
    }

    const wishlistItem = await Wishlist.findOne({ userId, propertyId });

    res.json({
      success: true,
      isInWishlist: !!wishlistItem,
    });
  } catch (error: any) {
    console.error('Error checking wishlist:', error);
    res.status(500).json({
      error: 'Failed to check wishlist',
      message: error.message,
    });
  }
});

/**
 * @route   GET /api/wishlist/count
 * @desc    Get wishlist count for user
 * @access  Private
 */
router.get('/count', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const count = await Wishlist.countDocuments({ userId });

    res.json({
      success: true,
      count,
    });
  } catch (error: any) {
    console.error('Error getting wishlist count:', error);
    res.status(500).json({
      error: 'Failed to get wishlist count',
      message: error.message,
    });
  }
});

export default router;


