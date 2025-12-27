import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HeartIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { Property } from '../types/property'
import { formatPrice } from '../utils/formatters'

interface Props {
  property: Property
}

export default function PropertyCard({ property }: Props) {
  const [isSaved, setIsSaved] = useState(false)

  const price = property.pricing.expectedPrice || property.pricing.rentAmount
  const priceLabel = property.transactionType === 'RENT' ? 'Rent' : 'Price'

  return (
    <Link
      to={`/properties/${property._id}`}
      className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden group block"
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {property.media.images && property.media.images.length > 0 ? (
          <img
            src={property.media.images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <PhotoIcon className="w-16 h-16" />
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            setIsSaved(!isSaved)
          }}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
        >
          {isSaved ? (
            <HeartSolidIcon className="w-5 h-5 text-red-500" />
          ) : (
            <HeartIcon className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {/* Asset DNA Badge */}
        {property.assetDNA && property.assetDNA.verificationScore > 70 && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-primary-600 text-white text-xs font-semibold rounded flex items-center space-x-1">
            <span>MG Verified</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-primary-600">
          {property.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-2">
          {property.location.locality}, {property.location.area}, {property.location.city}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-lg font-bold text-primary-600">
              {formatPrice(price, property.pricing.currency)}
            </p>
            <p className="text-xs text-gray-500">{priceLabel}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">{property.views} views</p>
            <p className="text-xs text-gray-500">{property.saves} saves</p>
          </div>
        </div>

        {/* Asset DNA Score */}
        {property.assetDNA && (
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-600">Verification:</span>
              <div className="flex items-center">
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-600"
                    style={{ width: `${property.assetDNA.verificationScore}%` }}
                  />
                </div>
                <span className="ml-2 text-xs font-medium text-gray-700">
                  {property.assetDNA.verificationScore}%
                </span>
              </div>
            </div>
            <span
              className={`text-xs font-medium ${
                property.assetDNA.legalRisk === 'LOW'
                  ? 'text-green-600'
                  : property.assetDNA.legalRisk === 'MEDIUM'
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }`}
            >
              {property.assetDNA.legalRisk} Risk
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}

