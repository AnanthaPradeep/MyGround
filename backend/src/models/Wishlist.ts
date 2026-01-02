import mongoose, { Document, Schema } from 'mongoose';

export interface IWishlist extends Document {
  userId: mongoose.Types.ObjectId;
  propertyId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const WishlistSchema = new Schema<IWishlist>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one property per user (prevent duplicates)
WishlistSchema.index({ userId: 1, propertyId: 1 }, { unique: true });

export default mongoose.model<IWishlist>('Wishlist', WishlistSchema);



