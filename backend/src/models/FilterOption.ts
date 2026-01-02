import mongoose, { Document, Schema } from 'mongoose';

export interface IFilterOption extends Document {
  optionType: 'TRANSACTION_TYPE' | 'PROPERTY_CATEGORY' | 'PROPERTY_SUBTYPE' | 'OWNERSHIP_TYPE' | 'POSSESSION_STATUS' | 'FURNISHING_TYPE' | 'PARKING_TYPE' | 'AREA_UNIT' | 'BHK_OPTION';
  value: string;
  label: string;
  category?: string; // For property sub-types, this is the parent category
  order?: number; // For ordering options
  isActive: boolean;
  metadata?: {
    description?: string;
    icon?: string;
    color?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const FilterOptionSchema = new Schema<IFilterOption>(
  {
    optionType: {
      type: String,
      enum: ['TRANSACTION_TYPE', 'PROPERTY_CATEGORY', 'PROPERTY_SUBTYPE', 'OWNERSHIP_TYPE', 'POSSESSION_STATUS', 'FURNISHING_TYPE', 'PARKING_TYPE', 'AREA_UNIT', 'BHK_OPTION'],
      required: true,
      index: true,
    },
    value: {
      type: String,
      required: true,
      trim: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    metadata: {
      description: String,
      icon: String,
      color: String,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
FilterOptionSchema.index({ optionType: 1, isActive: 1, order: 1 });
FilterOptionSchema.index({ optionType: 1, category: 1, isActive: 1 });

export default mongoose.model<IFilterOption>('FilterOption', FilterOptionSchema);


