import Notification from '../models/Notification';
import { Types } from 'mongoose';

interface CreateNotificationParams {
  userId: string | Types.ObjectId;
  title: string;
  message: string;
  type?: 'success' | 'warning' | 'error' | 'info' | 'property' | 'message';
  link?: string;
  metadata?: {
    propertyId?: string;
    [key: string]: any;
  };
}

/**
 * Create a notification for a user
 */
export async function createNotification(params: CreateNotificationParams): Promise<void> {
  try {
    await Notification.create({
      userId: params.userId,
      title: params.title,
      message: params.message,
      type: params.type || 'info',
      link: params.link,
      metadata: params.metadata || {},
      read: false,
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    // Don't throw - notifications are non-critical
  }
}

/**
 * Create notification when property is submitted for review
 */
export async function notifyPropertySubmitted(
  userId: string | Types.ObjectId,
  propertyId: string,
  propertyTitle: string
): Promise<void> {
  await createNotification({
    userId,
    title: 'Property Under Review',
    message: `Your property "${propertyTitle}" has been submitted for review. Please wait for admin confirmation.`,
    type: 'info',
    link: `/properties/${propertyId}`,
    metadata: {
      propertyId,
    },
  });
}

/**
 * Create notification when property is approved/created
 */
export async function notifyPropertyApproved(
  userId: string | Types.ObjectId,
  propertyId: string,
  propertyTitle: string
): Promise<void> {
  await createNotification({
    userId,
    title: 'Property Created Successfully',
    message: `Your property "${propertyTitle}" has been successfully created and is now live on MyGround.`,
    type: 'success',
    link: `/properties/${propertyId}`,
    metadata: {
      propertyId,
    },
  });
}

/**
 * Create notification when property is rejected
 */
export async function notifyPropertyRejected(
  userId: string | Types.ObjectId,
  propertyId: string,
  propertyTitle: string,
  reason?: string
): Promise<void> {
  await createNotification({
    userId,
    title: 'Property Rejected',
    message: `Your property "${propertyTitle}" has been rejected.${reason ? ` Reason: ${reason}` : ''}`,
    type: 'error',
    link: `/properties/${propertyId}`,
    metadata: {
      propertyId,
    },
  });
}

