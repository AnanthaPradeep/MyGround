import mongoose, { Document, Schema } from 'mongoose';

export interface IEAuctionBid extends Document {
  auctionId: mongoose.Types.ObjectId;
  bidderId: mongoose.Types.ObjectId;
  amount: number;
  status: 'ACTIVE' | 'OUTBID' | 'WITHDRAWN' | 'WINNING';
  createdAt: Date;
  updatedAt: Date;
}

const EAuctionBidSchema = new Schema<IEAuctionBid>(
  {
    auctionId: { type: Schema.Types.ObjectId, ref: 'EAuctionProperty', required: true },
    bidderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ['ACTIVE', 'OUTBID', 'WITHDRAWN', 'WINNING'],
      default: 'ACTIVE',
    },
  },
  { timestamps: true }
);

EAuctionBidSchema.index({ auctionId: 1, amount: -1 });
EAuctionBidSchema.index({ bidderId: 1, createdAt: -1 });

export default mongoose.model<IEAuctionBid>('EAuctionBid', EAuctionBidSchema);
