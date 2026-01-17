import mongoose, { Document, Schema } from 'mongoose';

export type AuctionAuthorityType = 'BANK' | 'NBFC' | 'GOVT' | 'COURT' | 'INSTITUTION';
export type AuctionStatus = 'UPCOMING' | 'LIVE' | 'CLOSED' | 'CANCELLED' | 'PAUSED';

export interface IEAuctionProperty extends Document {
  title: string;
  description: string;
  transactionType: 'E_AUCTION';
  propertyCategory: 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL' | 'LAND' | 'SPECIAL' | 'ISLAND';
  propertySubType?: string;
  authorityType: AuctionAuthorityType;
  authorityName: string;
  authorityReference?: string;
  institution: {
    type: AuctionAuthorityType;
    name: string;
    logoUrl?: string;
    verified: boolean;
  };
  reservePrice: number;
  bidIncrement: number;
  emdRequired: boolean;
  emdAmount?: number;
  startAt: Date;
  endAt: Date;
  status: AuctionStatus;
  location: {
    country?: string;
    state?: string;
    city?: string;
    area?: string;
    locality?: string;
    pincode?: string;
    address?: string;
    coordinates?: {
      type: 'Point';
      coordinates: [number, number];
    };
  };
  media: {
    images: string[];
  };
  legalDisclaimer: string;
  documents: mongoose.Types.ObjectId[];
  islandComplianceRequired: boolean;
  islandCompliance?: {
    environmentalClearance?: boolean;
    coastalRegulationApproval?: boolean;
    localAuthorityApproval?: boolean;
  };
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const EAuctionPropertySchema = new Schema<IEAuctionProperty>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    transactionType: { type: String, enum: ['E_AUCTION'], default: 'E_AUCTION' },
    propertyCategory: {
      type: String,
      enum: ['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'LAND', 'SPECIAL', 'ISLAND'],
      required: true,
    },
    propertySubType: { type: String },
    authorityType: {
      type: String,
      enum: ['BANK', 'NBFC', 'GOVT', 'COURT', 'INSTITUTION'],
      required: true,
    },
    authorityName: { type: String, required: true },
    authorityReference: { type: String },
    institution: {
      type: {
        type: String,
        enum: ['BANK', 'NBFC', 'GOVT', 'COURT', 'INSTITUTION'],
        required: true,
      },
      name: { type: String, required: true },
      logoUrl: String,
      verified: { type: Boolean, default: true },
    },
    reservePrice: { type: Number, required: true, min: 0 },
    bidIncrement: { type: Number, required: true, min: 1 },
    emdRequired: { type: Boolean, default: true },
    emdAmount: { type: Number, min: 0 },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    status: {
      type: String,
      enum: ['UPCOMING', 'LIVE', 'CLOSED', 'CANCELLED', 'PAUSED'],
      default: 'UPCOMING',
    },
    location: {
      country: String,
      state: String,
      city: String,
      area: String,
      locality: String,
      pincode: String,
      address: String,
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
        },
        coordinates: {
          type: [Number],
        },
      },
    },
    media: {
      images: { type: [String], default: [] },
    },
    legalDisclaimer: {
      type: String,
      default: 'Auction properties are sold on an “as-is-where-is” basis. Buyers must complete due diligence before bidding.',
    },
    documents: [{ type: Schema.Types.ObjectId, ref: 'EAuctionDocument' }],
    islandComplianceRequired: { type: Boolean, default: false },
    islandCompliance: {
      environmentalClearance: Boolean,
      coastalRegulationApproval: Boolean,
      localAuthorityApproval: Boolean,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

EAuctionPropertySchema.index({ status: 1, startAt: 1, endAt: 1 });
EAuctionPropertySchema.index({ propertyCategory: 1 });
EAuctionPropertySchema.index({ authorityType: 1 });
EAuctionPropertySchema.index({ 'location.city': 1, 'location.state': 1 });
EAuctionPropertySchema.index({ title: 'text', description: 'text' });
EAuctionPropertySchema.index({ 'location.coordinates': '2dsphere' }, { sparse: true });

EAuctionPropertySchema.pre('save', function (next) {
  if (this.propertyCategory === 'ISLAND') {
    this.islandComplianceRequired = true;
    if (!this.islandCompliance) {
      return next(new Error('Island auctions require compliance flags'));
    }
  }
  next();
});

export default mongoose.model<IEAuctionProperty>('EAuctionProperty', EAuctionPropertySchema);
