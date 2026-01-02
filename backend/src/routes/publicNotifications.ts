import express, { Router } from 'express';
import mongoose from 'mongoose';
import PublicNotification from '../models/PublicNotification';
import UserPublicNotificationRead from '../models/UserPublicNotificationRead';
import { authenticate, AuthRequest } from '../middleware/auth';

const router: Router = express.Router();

/**
 * Optional authentication middleware - doesn't fail if no token
 */
const optionalAuthenticate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      const { verifyToken } = require('../utils/jwt');
      const User = require('../models/User').default;
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId).select('-password');
      if (user) {
        (req as AuthRequest).user = {
          userId: decoded.userId,
          email: decoded.email,
          role: decoded.role,
        };
      }
    }
  } catch (error) {
    // Ignore auth errors - continue without authentication
  }
  next();
};

/**
 * @route   GET /api/public-notifications
 * @desc    Get public notifications (property added, sold, rented, deleted, etc.)
 * @access  Public (all users can see, but read status only for authenticated users)
 */
router.get('/', optionalAuthenticate, async (req: express.Request, res) => {
  try {
    const { type, limit = 50, page = 1 } = req.query;
    // Get userId from auth if available (optional auth)
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;

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

    // If user is authenticated, check which notifications they've read
    let readNotificationIds: string[] = [];
    if (userId) {
      const userIdObjectId = new mongoose.Types.ObjectId(userId);
      const readRecords = await UserPublicNotificationRead.find({
        userId: userIdObjectId,
        publicNotificationId: { $in: notifications.map(n => n._id) },
      }).select('publicNotificationId');
      readNotificationIds = readRecords.map(r => r.publicNotificationId.toString());
    }

    // Add read status to notifications
    const notificationsWithReadStatus = notifications.map(notification => ({
      ...notification.toObject(),
      read: userId ? readNotificationIds.includes(notification._id.toString()) : false,
    }));

    // Count unread public notifications for authenticated users
    let unreadCount = 0;
    if (userId) {
      const userIdObjectId = new mongoose.Types.ObjectId(userId);
      const allPublicNotifications = await PublicNotification.find(query).select('_id');
      const allReadRecords = await UserPublicNotificationRead.find({
        userId: userIdObjectId,
        publicNotificationId: { $in: allPublicNotifications.map(n => n._id) },
      }).select('publicNotificationId');
      const allReadIds = allReadRecords.map(r => r.publicNotificationId.toString());
      unreadCount = allPublicNotifications.filter(
        n => !allReadIds.includes(n._id.toString())
      ).length;
    }

    res.json({
      success: true,
      notifications: notificationsWithReadStatus,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
      unreadCount,
    });
  } catch (error: any) {
    console.error('Error fetching public notifications:', error);
    res.status(500).json({
      error: 'Failed to fetch public notifications',
      message: error.message,
    });
  }
});

/**
 * @route   PUT /api/public-notifications/read-all
 * @desc    Mark all public notifications as read
 * @access  Private
 * NOTE: This route MUST come before /:id/read to avoid route conflicts
 */
router.put('/read-all', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;

    // Get all public notifications
    const allNotifications = await PublicNotification.find({}).select('_id');
    const notificationIds = allNotifications.map(n => n._id);

    // Convert userId to ObjectId
    const userIdObjectId = new mongoose.Types.ObjectId(userId);

    // Use bulkWrite for efficiency
    await UserPublicNotificationRead.bulkWrite(
      notificationIds.map(notificationId => ({
        updateOne: {
          filter: {
            userId: userIdObjectId,
            publicNotificationId: notificationId,
          },
          update: {
            $set: {
              userId: userIdObjectId,
              publicNotificationId: notificationId,
              readAt: new Date(),
            },
          },
          upsert: true,
        },
      }))
    );

    res.json({
      success: true,
      message: 'All public notifications marked as read',
    });
  } catch (error: any) {
    console.error('Error marking all public notifications as read:', error);
    res.status(500).json({
      error: 'Failed to mark all public notifications as read',
      message: error.message,
    });
  }
});

/**
 * @route   PUT /api/public-notifications/:id/read
 * @desc    Mark a public notification as read
 * @access  Private
 * NOTE: This route MUST come after /read-all to avoid route conflicts
 */
router.put('/:id/read', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    const publicNotificationId = req.params.id;

    // Check if notification exists
    const notification = await PublicNotification.findById(publicNotificationId);
    if (!notification) {
      return res.status(404).json({ error: 'Public notification not found' });
    }

    // Convert userId and publicNotificationId to ObjectId
    const userIdObjectId = new mongoose.Types.ObjectId(userId);
    const publicNotificationIdObjectId = new mongoose.Types.ObjectId(publicNotificationId);

    // Create or update read record
    await UserPublicNotificationRead.findOneAndUpdate(
      {
        userId: userIdObjectId,
        publicNotificationId: publicNotificationIdObjectId,
      },
      {
        userId: userIdObjectId,
        publicNotificationId: publicNotificationIdObjectId,
        readAt: new Date(),
      },
      {
        upsert: true,
        new: true,
      }
    );

    res.json({
      success: true,
      message: 'Public notification marked as read',
    });
  } catch (error: any) {
    console.error('Error marking public notification as read:', error);
    res.status(500).json({
      error: 'Failed to mark public notification as read',
      message: error.message,
    });
  }
});

export default router;




