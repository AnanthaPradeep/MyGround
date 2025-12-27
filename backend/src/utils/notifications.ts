import Notification from '../models/Notification';
import PublicNotification from '../models/PublicNotification';
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
 * This notification goes ONLY to the property owner
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
 * Create public notification for all users when a new property is added
 * This is a general notification visible to all users
 */
export async function notifyNewPropertyAdded(
  propertyId: string | Types.ObjectId,
  propertyTitle: string,
  propertyCategory: string,
  transactionType: string,
  location?: {
    city?: string;
    area?: string;
    state?: string;
  }
): Promise<void> {
  try {
    await PublicNotification.create({
      type: 'PROPERTY_ADDED',
      propertyId,
      propertyTitle,
      propertyCategory,
      transactionType,
      location: location || {},
    });
  } catch (error) {
    console.error('Error creating public notification:', error);
    // Don't throw - public notifications are non-critical
  }
}

/**
 * Create public notification when property is sold/rented
 */
export async function notifyPropertySoldOrRented(
  propertyId: string | Types.ObjectId,
  propertyTitle: string,
  propertyCategory: string,
  transactionType: string,
  location?: {
    city?: string;
    area?: string;
    state?: string;
  }
): Promise<void> {
  try {
    const notificationType = transactionType === 'SELL' ? 'PROPERTY_SOLD' : 'PROPERTY_RENTED';
    await PublicNotification.create({
      type: notificationType,
      propertyId,
      propertyTitle,
      propertyCategory,
      transactionType,
      location: location || {},
    });
  } catch (error) {
    console.error('Error creating public notification:', error);
  }
}

/**
 * Create public notification when property is deleted
 */
export async function notifyPublicPropertyDeleted(
  propertyId: string | Types.ObjectId,
  propertyTitle: string,
  propertyCategory: string,
  transactionType: string,
  location?: {
    city?: string;
    area?: string;
    state?: string;
  }
): Promise<void> {
  try {
    await PublicNotification.create({
      type: 'PROPERTY_DELETED',
      propertyId,
      propertyTitle,
      propertyCategory,
      transactionType,
      location: location || {},
    });
  } catch (error) {
    console.error('Error creating public notification:', error);
  }
}

/**
 * Create notification when property is deleted (only to owner)
 */
export async function notifyPropertyDeleted(
  userId: string | Types.ObjectId,
  propertyId: string,
  propertyTitle: string
): Promise<void> {
  await createNotification({
    userId,
    title: 'Property Deleted',
    message: `Your property "${propertyTitle}" has been deleted successfully.`,
    type: 'info',
    metadata: {
      propertyId,
    },
  });
}

/**
 * Create notification when property is paused (only to owner)
 */
export async function notifyPropertyPaused(
  userId: string | Types.ObjectId,
  propertyId: string,
  propertyTitle: string
): Promise<void> {
  await createNotification({
    userId,
    title: 'Property Paused',
    message: `Your property "${propertyTitle}" has been paused and is now hidden from public view.`,
    type: 'warning',
    link: `/properties/${propertyId}`,
    metadata: {
      propertyId,
    },
  });
}

/**
 * Create notification when property is resumed (only to owner)
 */
export async function notifyPropertyResumed(
  userId: string | Types.ObjectId,
  propertyId: string,
  propertyTitle: string
): Promise<void> {
  await createNotification({
    userId,
    title: 'Property Resumed',
    message: `Your property "${propertyTitle}" has been resumed and is now visible to the public.`,
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

