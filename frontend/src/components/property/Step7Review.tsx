import { UseFormReturn } from 'react-hook-form'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid'
import { PropertyFormData } from '../../types/property'
import { calculateAssetDNAPreview } from '../../utils/calculateAssetDNAPreview'
import ImageWithFallback from '../ImageWithFallback'

interface Props {
  form: UseFormReturn<PropertyFormData>
}

export default function Step7Review({ form }: Props) {
  const { watch } = form
  const formData = watch()

  const formatPrice = (amount?: number, currency: string = 'INR') => {
    if (!amount) return 'Not specified'
    const symbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'
    return `${symbol} ${amount.toLocaleString('en-IN')}`
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-gray-100 mb-2">Review & Submit</h2>
        <p className="text-gray-600 dark:text-gray-400">Review all details before submitting your property listing</p>
      </div>

      {/* Category & Transaction */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Category & Transaction</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Transaction Type</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">{formData.transactionType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Property Category</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">{formData.propertyCategory}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Property Sub-Type</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">{formData.propertySubType}</p>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Location</h3>
        <div className="space-y-2">
          <p className="font-medium text-gray-900 dark:text-gray-100">{formData.location.address}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {formData.location.locality}, {formData.location.area}, {formData.location.city}, {formData.location.state}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Pincode: {formData.location.pincode}</p>
          {formData.location.coordinates.coordinates[0] !== 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Coordinates: {formData.location.coordinates.coordinates[1].toFixed(6)}, {formData.location.coordinates.coordinates[0].toFixed(6)}
            </p>
          )}
        </div>
      </div>

      {/* Property Details */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Property Details</h3>
        <div className="space-y-2">
          <p className="font-medium text-lg text-gray-900 dark:text-gray-100">{formData.title}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{formData.description}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ownership</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{formData.ownershipType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Possession</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{formData.possessionStatus}</p>
            </div>
            {formData.propertyAge && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Age</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{formData.propertyAge} years</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category-Specific Details */}
      {formData.propertyCategory === 'RESIDENTIAL' && formData.residential && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Residential Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {formData.residential.bhk && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">BHK</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{formData.residential.bhk} BHK</p>
              </div>
            )}
            {formData.residential.bathrooms && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Bathrooms</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{formData.residential.bathrooms}</p>
              </div>
            )}
            {formData.residential.furnishing && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Furnishing</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{formData.residential.furnishing.replace('_', ' ')}</p>
              </div>
            )}
            {formData.residential.parking && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Parking</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{formData.residential.parking}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {formData.propertyCategory === 'COMMERCIAL' && formData.commercial && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Commercial Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Built-up Area</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{formData.commercial.builtUpArea} sqft</p>
            </div>
            {formData.commercial.carpetArea && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Carpet Area</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{formData.commercial.carpetArea} sqft</p>
              </div>
            )}
            {formData.commercial.powerLoad && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Power Load</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{formData.commercial.powerLoad} kVA</p>
              </div>
            )}
          </div>
        </div>
      )}

      {formData.propertyCategory === 'LAND' && formData.land && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Land Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Plot Area</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{formData.land.plotArea} {formData.land.areaUnit}</p>
            </div>
            {formData.land.frontage && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Frontage</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{formData.land.frontage} ft</p>
              </div>
            )}
            {formData.land.depth && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Depth</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{formData.land.depth} ft</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pricing */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Pricing</h3>
        <div className="space-y-2">
          {formData.transactionType === 'SELL' && formData.pricing.expectedPrice && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Expected Price</p>
              <p className="font-medium text-xl text-gray-900 dark:text-gray-100">{formatPrice(formData.pricing.expectedPrice, formData.pricing.currency)}</p>
            </div>
          )}
          {formData.transactionType === 'RENT' && formData.pricing.rentAmount && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Rent</p>
              <p className="font-medium text-xl text-gray-900 dark:text-gray-100">{formatPrice(formData.pricing.rentAmount, formData.pricing.currency)}</p>
            </div>
          )}
          {formData.pricing.maintenanceCharges && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Maintenance Charges</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{formatPrice(formData.pricing.maintenanceCharges, formData.pricing.currency)}/month</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Price Negotiable</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">{formData.pricing.priceNegotiable ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>

      {/* Media */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Media</h3>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Images</p>
          <div className="grid grid-cols-4 gap-2">
            {formData.media.images?.slice(0, 4).map((img, index) => (
              <ImageWithFallback
                key={index}
                src={img}
                alt={`Preview ${index + 1}`}
                className="w-full h-20 object-cover rounded border border-gray-300 dark:border-gray-600"
              />
            ))}
          </div>
          {formData.media.images && formData.media.images.length > 4 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">+{formData.media.images.length - 4} more images</p>
          )}
        </div>
      </div>

      {/* Legal */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Legal Status</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <span className={`w-3 h-3 rounded-full mr-2 ${formData.legal.titleClear ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-900 dark:text-gray-100">Title Clear: {formData.legal.titleClear ? 'Yes' : 'No'}</span>
          </div>
          <div className="flex items-center">
            <span className={`w-3 h-3 rounded-full mr-2 ${formData.legal.encumbranceFree ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-900 dark:text-gray-100">Encumbrance Free: {formData.legal.encumbranceFree ? 'Yes' : 'No'}</span>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Litigation Status</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">{formData.legal.litigationStatus}</p>
          </div>
          {formData.legal.reraNumber && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">RERA Number</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{formData.legal.reraNumber}</p>
            </div>
          )}
        </div>
      </div>

      {/* MG Asset DNA Preview */}
      {(() => {
        const dnaPreview = calculateAssetDNAPreview(formData)
        return (
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">MG Asset DNA™ Preview</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Your property will receive a unique Asset DNA ID and verification score after submission.
            </p>
            <div className="mb-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-primary-200 dark:border-primary-700">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Asset DNA ID</p>
              <p className="text-sm font-mono font-semibold text-primary-600 dark:text-primary-400">{dnaPreview.assetId}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Verification Score</p>
                <p className="text-lg font-bold text-primary-600 dark:text-primary-400">{dnaPreview.verificationScore}/100</p>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-primary-600 dark:bg-primary-500 transition-all"
                    style={{ width: `${dnaPreview.verificationScore}%` }}
                  />
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Legal Risk</p>
                <p
                  className={`text-lg font-bold ${
                    dnaPreview.legalRisk === 'LOW'
                      ? 'text-green-700 dark:text-green-300'
                      : dnaPreview.legalRisk === 'MEDIUM'
                      ? 'text-yellow-700 dark:text-yellow-300'
                      : 'text-red-700 dark:text-red-300'
                  }`}
                >
                  {dnaPreview.legalRisk}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Trust Score</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{dnaPreview.assetTrustScore}/100</p>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-gray-600 dark:bg-gray-400 transition-all"
                    style={{ width: `${dnaPreview.assetTrustScore}%` }}
                  />
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Geo-Verified</p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400 flex items-center justify-center space-x-1">
                  {formData.location.coordinates.coordinates[0] !== 0 ? (
                    <>
                      <CheckCircleIcon className="w-5 h-5" />
                      <span>Yes</span>
                    </>
                  ) : (
                    <>
                      <XCircleIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                      <span className="text-red-600 dark:text-red-400">No</span>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}

