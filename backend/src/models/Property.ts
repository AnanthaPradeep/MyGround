import mongoose, { Document, Schema } from 'mongoose';

export interface IProperty extends Document {
  assetId: string; // MG Asset DNA™ ID (immutable)
  listedBy: mongoose.Types.ObjectId;
  transactionType: 'SELL' | 'RENT' | 'LEASE' | 'SUB_LEASE' | 'FRACTIONAL';
  propertyCategory: 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL' | 'LAND' | 'SPECIAL';
  propertySubType: string;
  
  // Location & Geo
  location: {
    country: string;
    state: string;
    city: string;
    area: string;
    locality: string;
    landmark?: string;
    pincode: string;
    coordinates: {
      type: 'Point';
      coordinates: [number, number]; // [longitude, latitude]
    };
    address: string;
  };
  
  // Property Details (Dynamic based on category)
  title: string;
  description: string;
  ownershipType: 'FREEHOLD' | 'LEASEHOLD' | 'GOVERNMENT' | 'TRUST';
  propertyAge?: number;
  possessionStatus: 'READY' | 'UNDER_CONSTRUCTION' | 'PRE_LAUNCH';
  
  // Residential Specific
  residential?: {
    bhk?: number;
    bathrooms?: number;
    balconies?: number;
    furnishing?: 'FULLY_FURNISHED' | 'SEMI_FURNISHED' | 'UNFURNISHED';
    floor?: number;
    totalFloors?: number;
    parking?: 'OPEN' | 'COVERED' | 'NONE';
  };
  
  // Commercial/Industrial Specific
  commercial?: {
    builtUpArea: number;
    carpetArea?: number;
    powerLoad?: number; // kVA
    floorLoadCapacity?: number;
    ceilingHeight?: number;
    dockAvailable?: boolean;
    freightElevator?: boolean;
  };
  
  // Land Specific
  land?: {
    plotArea: number;
    areaUnit: 'SQFT' | 'SQMT' | 'ACRE' | 'HECTARE';
    frontage?: number;
    depth?: number;
    roadAccessWidth?: number;
    zoningType?: string;
    waterAvailable?: boolean;
    electricityAvailable?: boolean;
    fsi?: number;
    heightLimit?: number;
  };
  
  // Pricing
  pricing: {
    expectedPrice?: number;
    rentAmount?: number;
    leaseValue?: number;
    priceNegotiable: boolean;
    maintenanceCharges?: number;
    securityDeposit?: number;
    bookingAmount?: number;
    currency: string;
  };
  
  // Media
  media: {
    images: string[];
    videos?: string[];
    droneFootage?: string[];
    floorPlans?: string[];
    virtualTour?: string;
  };
  
  // Legal & Compliance
  legal: {
    reraNumber?: string;
    titleDeed?: string;
    landUseCertificate?: string;
    encumbranceCertificate?: string;
    occupancyCertificate?: string;
    completionCertificate?: string;
    titleClear: boolean;
    encumbranceFree: boolean;
    litigationStatus: 'NONE' | 'PENDING' | 'RESOLVED';
  };
  
  // MG Asset DNA™
  assetDNA: {
    verificationScore: number; // 0-100
    geoVerified: boolean;
    legalRisk: 'LOW' | 'MEDIUM' | 'HIGH';
    marketActivityScore: number;
    assetTrustScore: number;
    priceVsLocalAverage: number; // percentage difference
    ownershipHistory?: Array<{
      date: Date;
      owner: string;
      price?: number;
    }>;
  };
  
  // Status
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAUSED' | 'SOLD' | 'RENTED';
  isVerified: boolean;
  isFeatured: boolean;
  
  // Analytics
  views: number;
  saves: number;
  inquiries: number;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  expiresAt?: Date;
}

