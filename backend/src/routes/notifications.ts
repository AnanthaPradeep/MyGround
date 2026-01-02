import express, { Router } from 'express';
import Notification from '../models/Notification';
import { authenticate, AuthRequest } from '../middleware/auth';

const router: Router = express.Router();

/**
 * @route   GET /api/notifications
 * @desc    Get user's notifications
 * @access  Private
 */
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { read, limit = 50, page = 1 } = req.query;
    const userId = req.user!.userId;

    const query: any = { userId };

    if (read !== undefined) {
      query.read = read === 'true';
    }

    const skip = (Number(page) - 1) * Number(limit);

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select('-__v');

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ userId, read: false });

    res.json({
      success: true,
      notifications,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
      unreadCount,
    });
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      error: 'Failed to fetch notifications',
      message: error.message,
    });
  }
});

/**
 * @route   PUT /api/notifications/:id/read
 * @desc    Mark notification as read
 * @access  Private
 */
router.put('/:id/read', authenticate, async (req: AuthRequest, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user!.userId,
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    notification.read = true;
    await notification.save();

    res.json({
      success: true,
      notification,
    });
  } catch (error: any) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      error: 'Failed to mark notification as read',
      message: error.message,
    });
  }
});

/**
 * @route   PUT /api/notifications/read-all
 * @desc    Mark all notifications as read
 * @access  Private
 */
router.put('/read-all', authenticate, async (req: AuthRequest, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user!.userId, read: false },
      { read: true }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error: any) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      error: 'Failed to mark all notifications as read',
      message: error.message,
    });
  }
});

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Delete a notification
 * @access  Private
 */
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user!.userId,
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      error: 'Failed to delete notification',
      message: error.message,
    });
  }
});

export default router;



