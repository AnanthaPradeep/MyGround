import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HeartIcon, PhotoIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { Property } from '../types/property'
import { formatPrice } from '../utils/formatters'
import { useAuthStore } from '../store/authStore'
import { useWishlistStore } from '../store/wishlistStore'
import { useWishlist } from '../hooks/useWishlist'
import toast from 'react-hot-toast'

interface Props {
  property: Property
}

export default function PropertyCard({ property }: Props) {
  const { isAuthenticated, user } = useAuthStore()
  const { lastUpdate, triggerRefetch } = useWishlistStore()
  const { checkInWishlist, addToWishlist, removeFromWishlist } = useWishlist({
    useSampleData: false,
    userId: user?.id,
  })
  const [isSaved, setIsSaved] = useState(false)
  const [isChecking, setIsChecking] = useState(false)

  // Check if property is in wishlist
  useEffect(() => {
    if (isAuthenticated && property._id) {
      setIsChecking(true)
      checkInWishlist(property._id)
        .then(setIsSaved)
        .catch(() => setIsSaved(false))
        .finally(() => setIsChecking(false))
    }
  }, [isAuthenticated, property._id, checkInWishlist, lastUpdate])

  const price = property.pricing.expectedPrice || property.pricing.rentAmount
  const priceLabel = property.transactionType === 'RENT' ? 'Rent' : 'Price'

  return (
    <Link
      to={`/properties/${property._id}`}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 hover:shadow-lg dark:hover:shadow-gray-900 transition-shadow overflow-hidden group block"
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
        {property.media.images && property.media.images.length > 0 ? (
          <img
            src={property.media.images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
            <PhotoIcon className="w-16 h-16" />
          </div>
        )}

        {/* Save Button */}
        {isAuthenticated && (
          <button
            onClick={async (e) => {
              e.preventDefault()
              e.stopPropagation()
              
              if (isChecking) return

              try {
                if (isSaved) {
                  await removeFromWishlist(property._id)
                  setIsSaved(false)
                  toast.success('Removed from wishlist')
                } else {
                  await addToWishlist(property._id)
                  setIsSaved(true)
                  toast.success('Added to wishlist')
                }
                // Trigger refetch in HeaderIcons and other components
                triggerRefetch()
              } catch (error: any) {
                toast.error(error.message || 'Failed to update wishlist')
              }
            }}
            className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md dark:shadow-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
            title={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
            disabled={isChecking}
          >
            {isSaved ? (
              <HeartSolidIcon className="w-5 h-5 text-red-500 dark:text-red-400" />
            ) : (
              <HeartIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        )}

        {/* Asset DNA Badge */}
        {property.assetDNA && property.assetDNA.verificationScore > 70 && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-primary-600 text-white text-xs font-semibold rounded flex items-center space-x-1">
            <span>MG Verified</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-heading font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400">
          {property.title}
        </h3>
        
        <div className="flex items-start gap-1.5 mb-2">
          <MapPinIcon className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {property.location.locality}, {property.location.area}, {property.location.city}, {property.location.state}
          </p>
        </div>
        
        {property.location.pincode && (
          <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">Pincode: {property.location.pincode}</p>
        )}

        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
              {formatPrice(price, property.pricing.currency)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{priceLabel}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">{property.views} views</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{property.saves} saves</p>
          </div>
        </div>

        {/* Asset DNA Score */}
        {property.assetDNA && (
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-600 dark:text-gray-400">Verification:</span>
              <div className="flex items-center">
                <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-600 dark:bg-primary-500"
                    style={{ width: `${property.assetDNA.verificationScore}%` }}
                  />
                </div>
                <span className="ml-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                  {property.assetDNA.verificationScore}%
                </span>
              </div>
            </div>
            <span
              className={`text-xs font-medium ${
                property.assetDNA.legalRisk === 'LOW'
                  ? 'text-green-600 dark:text-green-400'
                  : property.assetDNA.legalRisk === 'MEDIUM'
                  ? 'text-yellow-600 dark:text-yellow-400'
                  : 'text-red-600 dark:text-red-400'
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

