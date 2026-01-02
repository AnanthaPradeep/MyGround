import mongoose, { Document, Schema } from 'mongoose';

/**
 * User Public Notification Read Model
 * Tracks which public notifications each user has seen/read
 */
export interface IUserPublicNotificationRead extends Document {
  userId: mongoose.Types.ObjectId;
  publicNotificationId: mongoose.Types.ObjectId;
  readAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserPublicNotificationReadSchema = new Schema<IUserPublicNotificationRead>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    publicNotificationId: {
      type: Schema.Types.ObjectId,
      ref: 'PublicNotification',
      required: true,
      index: true,
    },
    readAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one read record per user per notification
UserPublicNotificationReadSchema.index({ userId: 1, publicNotificationId: 1 }, { unique: true });

// Index for efficient queries
UserPublicNotificationReadSchema.index({ userId: 1, readAt: -1 });

export default mongoose.model<IUserPublicNotificationRead>('UserPublicNotificationRead', UserPublicNotificationReadSchema);

