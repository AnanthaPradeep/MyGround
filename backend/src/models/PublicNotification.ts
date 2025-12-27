import mongoose, { Document, Schema } from 'mongoose';

/**
 * Public Notifications Model
 * Stores general notifications visible to all users (property added, sold, rented, etc.)
 * Different from user-specific notifications
 */
export interface IPublicNotification extends Document {
  type: 'PROPERTY_ADDED' | 'PROPERTY_SOLD' | 'PROPERTY_RENTED' | 'PROPERTY_DELETED' | 'PROPERTY_UPDATED';
  propertyId: mongoose.Types.ObjectId;
  propertyTitle: string;
  propertyCategory: string;
  transactionType: string;
  location?: {
    city?: string;
    area?: string;
    state?: string;
  };
  metadata?: {
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PublicNotificationSchema = new Schema<IPublicNotification>(
  {
    type: {
      type: String,
      enum: ['PROPERTY_ADDED', 'PROPERTY_SOLD', 'PROPERTY_RENTED', 'PROPERTY_DELETED', 'PROPERTY_UPDATED'],
      required: true,
      index: true,
    },
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
      index: true,
    },
    propertyTitle: {
      type: String,
      required: true,
    },
    propertyCategory: {
      type: String,
      required: true,
    },
    transactionType: {
      type: String,
      required: true,
    },
    location: {
      city: String,
      area: String,
      state: String,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
PublicNotificationSchema.index({ type: 1, createdAt: -1 });
PublicNotificationSchema.index({ propertyId: 1 });

export default mongoose.model<IPublicNotification>('PublicNotification', PublicNotificationSchema);