const PropertySchema = new Schema<IProperty>(
  {
    assetId: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
    },
    listedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    transactionType: {
      type: String,
      enum: ['SELL', 'RENT', 'LEASE', 'SUB_LEASE', 'FRACTIONAL'],
      required: true,
    },
    propertyCategory: {
      type: String,
      enum: ['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'LAND', 'SPECIAL'],
      required: true,
    },
    propertySubType: {
      type: String,
      required: true,
    },
    location: {
      country: { type: String, required: false }, // Temporarily optional
      state: { type: String, required: false }, // Temporarily optional
      city: { type: String, required: false }, // Temporarily optional
      area: { type: String, required: false }, // Temporarily optional
      locality: { type: String, required: false }, // Temporarily optional
      landmark: String,
      pincode: { type: String, required: false }, // Temporarily optional
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          required: false, // Temporarily optional
        },
        coordinates: {
          type: [Number],
          required: false, // Temporarily optional
        },
      },
      address: { type: String, required: false }, // Temporarily optional
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    ownershipType: {
      type: String,
      enum: ['FREEHOLD', 'LEASEHOLD', 'GOVERNMENT', 'TRUST'],
      required: true,
    },
    propertyAge: Number,
    possessionStatus: {
      type: String,
      enum: ['READY', 'UNDER_CONSTRUCTION', 'PRE_LAUNCH'],
      required: true,
    },
    residential: {
      bhk: Number,
      bathrooms: Number,
      balconies: Number,
      furnishing: {
        type: String,
        enum: ['FULLY_FURNISHED', 'SEMI_FURNISHED', 'UNFURNISHED'],
      },
      floor: Number,
      totalFloors: Number,
      parking: {
        type: String,
        enum: ['OPEN', 'COVERED', 'NONE'],
      },
    },
    commercial: {
      builtUpArea: Number,
      carpetArea: Number,
      powerLoad: Number,
      floorLoadCapacity: Number,
      ceilingHeight: Number,
      dockAvailable: Boolean,
      freightElevator: Boolean,
    },
    land: {
      plotArea: { type: Number, required: false }, // Conditionally required via pre-save hook
      areaUnit: {
        type: String,
        enum: ['SQFT', 'SQMT', 'ACRE', 'HECTARE'],
        default: 'SQFT',
      },
      frontage: Number,
      depth: Number,
      roadAccessWidth: Number,
      zoningType: String,
      waterAvailable: Boolean,
      electricityAvailable: Boolean,
      fsi: Number,
      heightLimit: Number,
    },
    pricing: {
      expectedPrice: Number,
      rentAmount: Number,
      leaseValue: Number,
      priceNegotiable: { type: Boolean, default: true },
      maintenanceCharges: Number,
      securityDeposit: Number,
      bookingAmount: Number,
      currency: { type: String, default: 'INR' },
    },
    media: {
      images: [String],
      videos: [String],
      droneFootage: [String],
      floorPlans: [String],
      virtualTour: String,
    },
    legal: {
      reraNumber: String,
      titleDeed: String,
      landUseCertificate: String,
      encumbranceCertificate: String,
      occupancyCertificate: String,
      completionCertificate: String,
      titleClear: { type: Boolean, default: false },
      encumbranceFree: { type: Boolean, default: false },
      litigationStatus: {
        type: String,
        enum: ['NONE', 'PENDING', 'RESOLVED'],
        default: 'NONE',
      },
    },
    assetDNA: {
      verificationScore: { type: Number, default: 0, min: 0, max: 100 },
      geoVerified: { type: Boolean, default: false },
      legalRisk: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH'],
        default: 'MEDIUM',
      },
      marketActivityScore: { type: Number, default: 0 },
      assetTrustScore: { type: Number, default: 0, min: 0, max: 100 },
      priceVsLocalAverage: { type: Number, default: 0 },
      ownershipHistory: [{
        date: Date,
        owner: String,
        price: Number,
      }],
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'PAUSED', 'SOLD', 'RENTED'],
      default: 'DRAFT',
    },
    isVerified: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    inquiries: { type: Number, default: 0 },
    publishedAt: Date,
    expiresAt: Date,
  },
  {
    timestamps: true,
  }
);

// Pre-save hook for conditional validation
PropertySchema.pre('save', function (next) {
  // Only validate land.plotArea if propertyCategory is LAND
  if (this.propertyCategory === 'LAND') {
    if (!this.land || !this.land.plotArea) {
      return next(new Error('land.plotArea is required for LAND properties'));
    }
  }
  next();
});

// Geo-spatial index for location-based queries (sparse - only indexes documents with coordinates)
// Sparse index allows documents without coordinates to be saved without validation errors
PropertySchema.index({ 'location.coordinates': '2dsphere' }, { sparse: true });

// Text search index
PropertySchema.index({ title: 'text', description: 'text' });

// Common query indexes
PropertySchema.index({ transactionType: 1, propertyCategory: 1 });
PropertySchema.index({ status: 1, isVerified: 1 });
PropertySchema.index({ listedBy: 1 });
PropertySchema.index({ 'pricing.expectedPrice': 1 });
PropertySchema.index({ 'pricing.rentAmount': 1 });
PropertySchema.index({ createdAt: -1 });

export default mongoose.model<IProperty>('Property', PropertySchema);

