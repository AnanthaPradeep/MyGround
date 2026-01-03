import { useState, useMemo, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useProperty } from '../hooks/useProperties'
import { formatPrice } from '../utils/formatters'
import { HeartIcon, CheckCircleIcon, XCircleIcon, PhotoIcon, MapPinIcon, TrashIcon, PauseIcon, PlayIcon, Bars3Icon, PencilIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import MapPicker from '../components/MapPicker'
import Logo from '../components/Logo'
import HeaderSearchDropdown from '../components/HeaderSearchDropdown'
import HeaderIcons from '../components/HeaderIcons'
import HeaderLocation from '../components/HeaderLocation'
import UserDropdown from '../components/UserDropdown'
import MobileMenu from '../components/MobileMenu'
import Footer from '../components/Footer'
import { PageLoader } from '../components/Loader'
import ImageWithFallback from '../components/ImageWithFallback'
import { useAuthStore } from '../store/authStore'
import { useWishlistStore } from '../store/wishlistStore'
import { useWishlist } from '../hooks/useWishlist'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const { property, loading, refetch } = useProperty(id || '', false) // Fetch from API
  const { triggerRefetch } = useWishlistStore()
  const { checkInWishlist, addToWishlist, removeFromWishlist } = useWishlist({
    useSampleData: false,
    userId: user?.id,
  })
  const [isSaved, setIsSaved] = useState(false)
  const [isCheckingWishlist, setIsCheckingWishlist] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [pausing, setPausing] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Check if property is in wishlist
  useEffect(() => {
    if (isAuthenticated && property?._id) {
      setIsCheckingWishlist(true)
      checkInWishlist(property._id)
        .then(setIsSaved)
        .catch(() => setIsSaved(false))
        .finally(() => setIsCheckingWishlist(false))
    }
  }, [isAuthenticated, property?._id, checkInWishlist])

  // Check if current user is the property owner
  // Handle both string (ObjectId) and object (populated) formats
  // This must recalculate whenever property or user changes
  const isOwner = useMemo(() => {
    // If property or user is not loaded yet, return false
    if (!property || !isAuthenticated || !user || !user.id) {
      return false
    }

    // Get the listedBy ID in string format
    let listedById: string | null = null
    
    if (typeof property.listedBy === 'string') {
      // If it's a string (ObjectId), use it directly
      listedById = String(property.listedBy).trim()
    } else if (property.listedBy && typeof property.listedBy === 'object') {
      // If it's an object (populated), get _id (MongoDB) or id
      const listedByObj = property.listedBy as any
      // Try _id first (MongoDB default), then id
      if (listedByObj._id) {
        listedById = String(listedByObj._id).trim()
      } else if (listedByObj.id) {
        listedById = String(listedByObj.id).trim()
      }
    }

    // If we couldn't extract listedBy ID, return false
    if (!listedById) {
      return false
    }

    // Compare with user.id (ensure both are strings and trimmed)
    const userId = String(user.id).trim()
    const isOwnerResult = listedById === userId

    return isOwnerResult
  }, [property, user, isAuthenticated, property?._id, property?.listedBy, user?.id])

  const handleDelete = async () => {
    if (!property) return
    if (!window.confirm(`Are you sure you want to delete "${property.title}"? This action cannot be undone.`)) {
      return
    }

    setDeleting(true)
    try {
      await api.delete(`/properties/${property._id}`)
      toast.success('Property deleted successfully')
      navigate('/dashboard')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete property')
    } finally {
      setDeleting(false)
    }
  }

  const handlePause = async () => {
    if (!property) return
    setPausing(true)
    try {
      await api.put(`/properties/${property._id}/pause`)
      toast.success('Property paused. It is now hidden from public view.')
      refetch()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to pause property')
    } finally {
      setPausing(false)
    }
  }

  const handleResume = async () => {
    if (!property) return
    setPausing(true)
    try {
      await api.put(`/properties/${property._id}/resume`)
      toast.success('Property resumed. It is now visible to the public.')
      refetch()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to resume property')
    } finally {
      setPausing(false)
    }
  }

  // Handle property not found
  if (!loading && !property && id) {
    navigate('/')
  }

  // Type guard for listedBy
  const getListedBy = (): { firstName: string; lastName: string; role: string; trustScore: number } => {
    if (!property) {
      return { firstName: '', lastName: '', role: '', trustScore: 0 }
    }
    if (typeof property.listedBy === 'string') {
      return { firstName: 'Unknown', lastName: 'User', role: 'USER', trustScore: 0 }
    }
    return property.listedBy
  }

  const listedBy = getListedBy()

  if (loading) {
    return <PageLoader text="Loading property details..." />
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Property not found</p>
        </div>
      </div>
    )
  }

  return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
              aria-label="Open menu"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>

            {/* Logo - Hidden on mobile (shown in menu), visible on desktop */}
            <Logo showText={true} size="md" className="hidden lg:flex lg:flex-1" />
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
              <HeaderSearchDropdown />
              <HeaderLocation />
              <HeaderIcons />
              <UserDropdown />
            </div>
            
            {/* Mobile: Show only User Dropdown */}
            <div className="lg:hidden flex items-center">
              <HeaderIcons />
              <UserDropdown />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="relative h-96 bg-gray-200 dark:bg-gray-700">
                {property.media.images && property.media.images.length > 0 ? (
                  <ImageWithFallback
                    src={property.media.images[activeImageIndex]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                    placeholder={
                      <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                        <PhotoIcon className="w-24 h-24" />
                      </div>
                    }
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                    <PhotoIcon className="w-24 h-24" />
                  </div>
                )}
              </div>
              {property.media.images && property.media.images.length > 1 && (
                <div className="p-4 grid grid-cols-4 gap-2">
                  {property.media.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`h-20 rounded overflow-hidden border-2 ${
                        activeImageIndex === index ? 'border-primary-600' : 'border-transparent'
                      }`}
                    >
                      <ImageWithFallback
                        src={img}
                        alt={`${property.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Basic Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-body font-bold text-gray-900 dark:text-gray-100 mb-2">{property.title}</h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {property.location.locality}, {property.location.area}, {property.location.city}
                  </p>
                </div>
                {isAuthenticated && (
                  <button
                    onClick={async () => {
                      if (isCheckingWishlist) return
                      
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
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    title={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
                    disabled={isCheckingWishlist}
                  >
                    {isSaved ? (
                      <HeartSolidIcon className="w-6 h-6 text-red-500 dark:text-red-400" />
                    ) : (
                      <HeartIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    )}
                  </button>
                )}
              </div>

              {/* Price */}
              <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 my-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-primary-600">
                      {property.transactionType === 'SELL'
                        ? formatPrice(property.pricing.expectedPrice, property.pricing.currency)
                        : property.transactionType === 'RENT'
                        ? formatPrice(property.pricing.rentAmount, property.pricing.currency)
                        : formatPrice(property.pricing.leaseValue, property.pricing.currency)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {property.transactionType === 'RENT' ? 'Monthly Rent' : property.transactionType === 'LEASE' ? 'Lease Value' : 'Expected Price'}
                      {property.pricing.priceNegotiable && ' • Negotiable'}
                    </p>
                  </div>
                  {property.assetDNA && (
                    <div className="text-right">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Verification Score</div>
                      <div className="text-2xl font-bold text-primary-600">
                        {property.assetDNA.verificationScore}%
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* MG Asset DNA */}
              {property.assetDNA && (
                <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-lg p-4 mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">MG Asset DNA™</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Verification</div>
                      <div className="text-lg font-bold text-primary-600">{property.assetDNA.verificationScore}/100</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Legal Risk</div>
                      <div className={`text-lg font-bold ${
                        property.assetDNA.legalRisk === 'LOW' ? 'text-green-600' :
                        property.assetDNA.legalRisk === 'MEDIUM' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {property.assetDNA.legalRisk}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Trust Score</div>
                      <div className="text-lg font-bold text-gray-900">{property.assetDNA.assetTrustScore}/100</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Geo-Verified</div>
                      <div className="text-lg font-bold text-green-600 flex items-center space-x-1">
                        {property.assetDNA.geoVerified ? (
                          <>
                            <CheckCircleIcon className="w-5 h-5" />
                            <span>Yes</span>
                          </>
                        ) : (
                          <>
                            <XCircleIcon className="w-5 h-5 text-red-600" />
                            <span className="text-red-600">No</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Property Type</div>
                  <div className="font-medium text-gray-900">{property.propertyCategory}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Transaction Type</div>
                  <div className="font-medium text-gray-900">{property.transactionType}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Ownership</div>
                  <div className="font-medium text-gray-900">{property.ownershipType}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Possession</div>
                  <div className="font-medium text-gray-900">{property.possessionStatus}</div>
                </div>
                {property.residential && (
                  <>
                    {property.residential.bhk && (
                      <div>
                        <div className="text-sm text-gray-600">BHK</div>
                        <div className="font-medium text-gray-900">{property.residential.bhk} BHK</div>
                      </div>
                    )}
                    {property.residential.bathrooms && (
                      <div>
                        <div className="text-sm text-gray-600">Bathrooms</div>
                        <div className="font-medium text-gray-900">{property.residential.bathrooms}</div>
                      </div>
                    )}
                  </>
                )}
                {property.commercial && (
                  <>
                    <div>
                      <div className="text-sm text-gray-600">Built-up Area</div>
                      <div className="font-medium text-gray-900">{property.commercial.builtUpArea} sqft</div>
                    </div>
                  </>
                )}
                {property.land && (
                  <>
                    <div>
                      <div className="text-sm text-gray-600">Plot Area</div>
                      <div className="font-medium text-gray-900">
                        {property.land.plotArea} {property.land.areaUnit}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Legal & Compliance */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Legal & Compliance</h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className={`w-3 h-3 rounded-full mr-3 ${property.legal.titleClear ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-gray-700">Title Clear: {property.legal.titleClear ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center">
                  <span className={`w-3 h-3 rounded-full mr-3 ${property.legal.encumbranceFree ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-gray-700">Encumbrance Free: {property.legal.encumbranceFree ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-700">Litigation Status: {property.legal.litigationStatus}</span>
                </div>
                {property.legal.reraNumber && (
                  <div className="flex items-center">
                    <span className="text-gray-700">RERA Number: {property.legal.reraNumber}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Location Map */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Location on Map</h2>
              <div className="mb-4 space-y-2">
                <p className="text-gray-700 font-medium">{property.location.address}</p>
                {/* Coordinates Display - Below Address */}
                {property.location.coordinates && property.location.coordinates.coordinates[0] !== 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                    {property.location.coordinates.coordinates[1].toFixed(6)}, {property.location.coordinates.coordinates[0].toFixed(6)}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <MapPinIcon className="w-4 h-4" />
                    {property.location.locality}
                  </span>
                  <span>•</span>
                  <span>{property.location.area}</span>
                  <span>•</span>
                  <span>{property.location.city}</span>
                  <span>•</span>
                  <span>{property.location.state}</span>
                  {property.location.pincode && (
                    <>
                      <span>•</span>
                      <span>Pincode: {property.location.pincode}</span>
                    </>
                  )}
                </div>
                {property.location.landmark && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Landmark:</span> {property.location.landmark}
                  </p>
                )}
              </div>
              {property.location.coordinates && property.location.coordinates.coordinates[0] !== 0 && (
                <MapPicker
                  latitude={property.location.coordinates.coordinates[1]}
                  longitude={property.location.coordinates.coordinates[0]}
                  onLocationChange={() => {}} // Read-only on detail page
                  height="400px"
                  readOnly={true}
                />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Owner Actions - Only show if user is the owner */}
            {isOwner && (
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Manage Property</h3>
                <div className="space-y-3">
                  <Link
                    to={`/properties/${property._id}/edit`}
                    className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium flex items-center justify-center gap-2"
                  >
                    <PencilIcon className="w-5 h-5" />
                    Edit Property
                  </Link>
                  {property.status === 'PAUSED' ? (
                    <button
                      onClick={handleResume}
                      disabled={pausing}
                      className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <PlayIcon className="w-5 h-5" />
                      {pausing ? 'Resuming...' : 'Resume Property (Make Public)'}
                    </button>
                  ) : (
                    <button
                      onClick={handlePause}
                      disabled={pausing}
                      className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <PauseIcon className="w-5 h-5" />
                      {pausing ? 'Pausing...' : 'Pause Property (Make Private)'}
                    </button>
                  )}
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <TrashIcon className="w-5 h-5" />
                    {deleting ? 'Deleting...' : 'Delete Property'}
                  </button>
                  <Link
                    to="/dashboard"
                    className="block w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-center"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              </div>
            )}

            {/* Contact Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Owner</h3>
              <div className="mb-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold">
                      {listedBy.firstName[0]}{listedBy.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {listedBy.firstName} {listedBy.lastName}
                    </div>
                    <div className="text-sm text-gray-600">{listedBy.role}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Trust Score: <span className="font-medium">{listedBy.trustScore}/100</span>
                </div>
              </div>
              <button className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium mb-3">
                Send Inquiry
              </button>
              <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
                Schedule Visit
              </button>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Views</span>
                  <span className="font-medium">{property.views}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saves</span>
                  <span className="font-medium">{property.saves}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Inquiries</span>
                  <span className="font-medium">{property.inquiries}</span>
                </div>
              </div>
            </div>

            {/* Similar Properties */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Properties</h3>
              <p className="text-sm text-gray-600">Coming soon</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}


