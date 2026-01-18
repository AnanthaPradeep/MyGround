import mongoose, { Document, Schema } from 'mongoose';
import { PaymentUseCase, PaymentGateway } from './PaymentRule';

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export interface IPayment extends Document {
  paymentId: string;
  userId: mongoose.Types.ObjectId;
  useCase: PaymentUseCase;
  methodId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  gateway: PaymentGateway;
  gatewayRef?: string;
  metadata?: Record<string, any>;
  idempotencyKey?: string;
  region?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    paymentId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    useCase: {
      type: String,
      enum: ['SUBSCRIPTION', 'FEATURED_LISTING', 'AD_PROMOTION', 'EMD', 'BOOKING', 'SERVICE', 'INSTITUTION'],
      required: true,
    },
    methodId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'],
      default: 'PENDING',
    },
    gateway: {
      type: String,
      enum: ['RAZORPAY', 'STRIPE', 'MANUAL', 'AUTO'],
      default: 'AUTO',
    },
    gatewayRef: {
      type: String,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    idempotencyKey: {
      type: String,
      index: true,
    },
    region: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

PaymentSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IPayment>('Payment', PaymentSchema);
