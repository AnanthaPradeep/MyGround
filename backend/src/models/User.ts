import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  mobile: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'OWNER' | 'BROKER' | 'DEVELOPER' | 'ADMIN';
  isVerified: boolean;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  kycDocuments?: {
    pan?: string;
    aadhaar?: string;
    passport?: string;
    reraId?: string;
    businessRegistration?: string;
  };
  trustScore: number;
  profilePicture?: string;
  savedSearches: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      select: false,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['USER', 'OWNER', 'BROKER', 'DEVELOPER', 'ADMIN'],
      default: 'USER',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isMobileVerified: {
      type: Boolean,
      default: false,
    },
    kycStatus: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED'],
      default: 'PENDING',
    },
    kycDocuments: {
      pan: String,
      aadhaar: String,
      passport: String,
      reraId: String,
      businessRegistration: String,
    },
    trustScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    profilePicture: String,
    savedSearches: [{
      type: Schema.Types.ObjectId,
      ref: 'SavedSearch',
    }],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ mobile: 1 }, { unique: true, sparse: true }); // Sparse index allows multiple null values
UserSchema.index({ role: 1 });

export default mongoose.model<IUser>('User', UserSchema);

