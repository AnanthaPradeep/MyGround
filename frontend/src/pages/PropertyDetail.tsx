import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

interface Property {
  _id: string
  title: string
  description: string
  location: {
    city: string
    area: string
    locality: string
    address: string
    coordinates: {
      coordinates: [number, number]
    }
  }
  pricing: {
    expectedPrice?: number
    rentAmount?: number
    leaseValue?: number
    maintenanceCharges?: number
    securityDeposit?: number
    currency: string
    priceNegotiable: boolean
  }
  media: {
    images: string[]
    videos?: string[]
    virtualTour?: string
  }
  assetDNA: {
    verificationScore: number
    geoVerified: boolean
    legalRisk: string
    assetTrustScore: number
    priceVsLocalAverage: number
  }
  propertyCategory: string
  transactionType: string
  ownershipType: string
  possessionStatus: string
  residential?: any
  commercial?: any
  land?: any
  legal: {
    reraNumber?: string
    titleClear: boolean
    encumbranceFree: boolean
    litigationStatus: string
  }
  listedBy: {
    firstName: string
    lastName: string
    role: string
    trustScore: number
  }
  views: number
  saves: number
  inquiries: number
}

export default function PropertyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    fetchProperty()
  }, [id])

  const fetchProperty = async () => {
    try {
      const response = await api.get(`/properties/${id}`)
      setProperty(response.data.property)
    } catch (error) {
      console.error('Error fetching property:', error)
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (amount?: number, currency: string = 'INR') => {
    if (!amount) return 'Price on request'
    const symbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'
    return `${symbol} ${amount.toLocaleString('en-IN')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Property not found</p>
          <Link to="/" className="text-primary-600 hover:text-primary-700">
            Go back to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">MyGround</h1>
            </Link>
            <Link to="/" className="text-gray-700 hover:text-primary-600">
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative h-96 bg-gray-200">
                {property.media.images && property.media.images.length > 0 ? (
                  <img
                    src={property.media.images[activeImageIndex]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
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
                      <img src={img} alt={`${property.title} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Basic Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                  <p className="text-gray-600">
                    {property.location.locality}, {property.location.area}, {property.location.city}
                  </p>
                </div>
                <button
                  onClick={() => setIsSaved(!isSaved)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  {isSaved ? (
                    <HeartSolidIcon className="w-6 h-6 text-red-500" />
                  ) : (
                    <HeartIcon className="w-6 h-6 text-gray-600" />
                  )}
                </button>
              </div>

              {/* Price */}
              <div className="border-t border-b border-gray-200 py-4 my-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-primary-600">
                      {property.transactionType === 'SELL'
                        ? formatPrice(property.pricing.expectedPrice, property.pricing.currency)
                        : property.transactionType === 'RENT'
                        ? formatPrice(property.pricing.rentAmount, property.pricing.currency)
                        : formatPrice(property.pricing.leaseValue, property.pricing.currency)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {property.transactionType === 'RENT' ? 'Monthly Rent' : property.transactionType === 'LEASE' ? 'Lease Value' : 'Expected Price'}
                      {property.pricing.priceNegotiable && ' • Negotiable'}
                    </p>
                  </div>
                  {property.assetDNA && (
                    <div className="text-right">
                      <div className="text-sm text-gray-600 mb-1">Verification Score</div>
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">🧬 MG Asset DNA™</h3>
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
                      <div className="text-lg font-bold text-green-600">
                        {property.assetDNA.geoVerified ? '✓ Yes' : '✗ No'}
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
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
              <p className="text-gray-700 mb-4">{property.location.address}</p>
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Map integration coming soon</p>
                {/* In production, integrate Google Maps here */}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Owner</h3>
              <div className="mb-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold">
                      {property.listedBy.firstName[0]}{property.listedBy.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {property.listedBy.firstName} {property.listedBy.lastName}
                    </div>
                    <div className="text-sm text-gray-600">{property.listedBy.role}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Trust Score: <span className="font-medium">{property.listedBy.trustScore}/100</span>
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
    </div>
  )
}

