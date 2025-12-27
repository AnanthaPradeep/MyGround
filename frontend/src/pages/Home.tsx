import { Link } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { ShieldCheckIcon, MapPinIcon, ScaleIcon, ClockIcon } from '@heroicons/react/24/outline'
import { useAuthStore } from '../store/authStore'
import { useProperties } from '../hooks/useProperties'
import PropertyCard from '../components/PropertyCard'
import SearchBar from '../components/SearchBar'
import QuickFilters from '../components/QuickFilters'
import TrustBar from '../components/TrustBar'
import ExploreByPurpose from '../components/ExploreByPurpose'
import TrendingSection from '../components/TrendingSection'
import AssetDNAPreview from '../components/AssetDNAPreview'
import UserDropdown from '../components/UserDropdown'
import HeaderIcons from '../components/HeaderIcons'
import HeaderLocation from '../components/HeaderLocation'
import MobileMenu from '../components/MobileMenu'
import { Bars3Icon } from '@heroicons/react/24/outline'
import Logo from '../components/Logo'
import { CardSkeleton } from '../components/Loader'

export default function Home() {
  const { isAuthenticated } = useAuthStore()
  const { properties, loading } = useProperties({ useSampleData: false }) // Fetch from API to get recent properties
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Get recent properties (sorted by createdAt, newest first)
  const recentProperties = useMemo(() => {
    return [...properties]
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime()
        const dateB = new Date(b.createdAt || 0).getTime()
        return dateB - dateA // Newest first
      })
      .slice(0, 8) // Show latest 8 properties
  }, [properties])

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
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
              <HeaderLocation />
              {isAuthenticated ? (
                <>
                  <HeaderIcons />
                  <UserDropdown />
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-primary-600 text-sm"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 whitespace-nowrap"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile: Show only User Dropdown or Auth buttons */}
            <div className="lg:hidden flex items-center">
              {isAuthenticated ? (
                <UserDropdown />
              ) : (
                <Link
                  to="/login"
                  className="px-3 py-1.5 bg-primary-600 text-white text-xs rounded-lg hover:bg-primary-700"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Every Property. One Truth.
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              India's most trusted real estate marketplace with MG Asset DNA™ verification
            </p>
          </div>

          {/* Search Bar */}
          <SearchBar />

          {/* Quick Filters */}
          <QuickFilters />
        </div>
      </section>

      {/* Trust Bar */}
      <TrustBar />

      {/* Explore by Purpose */}
      <ExploreByPurpose />

      {/* MG Asset DNA Preview Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Know the Truth Before You Visit
            </h2>
            <p className="text-gray-600">
              Every property on MyGround comes with MG Asset DNA™ - a unique verification system
            </p>
          </div>
          <AssetDNAPreview properties={properties.slice(0, 4)} />
        </div>
      </section>

      {/* Trending & Insights */}
      <TrendingSection />

      {/* Recent Properties */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Recent Properties</h2>
                <p className="text-gray-600">Newly listed properties on MyGround</p>
              </div>
            </div>
            <Link
              to="/properties"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <CardSkeleton count={8} />
            </div>
          ) : recentProperties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No recent properties yet. Be the first to list!</p>
              <Link
                to="/properties/create"
                className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                List Your Property
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {recentProperties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Properties</h2>
              <p className="text-gray-600">Verified properties with complete Asset DNA</p>
            </div>
            <Link
              to="/properties"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <CardSkeleton count={8} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}

          {properties.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-600">No properties found. Be the first to list!</p>
              <Link
                to="/properties/create"
                className="mt-4 inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                List Your Property
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose MyGround */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Why Choose MyGround?</h2>
            <p className="text-gray-600">Trust, transparency, and intelligence in every transaction</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">MG Asset DNA™</h3>
              <p className="text-gray-600">
                Every property gets a unique digital identity with verification scores, legal risk assessment, and market intelligence
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPinIcon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Geo-Verified</h3>
              <p className="text-gray-600">
                All properties are geo-verified with accurate coordinates and location intelligence
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ScaleIcon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Legal Transparency</h3>
              <p className="text-gray-600">
                Complete legal status, compliance tracking, and risk assessment for every property
              </p>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">1.2M+</div>
              <div className="text-gray-600">Properties Analyzed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">₹45,000 Cr</div>
              <div className="text-gray-600">Assets Tracked</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">92%</div>
              <div className="text-gray-600">Listings Geo-Verified</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of property owners, buyers, and investors on MyGround
          </p>
          <div className="flex justify-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/register"
                  className="px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100"
                >
                  Sign Up Free
                </Link>
                <Link
                  to="/properties/create"
                  className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary-600"
                >
                  List Property
                </Link>
              </>
            ) : (
              <Link
                to="/properties/create"
                className="px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100"
              >
                List Your Property
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">MyGround</h3>
              <p className="text-gray-400">
                Every Property. One Truth.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Buyers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/properties" className="hover:text-white">Browse Properties</Link></li>
                <li><Link to="/search" className="hover:text-white">Advanced Search</Link></li>
                <li><Link to="/saved" className="hover:text-white">Saved Searches</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Sellers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/properties/create" className="hover:text-white">List Property</Link></li>
                <li><Link to="/dashboard" className="hover:text-white">Dashboard</Link></li>
                <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link to="/about" className="hover:text-white">About Us</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 MyGround. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
