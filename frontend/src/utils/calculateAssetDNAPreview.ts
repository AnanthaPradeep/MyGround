import { PropertyFormData } from '../types/property'

/**
 * Calculate Asset DNA Preview scores based on form data
 * This is a client-side preview calculation that matches backend logic
 */
export const calculateAssetDNAPreview = (formData: PropertyFormData): {
  verificationScore: number
  legalRisk: 'LOW' | 'MEDIUM' | 'HIGH'
  assetTrustScore: number
  assetId: string
} => {
  let verificationScore = 0
  let legalRiskScore = 0
  let trustScore = 0

  // Geo-verification (30 points)
  if (formData.location?.coordinates?.coordinates?.length === 2) {
    const [lng, lat] = formData.location.coordinates.coordinates
    if (lng !== 0 && lat !== 0) {
      verificationScore += 30
    }
  }

  // Media verification (20 points for 3+ images, +10 for videos)
  if (formData.media?.images && formData.media.images.length >= 3) {
    verificationScore += 20
  }
  if (formData.media?.videos && formData.media.videos.length > 0) {
    verificationScore += 10
  }

  // Legal documents (20 points)
  if (formData.legal?.titleClear) verificationScore += 10
  if (formData.legal?.encumbranceFree) verificationScore += 10

  // KYC verification (20 points) - placeholder, would check user profile
  verificationScore += 20

  // Legal risk calculation
  if (formData.legal?.litigationStatus === 'NONE') {
    legalRiskScore = 0
  } else if (formData.legal?.litigationStatus === 'PENDING') {
    legalRiskScore = 70
  } else {
    legalRiskScore = 30
  }

  if (!formData.legal?.titleClear) legalRiskScore += 20
  if (!formData.legal?.encumbranceFree) legalRiskScore += 10

  const legalRisk: 'LOW' | 'MEDIUM' | 'HIGH' =
    legalRiskScore < 30 ? 'LOW' : legalRiskScore < 60 ? 'MEDIUM' : 'HIGH'

  // Trust score calculation
  trustScore = verificationScore
  if (formData.legal?.reraNumber) trustScore += 10
  // isVerified would be true after submission, so add 10 for preview
  trustScore += 10

  // Generate preview Asset ID (format: MG-TIMESTAMP-RANDOM)
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 10).toUpperCase()
  const assetId = `MG-${timestamp}-${random}`

  return {
    verificationScore: Math.min(100, verificationScore),
    legalRisk,
    assetTrustScore: Math.min(100, trustScore),
    assetId,
  }
}


