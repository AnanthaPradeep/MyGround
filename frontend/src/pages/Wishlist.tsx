import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HeartIcon, Bars3Icon, TrashIcon } from '@heroicons/react/24/outline'
import { useAuthStore } from '../store/authStore'
import { useWishlistStore } from '../store/wishlistStore'
import { useWishlist } from '../hooks/useWishlist'
import ProtectedRoute from '../components/ProtectedRoute'
import Logo from '../components/Logo'
import HeaderSearchBar from '../components/HeaderSearchBar'
import HeaderIcons from '../components/HeaderIcons'
import HeaderLocation from '../components/HeaderLocation'
import MobileMenu from '../components/MobileMenu'
import Footer from '../components/Footer'
import UserDropdown from '../components/UserDropdown'
import PropertyCard from '../components/PropertyCard'
import { CardSkeleton } from '../components/Loader'
import toast from 'react-hot-toast'

export default function Wishlist() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { triggerRefetch } = useWishlistStore()

  // Fetch wishlist from API
  const { wishlist, loading, refetch, removeFromWishlist } = useWishlist({
    useSampleData: false,
    userId: user?.id,
  })

  const handleRemove = async (propertyId: string, propertyTitle: string) => {
    if (!window.confirm(`Remove "${propertyTitle}" from your wishlist?`)) {
      return
    }

    try {
      await removeFromWishlist(propertyId)
      toast.success('Removed from wishlist')
      refetch()
      triggerRefetch() // This will update HeaderIcons immediately
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove from wishlist')
    }
  }

  return (
    <ProtectedRoute>
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

              {/* Logo */}
              <Logo showText={true} size="md" className="flex-1 lg:flex-none" />

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
                <HeaderLocation />
                <HeaderIcons />
                <UserDropdown />
              </div>

              {/* Mobile: Show only User Dropdown */}
              <div className="lg:hidden flex items-center">
                <UserDropdown />
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

        {/* Header Search Bar */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-3">
              <HeaderSearchBar />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                <HeartIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-gray-100">My Wishlist</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {wishlist.length === 0 
                    ? 'No saved properties yet' 
                    : `${wishlist.length} ${wishlist.length === 1 ? 'property' : 'properties'} saved`}
                </p>
              </div>
            </div>
          </div>

          {/* Wishlist Items */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              <CardSkeleton count={8} />
            </div>
          ) : wishlist.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <HeartIcon className="w-20 h-20 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <h2 className="text-2xl font-heading font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start saving properties you love by clicking the heart icon
              </p>
              <button
                onClick={() => navigate('/properties')}
                className="px-6 py-3 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 font-medium"
              >
                Browse Properties
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {wishlist.map((item) => (
                <div key={item.id} className="relative group">
                  <PropertyCard property={item.property} />
                  <button
                    onClick={() => handleRemove(item.property._id, item.property.title)}
                    className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md dark:shadow-gray-900 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    title="Remove from wishlist"
                  >
                    <TrashIcon className="w-5 h-5 text-red-500 dark:text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </ProtectedRoute>
  )
}

