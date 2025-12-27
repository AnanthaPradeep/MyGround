import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProperties } from '../hooks/useProperties'
import PropertyCard from '../components/PropertyCard'
import AdvancedFilters from '../components/AdvancedFilters'
import Logo from '../components/Logo'
import HeaderSearchBar from '../components/HeaderSearchBar'
import HeaderIcons from '../components/HeaderIcons'
import HeaderLocation from '../components/HeaderLocation'
import MobileMenu from '../components/MobileMenu'
import { Bars3Icon } from '@heroicons/react/24/outline'
import { CardSkeleton } from '../components/Loader'

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Build filters from URL params
  const filters = useMemo(() => {
    const filterObj: Record<string, any> = {}
    searchParams.forEach((value, key) => {
      if (value) filterObj[key] = value
    })
    return filterObj
  }, [searchParams])

  const { properties: allProperties, loading } = useProperties({ 
    useSampleData: false, // Fetch from API
    filters 
  })

  // Apply sorting
  const properties = useMemo(() => {
    const sorted = [...allProperties]
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => {
          const priceA = a.pricing.expectedPrice || a.pricing.rentAmount || 0
          const priceB = b.pricing.expectedPrice || b.pricing.rentAmount || 0
          return priceA - priceB
        })
      case 'price-high':
        return sorted.sort((a, b) => {
          const priceA = a.pricing.expectedPrice || a.pricing.rentAmount || 0
          const priceB = b.pricing.expectedPrice || b.pricing.rentAmount || 0
          return priceB - priceA
        })
      case 'verified':
        return sorted.sort((a, b) => {
          const scoreA = a.assetDNA?.verificationScore || 0
          const scoreB = b.assetDNA?.verificationScore || 0
          return scoreB - scoreA
        })
      default:
        return sorted
    }
  }, [allProperties, sortBy])

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
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
              aria-label="Open menu"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>

            {/* Logo - Hidden on mobile (shown in menu), visible on desktop */}
            <Logo showText={true} size="md" className="hidden lg:flex lg:flex-1" />
            
            <div className="hidden sm:block flex-1 min-w-0 lg:flex-none lg:max-w-md">
              <HeaderSearchBar />
            </div>
            <div className="hidden lg:flex items-center gap-2 xl:gap-4">
              <HeaderLocation />
              <HeaderIcons />
            </div>
            <div className="lg:hidden flex items-center">
              <HeaderIcons />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <CardSkeleton count={6} />
              </div>
            ) : properties.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center">
                <p className="text-sm sm:text-base text-gray-600 mb-4">No properties found matching your criteria</p>
                <button
                  onClick={() => {
                    setSearchParams({})
                    setShowFilters(false)
                  }}
                  className="text-sm sm:text-base text-primary-600 hover:text-primary-700"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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

