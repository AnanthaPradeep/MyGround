import ProtectedLink from './ProtectedLink'
import { Property } from '../types/property'
import { ShieldCheckIcon, MapPinIcon } from '@heroicons/react/24/solid'

interface Props {
  properties: Property[]
  showLoginModal?: () => void
}

export default function AssetDNAPreview({ properties, showLoginModal }: Props) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No properties with Asset DNA available yet</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {properties.filter(p => p.assetDNA).map((property) => (
        <ProtectedLink
          key={property._id}
          to={`/properties/${property._id}`}
          showLoginModal={showLoginModal}
          className="bg-gradient-to-br from-primary-50 dark:from-primary-900/20 to-blue-50 dark:to-blue-900/20 border-2 border-primary-200 dark:border-primary-800 rounded-xl p-6 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-body font-semibold text-gray-900 dark:text-gray-100 text-sm line-clamp-1">{property.title}</h4>
            <ShieldCheckIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>

          <div className="space-y-3">
            {/* Verification Score */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-600 dark:text-gray-400">Verification Score</span>
                <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                  {property.assetDNA?.verificationScore || 0}/100
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-600 dark:bg-primary-500"
                  style={{ width: `${property.assetDNA?.verificationScore || 0}%` }}
                />
              </div>
            </div>

            {/* Legal Risk */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400">Legal Risk</span>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded ${
                  property.assetDNA?.legalRisk === 'LOW'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : property.assetDNA?.legalRisk === 'MEDIUM'
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                }`}
              >
                {property.assetDNA?.legalRisk || 'N/A'}
              </span>
            </div>

            {/* Trust Score */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400">Trust Score</span>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {property.assetDNA?.assetTrustScore || 0}/100
              </span>
            </div>

            {/* Location */}
            <div className="pt-2 border-t border-primary-200 dark:border-primary-800 flex items-center space-x-1">
              <MapPinIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {property.location.area}, {property.location.city}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-primary-200 dark:border-primary-800">
            <p className="text-xs text-primary-600 dark:text-primary-400 font-medium">View Full Details →</p>
          </div>
        </ProtectedLink>
      ))}
    </div>
  )
}

