import mongoose, { Document, Schema } from 'mongoose';

export interface IAssetDNA extends Document {
  assetId: string; // Immutable, unique identifier
  propertyId: mongoose.Types.ObjectId;
  
  // Geo Intelligence
  geoVerification: {
    verified: boolean;
    verifiedAt?: Date;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    accuracy: number; // meters
    source: 'MANUAL' | 'GPS' | 'MAP_API';
  };
  
  // Legal Intelligence
  legalStatus: {
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    titleClear: boolean;
    encumbranceFree: boolean;
    litigationCount: number;
    complianceScore: number; // 0-100
    lastVerified: Date;
  };
  
  // Market Intelligence
  marketMetrics: {
    averagePricePerSqft: number;
    priceVolatility: number;
    demandIndex: number; // 0-100
    supplyIndex: number; // 0-100
    appreciationRate: number; // percentage per year
    rentalYield: number; // percentage
  };
  
  // Ownership History
  ownershipHistory: Array<{
    date: Date;
    ownerName: string;
    transactionType: 'SALE' | 'INHERITANCE' | 'GIFT' | 'AUCTION';
    price?: number;
    verified: boolean;
  }>;
  
  // Infrastructure Intelligence
  infrastructure: {
    metroDistance?: number; // km
    highwayDistance?: number;
    airportDistance?: number;
    railwayDistance?: number;
    upcomingProjects: Array<{
      name: string;
      type: 'METRO' | 'HIGHWAY' | 'IT_PARK' | 'MALL' | 'OTHER';
      distance: number;
      expectedCompletion?: Date;
    }>;
    growthIndex: number; // 0-100
  };
  
  // Activity Tracking
  activity: {
    totalListings: number;
    totalViews: number;
    totalInquiries: number;
    averageDaysOnMarket: number;
    lastListedAt?: Date;
  };
  
  // Composite Scores
  scores: {
    verificationScore: number; // 0-100
    trustScore: number; // 0-100
    investmentScore: number; // 0-100
    overallScore: number; // 0-100
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const AssetDNASchema = new Schema<IAssetDNA>(
  {
    assetId: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
    },
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
      unique: true,
    },
    geoVerification: {
      verified: { type: Boolean, default: false },
      verifiedAt: Date,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
      accuracy: Number,
      source: {
        type: String,
        enum: ['MANUAL', 'GPS', 'MAP_API'],
        default: 'MANUAL',
      },
    },
    legalStatus: {
      riskLevel: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH'],
        default: 'MEDIUM',
      },
      titleClear: { type: Boolean, default: false },
      encumbranceFree: { type: Boolean, default: false },
      litigationCount: { type: Number, default: 0 },
      complianceScore: { type: Number, default: 0, min: 0, max: 100 },
      lastVerified: { type: Date, default: Date.now },
    },
    marketMetrics: {
      averagePricePerSqft: Number,
      priceVolatility: Number,
      demandIndex: { type: Number, default: 0, min: 0, max: 100 },
      supplyIndex: { type: Number, default: 0, min: 0, max: 100 },
      appreciationRate: Number,
      rentalYield: Number,
    },
    ownershipHistory: [{
      date: Date,
      ownerName: String,
      transactionType: {
        type: String,
        enum: ['SALE', 'INHERITANCE', 'GIFT', 'AUCTION'],
      },
      price: Number,
      verified: { type: Boolean, default: false },
    }],
    infrastructure: {
      metroDistance: Number,
      highwayDistance: Number,
      airportDistance: Number,
      railwayDistance: Number,
      upcomingProjects: [{
        name: String,
        type: {
          type: String,
          enum: ['METRO', 'HIGHWAY', 'IT_PARK', 'MALL', 'OTHER'],
        },
        distance: Number,
        expectedCompletion: Date,
      }],
      growthIndex: { type: Number, default: 0, min: 0, max: 100 },
    },
    activity: {
      totalListings: { type: Number, default: 0 },
      totalViews: { type: Number, default: 0 },
      totalInquiries: { type: Number, default: 0 },
      averageDaysOnMarket: Number,
      lastListedAt: Date,
    },
    scores: {
      verificationScore: { type: Number, default: 0, min: 0, max: 100 },
      trustScore: { type: Number, default: 0, min: 0, max: 100 },
      investmentScore: { type: Number, default: 0, min: 0, max: 100 },
      overallScore: { type: Number, default: 0, min: 0, max: 100 },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
AssetDNASchema.index({ assetId: 1 });
AssetDNASchema.index({ propertyId: 1 });
AssetDNASchema.index({ 'scores.overallScore': -1 });
AssetDNASchema.index({ 'legalStatus.riskLevel': 1 });

export default mongoose.model<IAssetDNA>('AssetDNA', AssetDNASchema);

