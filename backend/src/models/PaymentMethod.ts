import mongoose, { Document, Schema } from 'mongoose';

export type PaymentMethodType = 'UPI' | 'CARD' | 'BANK' | 'WALLET' | 'BNPL' | 'CRYPTO' | 'OFFLINE';
export type PaymentUserType = 'NON_PREMIUM' | 'PREMIUM' | 'INSTITUTION';

export interface IPaymentMethod extends Document {
  methodId: string;
  name: string;
  type: PaymentMethodType;
  enabled: boolean;
  supportedUserTypes: PaymentUserType[];
  minAmount: number;
  maxAmount: number;
  regions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PaymentMethodSchema = new Schema<IPaymentMethod>(
  {
    methodId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['UPI', 'CARD', 'BANK', 'WALLET', 'BNPL', 'CRYPTO', 'OFFLINE'],
      required: true,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    supportedUserTypes: {
      type: [String],
      enum: ['NON_PREMIUM', 'PREMIUM', 'INSTITUTION'],
      default: ['NON_PREMIUM', 'PREMIUM'],
    },
    minAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    maxAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    regions: {
      type: [String],
      default: ['GLOBAL'],
    },
  },
  {
    timestamps: true,
  }
);

PaymentMethodSchema.index({ enabled: 1, methodId: 1 });

export default mongoose.model<IPaymentMethod>('PaymentMethod', PaymentMethodSchema);
