import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import api from '../services/api'
import PropertyCard from '../components/PropertyCard'
import AdvancedFilters from '../components/AdvancedFilters'

interface Property {
  _id: string
  title: string
  location: {
    city: string
    area: string
    locality: string
  }
  pricing: {
    expectedPrice?: number
    rentAmount?: number
    currency: string
  }
  media: {
    images: string[]
  }
  assetDNA: {
    verificationScore: number
    legalRisk: string
    assetTrustScore: number
  }
  propertyCategory: string
  transactionType: string
  views: number
  saves: number
}

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    fetchProperties()
  }, [searchParams, sortBy])

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams(searchParams)
      params.append('page', '1')
      params.append('limit', '20')
      
      const response = await api.get(`/properties?${params.toString()}`)
      setProperties(response.data.properties || [])
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: any) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    setSearchParams(params)
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
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Properties</h1>
            <p className="text-gray-600">
              {properties.length} properties found
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="area-small">Area: Small to Large</option>
              <option value="verified">Verified First</option>
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {showFilters ? 'Hide' : 'Show'} Filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1">
              <AdvancedFilters
                searchParams={searchParams}
                onFilterChange={handleFilterChange}
              />
            </div>
          )}

          {/* Properties Grid */}
          <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <p className="text-gray-600 mb-4">No properties found matching your criteria</p>
                <button
                  onClick={() => {
                    setSearchParams({})
                    setShowFilters(false)
                  }}
                  className="text-primary-600 hover:text-primary-700"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

