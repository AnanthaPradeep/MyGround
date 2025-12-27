import { Link } from 'react-router-dom'
import { Property } from '../types/property'
import { ShieldCheckIcon, MapPinIcon } from '@heroicons/react/24/solid'

interface Props {
  properties: Property[]
}

export default function AssetDNAPreview({ properties }: Props) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No properties with Asset DNA available yet</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {properties.map((property) => (
        <Link
          key={property._id}
          to={`/properties/${property._id}`}
          className="bg-gradient-to-br from-primary-50 to-blue-50 border-2 border-primary-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">{property.title}</h4>
            <ShieldCheckIcon className="w-6 h-6 text-primary-600" />
          </div>

          <div className="space-y-3">
            {/* Verification Score */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-600">Verification Score</span>
                <span className="text-sm font-bold text-primary-600">
                  {property.assetDNA.verificationScore}/100
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-600"
                  style={{ width: `${property.assetDNA.verificationScore}%` }}
                />
              </div>
            </div>

            {/* Legal Risk */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Legal Risk</span>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded ${
                  property.assetDNA.legalRisk === 'LOW'
                    ? 'bg-green-100 text-green-700'
                    : property.assetDNA.legalRisk === 'MEDIUM'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {property.assetDNA.legalRisk}
              </span>
            </div>

            {/* Trust Score */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Trust Score</span>
              <span className="text-sm font-bold text-gray-900">
                {property.assetDNA.assetTrustScore}/100
              </span>
            </div>

            {/* Location */}
            <div className="pt-2 border-t border-primary-200 flex items-center space-x-1">
              <MapPinIcon className="w-4 h-4 text-gray-500" />
              <p className="text-xs text-gray-600">
                {property.location.area}, {property.location.city}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-primary-200">
            <p className="text-xs text-primary-600 font-medium">View Full Details →</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

