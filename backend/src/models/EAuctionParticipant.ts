import mongoose, { Document, Schema } from 'mongoose';

export interface IEAuctionParticipant extends Document {
  auctionId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  kycStatusSnapshot: 'PENDING' | 'VERIFIED' | 'REJECTED';
  emdPaid: boolean;
  emdPaidAt?: Date;
  termsAcceptedAt?: Date;
  status: 'ELIGIBLE' | 'INELIGIBLE' | 'BANNED';
  paymentReference?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EAuctionParticipantSchema = new Schema<IEAuctionParticipant>(
  {
    auctionId: { type: Schema.Types.ObjectId, ref: 'EAuctionProperty', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    kycStatusSnapshot: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED'],
      default: 'PENDING',
    },
    emdPaid: { type: Boolean, default: false },
    emdPaidAt: Date,
    termsAcceptedAt: Date,
    status: {
      type: String,
      enum: ['ELIGIBLE', 'INELIGIBLE', 'BANNED'],
      default: 'INELIGIBLE',
    },
    paymentReference: String,
  },
  { timestamps: true }
);

EAuctionParticipantSchema.index({ auctionId: 1, userId: 1 }, { unique: true });
EAuctionParticipantSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IEAuctionParticipant>('EAuctionParticipant', EAuctionParticipantSchema);
