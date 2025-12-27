import AssetDNA from '../models/AssetDNA';
import Property, { IProperty } from '../models/Property';
import * as crypto from 'crypto';

/**
 * Generate unique Asset DNA ID
 */
export const generateAssetId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(4).toString('hex');
  return `MG-${timestamp}-${random}`.toUpperCase();
};

/**
 * Calculate Asset DNA scores and metrics
 */
export const calculateAssetDNA = async (
  property: IProperty
): Promise<{
  verificationScore: number;
  legalRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  assetTrustScore: number;
  priceVsLocalAverage: number;
}> => {
  let verificationScore = 0;
  let legalRiskScore = 0;
  let trustScore = 0;

  // Geo-verification (30 points)
  if (property.location?.coordinates?.coordinates?.length === 2) {
    verificationScore += 30;
  }

  // Media verification (20 points)
  if (property.media.images && property.media.images.length >= 3) {
    verificationScore += 20;
  }
  if (property.media.videos && property.media.videos.length > 0) {
    verificationScore += 10;
  }

  // Legal documents (20 points)
  if (property.legal.titleClear) verificationScore += 10;
  if (property.legal.encumbranceFree) verificationScore += 10;

  // KYC verification (20 points)
  // This would be checked from user profile
  verificationScore += 20; // Placeholder

  // Legal risk calculation
  if (property.legal.litigationStatus === 'NONE') {
    legalRiskScore = 0;
  } else if (property.legal.litigationStatus === 'PENDING') {
    legalRiskScore = 70;
  } else {
    legalRiskScore = 30;
  }

  if (!property.legal.titleClear) legalRiskScore += 20;
  if (!property.legal.encumbranceFree) legalRiskScore += 10;

  const legalRisk: 'LOW' | 'MEDIUM' | 'HIGH' =
    legalRiskScore < 30 ? 'LOW' : legalRiskScore < 60 ? 'MEDIUM' : 'HIGH';

  // Trust score calculation
  trustScore = verificationScore;
  if (property.legal.reraNumber) trustScore += 10;
  if (property.isVerified) trustScore += 10;

  // Price vs local average (placeholder - would use market data)
  const priceVsLocalAverage = 0; // Would calculate from market data

  return {
    verificationScore: Math.min(100, verificationScore),
    legalRisk,
    assetTrustScore: Math.min(100, trustScore),
    priceVsLocalAverage,
  };
};

/**
 * Create or update Asset DNA record
 */
export const createOrUpdateAssetDNA = async (
  property: IProperty,
  assetId: string
): Promise<void> => {
  // Ensure assetId is provided and not null/undefined
  if (!assetId || assetId.trim() === '') {
    throw new Error('AssetId is required for AssetDNA creation');
  }

  const dnaMetrics = await calculateAssetDNA(property);

  // Check if coordinates exist before accessing them
  const hasCoordinates = property.location?.coordinates?.coordinates?.length === 2;
  const coordinates = hasCoordinates ? property.location.coordinates.coordinates : null;

  // Build geoVerification object conditionally
  const geoVerification: any = {
    verified: hasCoordinates,
    source: 'MAP_API',
  };

  if (hasCoordinates && coordinates) {
    geoVerification.verifiedAt = new Date();
    geoVerification.coordinates = {
      latitude: coordinates[1],
      longitude: coordinates[0],
    };
    geoVerification.accuracy = 10; // meters
  }

  // Use findOneAndUpdate with upsert to atomically create or update
  // This prevents race conditions and duplicate key errors
  // Always query by propertyId to ensure one AssetDNA per property
  const updateData: any = {
    propertyId: property._id, // Always set propertyId
    geoVerification,
    legalStatus: {
      riskLevel: dnaMetrics.legalRisk,
      titleClear: property.legal.titleClear,
      encumbranceFree: property.legal.encumbranceFree,
      litigationCount: property.legal.litigationStatus === 'PENDING' ? 1 : 0,
      complianceScore: dnaMetrics.assetTrustScore,
      lastVerified: new Date(),
    },
    scores: {
      verificationScore: dnaMetrics.verificationScore,
      trustScore: dnaMetrics.assetTrustScore,
      investmentScore: 50, // Placeholder
      overallScore: (dnaMetrics.verificationScore + dnaMetrics.assetTrustScore) / 2,
    },
  };

  // Use findOneAndUpdate with upsert for atomic create/update operation
  // This prevents race conditions and duplicate key errors
  // Always query by propertyId (unique) to ensure one AssetDNA per property
  
  // Try to find existing AssetDNA by propertyId first to check if assetId exists
  const existingAssetDNA = await AssetDNA.findOne({ propertyId: property._id });
  
  // Prepare update operation
  // Use $setOnInsert to only set assetId when creating new document
  // Use $set to update all other fields
  const updateOperation: any = {
    $set: updateData
  };
  
  if (!existingAssetDNA) {
    // New record - set assetId only on insert
    updateOperation.$setOnInsert = { assetId: assetId };
  } else {
    // Existing record - preserve existing assetId (immutable)
    // Only update assetId if it's missing (shouldn't happen, but safety check)
    if (!existingAssetDNA.assetId || existingAssetDNA.assetId.trim() === '') {
      updateOperation.$set.assetId = assetId;
    }
  }
  
  // Atomic upsert operation - prevents duplicate key errors
  const assetDNA = await AssetDNA.findOneAndUpdate(
    { propertyId: property._id }, // Query by propertyId (unique index)
    updateOperation,
    { 
      upsert: true, // Create if doesn't exist
      new: true, // Return updated document
      runValidators: true, // Run schema validators
      setDefaultsOnInsert: true // Set default values on insert
    }
  );

  // Update property with Asset DNA data
  property.assetId = assetId;
  property.assetDNA = {
    verificationScore: dnaMetrics.verificationScore,
    geoVerified: assetDNA.geoVerification.verified,
    legalRisk: dnaMetrics.legalRisk,
    marketActivityScore: 0,
    assetTrustScore: dnaMetrics.assetTrustScore,
    priceVsLocalAverage: dnaMetrics.priceVsLocalAverage,
  };
};

