import mongoose, { Document, Schema } from 'mongoose';

export interface IDraft extends Document {
  userId: mongoose.Types.ObjectId;
  draftId: string; // Unique identifier for the draft
  propertyData: {
    transactionType?: string;
    propertyCategory?: string;
    propertySubType?: string;
    location?: any;
    title?: string;
    description?: string;
    ownershipType?: string;
    possessionStatus?: string;
    pricing?: any;
    media?: any;
    legal?: any;
    residential?: any;
    commercial?: any;
    land?: any;
  };
  currentStep: number; // Last completed step (1-7)
  lastSaved: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DraftSchema = new Schema<IDraft>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    draftId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    propertyData: {
      type: Schema.Types.Mixed,
      default: {},
    },
    currentStep: {
      type: Number,
      default: 1,
      min: 1,
      max: 7,
    },
    lastSaved: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
DraftSchema.index({ userId: 1, draftId: 1 });
DraftSchema.index({ userId: 1, updatedAt: -1 });

const Draft = mongoose.model<IDraft>('Draft', DraftSchema);

export default Draft;



