import express, { Router } from 'express';
import PublicNotification from '../models/PublicNotification';

const router: Router = express.Router();

/**
 * @route   GET /api/public-notifications
 * @desc    Get public notifications (property added, sold, rented, deleted, etc.)
 * @access  Public (all users can see)
 */
router.get('/', async (req, res) => {
  try {
    const { type, limit = 50, page = 1 } = req.query;

    const query: any = {};

    if (type) {
      query.type = type;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const notifications = await PublicNotification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select('-__v');

    const total = await PublicNotification.countDocuments(query);

    res.json({
      success: true,
      notifications,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error('Error fetching public notifications:', error);
    res.status(500).json({
      error: 'Failed to fetch public notifications',
      message: error.message,
    });
  }
});

export default router;



