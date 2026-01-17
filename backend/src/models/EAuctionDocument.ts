import mongoose, { Document, Schema } from 'mongoose';

export interface IEAuctionDocument extends Document {
  auctionId: mongoose.Types.ObjectId;
  name: string;
  type: 'NOTICE' | 'LEGAL' | 'TITLE' | 'REPORT' | 'OTHER';
  url: string;
  uploadedBy: mongoose.Types.ObjectId;
  uploadedAt: Date;
}

const EAuctionDocumentSchema = new Schema<IEAuctionDocument>(
  {
    auctionId: { type: Schema.Types.ObjectId, ref: 'EAuctionProperty', required: true },
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ['NOTICE', 'LEGAL', 'TITLE', 'REPORT', 'OTHER'],
      default: 'OTHER',
    },
    url: { type: String, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

EAuctionDocumentSchema.index({ auctionId: 1, uploadedAt: -1 });

export default mongoose.model<IEAuctionDocument>('EAuctionDocument', EAuctionDocumentSchema);
