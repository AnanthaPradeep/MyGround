import mongoose, { Document, Schema } from 'mongoose';

export interface IOTP extends Document {
  mobile?: string;
  email?: string;
  otp: string;
  type: 'REGISTRATION' | 'LOGIN' | 'PASSWORD_RESET';
  expiresAt: Date;
  verified: boolean;
  createdAt: Date;
}

const OTPSchema = new Schema<IOTP>(
  {
    mobile: String,
    email: String,
    otp: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['REGISTRATION', 'LOGIN', 'PASSWORD_RESET'],
      default: 'REGISTRATION',
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }, // Auto-delete expired OTPs
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster lookups
OTPSchema.index({ mobile: 1, email: 1, verified: 1 });
OTPSchema.index({ expiresAt: 1 });

export default mongoose.model<IOTP>('OTP', OTPSchema);

