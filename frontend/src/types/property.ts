export type TransactionType = 'SELL' | 'RENT' | 'LEASE' | 'BUY' | 'SUB_LEASE' | 'FRACTIONAL';
export type PropertyCategory = 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL' | 'LAND' | 'SPECIAL' | 'ISLAND';
export type OwnershipType = 'FREEHOLD' | 'LEASEHOLD' | 'GOVERNMENT' | 'TRUST';
export type PossessionStatus = 'READY' | 'UNDER_CONSTRUCTION' | 'PRE_LAUNCH';
export type FurnishingType = 'FULLY_FURNISHED' | 'SEMI_FURNISHED' | 'UNFURNISHED';
export type ParkingType = 'OPEN' | 'COVERED' | 'NONE';
export type AreaUnit = 'SQFT' | 'SQMT' | 'ACRE' | 'HECTARE';
export type LitigationStatus = 'NONE' | 'PENDING' | 'RESOLVED';

export interface Location {
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
}

export interface ResidentialDetails {
  bhk?: number;
  bathrooms?: number;
  balconies?: number;
  furnishing?: FurnishingType;
  floor?: number;
  totalFloors?: number;
  parking?: ParkingType;
}

export interface CommercialDetails {
  builtUpArea: number;
  carpetArea?: number;
  powerLoad?: number;
  floorLoadCapacity?: number;
  ceilingHeight?: number;
  dockAvailable?: boolean;
  freightElevator?: boolean;
}

export interface LandDetails {
  plotArea: number;
  areaUnit: AreaUnit;
  frontage?: number;
  depth?: number;
  roadAccessWidth?: number;
  zoningType?: string;
  waterAvailable?: boolean;
  electricityAvailable?: boolean;
  fsi?: number;
  heightLimit?: number;
}

export interface Pricing {
  expectedPrice?: number;
  rentAmount?: number;
  leaseValue?: number;
  priceNegotiable: boolean;
  maintenanceCharges?: number;
  securityDeposit?: number;
  bookingAmount?: number;
  currency: string;
}

export interface Media {
  images: string[];
  videos?: string[];
  droneFootage?: string[];
  floorPlans?: string[];
  virtualTour?: string;
}

export interface Legal {
  reraNumber?: string;
  titleDeed?: string;
  landUseCertificate?: string;
  encumbranceCertificate?: string;
  occupancyCertificate?: string;
  completionCertificate?: string;
  titleClear: boolean;
  encumbranceFree: boolean;
  litigationStatus: LitigationStatus;
}

export interface AssetDNA {
  verificationScore: number;
  geoVerified: boolean;
  legalRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  marketActivityScore: number;
  assetTrustScore: number;
  priceVsLocalAverage: number;
}

export interface PropertyFormData {
  transactionType: TransactionType;
  propertyCategory: PropertyCategory;
  propertySubType: string;
  location: Location;
  title: string;
  description: string;
  ownershipType: OwnershipType;
  propertyAge?: number;
  possessionStatus: PossessionStatus;
  residential?: ResidentialDetails;
  commercial?: CommercialDetails;
  land?: LandDetails;
  pricing: Pricing;
  media: Media;
  legal: Legal;
}

export interface ListedBy {
  firstName: string;
  lastName: string;
  role: string;
  trustScore: number;
  _id?: string;
}

export interface Property {
  _id: string;
  assetId?: string;
  title: string;
  description: string;
  transactionType: TransactionType;
  propertyCategory: PropertyCategory;
  propertySubType: string;
  location: Location;
  ownershipType: OwnershipType;
  possessionStatus: PossessionStatus;
  propertyAge?: number;
  residential?: ResidentialDetails;
  commercial?: CommercialDetails;
  land?: LandDetails;
  pricing: Pricing;
  media: Media;
  legal: Legal;
  assetDNA?: AssetDNA;
  listedBy: ListedBy | string;
  status?: string;
  isVerified?: boolean;
  views?: number;
  saves?: number;
  inquiries?: number;
  createdAt?: string;
  updatedAt?: string;
}

