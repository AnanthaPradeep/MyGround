import mongoose, { Document, Schema } from 'mongoose';
import { PaymentUserType } from './PaymentMethod';

export type PaymentUseCase =
  | 'SUBSCRIPTION'
  | 'FEATURED_LISTING'
  | 'AD_PROMOTION'
  | 'EMD'
  | 'BOOKING'
  | 'SERVICE'
  | 'INSTITUTION';

export type PaymentGateway = 'RAZORPAY' | 'STRIPE' | 'MANUAL' | 'AUTO';

export interface IPaymentRule extends Document {
  useCase: PaymentUseCase;
  allowedMethods: string[];
  requiresKYC: boolean;
  requiresPremium: boolean;
  refundable: boolean;
  gateway: PaymentGateway;
  allowedUserTypes: PaymentUserType[];
  createdAt: Date;
  updatedAt: Date;
}

const PaymentRuleSchema = new Schema<IPaymentRule>(
  {
    useCase: {
      type: String,
      enum: ['SUBSCRIPTION', 'FEATURED_LISTING', 'AD_PROMOTION', 'EMD', 'BOOKING', 'SERVICE', 'INSTITUTION'],
      required: true,
      unique: true,
    },
    allowedMethods: {
      type: [String],
      default: [],
    },
    requiresKYC: {
      type: Boolean,
      default: false,
    },
    requiresPremium: {
      type: Boolean,
      default: false,
    },
    refundable: {
      type: Boolean,
      default: false,
    },
    gateway: {
      type: String,
      enum: ['RAZORPAY', 'STRIPE', 'MANUAL', 'AUTO'],
      default: 'AUTO',
    },
    allowedUserTypes: {
      type: [String],
      enum: ['NON_PREMIUM', 'PREMIUM', 'INSTITUTION'],
      default: ['NON_PREMIUM', 'PREMIUM', 'INSTITUTION'],
    },
  },
  {
    timestamps: true,
  }
);

PaymentRuleSchema.index({ useCase: 1 });

export default mongoose.model<IPaymentRule>('PaymentRule', PaymentRuleSchema);
