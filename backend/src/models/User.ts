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
  location?: {
    // Coordinates (GeoJSON Point format)
    coordinates: {
      type: 'Point';
      coordinates: [number, number]; // [longitude, latitude]
    };
    // Location details in English
    city: string;
    state: string;
    country: string;
    area?: string;
    locality?: string;
    pincode?: string;
    address?: string;
    displayName: string;
    // Location details in regional language (optional)
    regionalNames?: {
      city?: string;
      state?: string;
      area?: string;
      locality?: string;
      language?: string; // e.g., 'hi', 'mr', 'ta', 'te', etc.
    };
    // Source of location
    source: 'GPS' | 'MANUAL' | 'SEARCH';
    // Accuracy in meters (for GPS)
    accuracy?: number;
    // Last updated timestamp
    lastUpdated: Date;
  };
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
    location: {
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          // Remove default to prevent invalid GeoJSON
        },
        coordinates: {
          type: [Number],
        },
      },
      city: String,
      state: String,
      country: {
        type: String,
        default: 'India',
      },
      area: String,
      locality: String,
      pincode: String,
      address: String,
      displayName: String,
      regionalNames: {
        city: String,
        state: String,
        area: String,
        locality: String,
        language: String, // Language code (ISO 639-1)
      },
      source: {
        type: String,
        enum: ['GPS', 'MANUAL', 'SEARCH'],
        default: 'MANUAL',
      },
      accuracy: Number,
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for location coordinates (for geospatial queries)
UserSchema.index({ 'location.coordinates': '2dsphere' });

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Validate location coordinates before saving
UserSchema.pre('save', function (next) {
  // If location exists but coordinates are incomplete, remove location entirely
  if (this.location && this.location.coordinates) {
    const coords = this.location.coordinates;
    // If type is set but coordinates array is missing or invalid, remove the location
    if (coords.type === 'Point' && (!coords.coordinates || !Array.isArray(coords.coordinates) || coords.coordinates.length !== 2)) {
      this.location = undefined;
    }
  }
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

