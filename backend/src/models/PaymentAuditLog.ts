import mongoose, { Document, Schema } from 'mongoose';
import { PaymentStatus } from './Payment';

export interface IPaymentAuditLog extends Document {
  paymentId: string;
  eventType: string;
  statusFrom?: PaymentStatus;
  statusTo?: PaymentStatus;
  actor?: string;
  payload?: Record<string, any>;
  createdAt: Date;
}

const PaymentAuditLogSchema = new Schema<IPaymentAuditLog>(
  {
    paymentId: {
      type: String,
      required: true,
      index: true,
    },
    eventType: {
      type: String,
      required: true,
    },
    statusFrom: {
      type: String,
      enum: ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'],
    },
    statusTo: {
      type: String,
      enum: ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'],
    },
    actor: {
      type: String,
    },
    payload: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

PaymentAuditLogSchema.index({ createdAt: -1 });

export default mongoose.model<IPaymentAuditLog>('PaymentAuditLog', PaymentAuditLogSchema);
