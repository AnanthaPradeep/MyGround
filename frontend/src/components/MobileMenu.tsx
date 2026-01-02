import { useRef, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  XMarkIcon, 
  HomeIcon,
  PlusCircleIcon,
  BellIcon,
  UserIcon,
  Cog6ToothIcon,
  MapPinIcon,
  ChevronDownIcon,
  Squares2X2Icon,
  HeartIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../store/authStore'
import { useLocationStore } from '../store/locationStore'
import { useWishlistStore } from '../store/wishlistStore'
import { useNotificationStore } from '../store/notificationStore'
import { useWishlist } from '../hooks/useWishlist'
import { useNotifications } from '../hooks/useNotifications'
import { useDrafts } from '../hooks/useDrafts'
import Logo from './Logo'
import HeaderLocation from './HeaderLocation'
import ThemeToggle from './ThemeToggle'
import LanguageSelector from './LanguageSelector'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { isAuthenticated, user, logout } = useAuthStore()
  const { userLocation } = useLocationStore()
  const { lastUpdate: wishlistLastUpdate } = useWishlistStore()
  const { lastUpdate: notificationLastUpdate } = useNotificationStore()
  const { getWishlistCount } = useWishlist({
    useSampleData: false,
    userId: user?.id,
  })
  const { notifications, refetch: refetchNotifications } = useNotifications({
    useSampleData: false,
    userId: user?.id,
  })
  const navigate = useNavigate()
  const menuRef = useRef<HTMLDivElement>(null)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [notificationCount, setNotificationCount] = useState(0)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch wishlist count
  useEffect(() => {
    if (isAuthenticated) {
      getWishlistCount().then(setWishlistCount)
    }
  }, [isAuthenticated, getWishlistCount, wishlistLastUpdate])

  // Update notification count when notifications change
  useEffect(() => {
    if (isAuthenticated) {
      const unreadCount = notifications.filter(n => !n.read).length
      setNotificationCount(unreadCount)
    }
  }, [notifications, isAuthenticated])

  // Refetch notifications when lastUpdate changes
  useEffect(() => {
    if (!isAuthenticated || !notificationLastUpdate) return
    const timeoutId = setTimeout(() => {
      refetchNotifications()
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [notificationLastUpdate, isAuthenticated, refetchNotifications])

  // Fetch draft count
  const { getDraftCount } = useDrafts({ userId: user?.id })
  const [draftCount, setDraftCount] = useState(0)

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      getDraftCount().then(setDraftCount)
    }
  }, [isAuthenticated, user?.id, getDraftCount])

  // Listen for draft saved events to refresh count immediately
  useEffect(() => {
    if (!isAuthenticated) return

    const handleDraftSaved = () => {
      getDraftCount().then(setDraftCount)
    }

    window.addEventListener('draftSaved', handleDraftSaved)
    return () => {
      window.removeEventListener('draftSaved', handleDraftSaved)
    }
  }, [isAuthenticated, getDraftCount])

  // Also refetch periodically to keep count updated
  useEffect(() => {
    if (!isAuthenticated) return
    
    const interval = setInterval(() => {
      getDraftCount().then(setDraftCount)
    }, 30000) // Refetch every 30 seconds
    
    return () => clearInterval(interval)
  }, [isAuthenticated, getDraftCount])

  const handleLogout = () => {
    logout()
    navigate('/')
    onClose()
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      // Show login modal or navigate to login
      navigate('/login')
      setIsSearchOpen(false)
      setSearchQuery('')
      onClose()
      return
    }
    
    if (searchQuery.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchQuery)}`)
      setIsSearchOpen(false)
      setSearchQuery('')
      onClose()
    } else {
      navigate('/properties')
      setIsSearchOpen(false)
      onClose()
    }
  }

  // Close menu when clicking outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    // Add event listener with a small delay to prevent immediate close on open
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Menu */}
      <div 
        ref={menuRef}
        className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1 min-w-0">
                <Logo showText={true} size="sm" />
              </div>
              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0"
                aria-label="Close menu"
              >
                <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div className="[&>div]:relative [&_button]:px-2.5 [&_button]:py-2 [&_button]:text-sm [&_button]:h-9 [&_button]:flex [&_button]:items-center">
                <LanguageSelector variant="dropdown" />
              </div>
              <div className="[&_button]:p-2 [&_button]:h-9 [&_button]:w-9 [&_button]:flex [&_button]:items-center [&_button]:justify-center">
                <ThemeToggle />
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto scrollbar-hide py-4">
            <div className="px-2 space-y-1">
              {/* Location Menu Item */}
              <div className="px-2 mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                <div className="relative flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <MapPinIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {userLocation ? (
                        <>
                          {userLocation.area || userLocation.locality || userLocation.city}
                          {userLocation.city && userLocation.area && userLocation.city !== userLocation.area && `, ${userLocation.city}`}
                        </>
                      ) : (
                        'Select Location'
                      )}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Tap to change</p>
                  </div>
                  <div className="absolute inset-0" onClick={(e) => e.stopPropagation()}>
                    <div className="h-full flex items-center justify-end pr-3 sm:pr-4">
                      <div className="[&>button]:opacity-0 [&>button]:pointer-events-auto [&>button]:w-full [&>button]:h-full [&>button]:flex [&>button]:items-center [&>button]:justify-end [&_*[data-location-trigger]]:opacity-0">
                        <HeaderLocation />
                      </div>
                    </div>
                  </div>
                  <ChevronDownIcon className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                </div>

                {/* Search Menu Item */}
                <div className="mt-2">
                  {!isSearchOpen ? (
                    <button
                      onClick={() => setIsSearchOpen(true)}
                      className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <MagnifyingGlassIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Search Properties</span>
                    </button>
                  ) : (
                    <div className="px-3 sm:px-4 py-2.5 sm:py-3">
                      <form onSubmit={handleSearch}>
                        <div className="relative">
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search properties..."
                            autoFocus
                            className="w-full px-4 py-2.5 pl-10 pr-20 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                          />
                          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setIsSearchOpen(false)
                                setSearchQuery('')
                              }}
                              className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                              aria-label="Cancel"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                            <button
                              type="submit"
                              className="p-1.5 bg-primary-600 dark:bg-primary-500 text-white rounded hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
                              aria-label="Search"
                            >
                              <MagnifyingGlassIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>

              <Link
                to="/"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <HomeIcon className="w-5 h-5" />
                <span>Home</span>
              </Link>

              <Link
                to="/properties"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <HomeIcon className="w-5 h-5" />
                <span>Browse Properties</span>
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Squares2X2Icon className="w-5 h-5" />
                    <span>Dashboard</span>
                  </Link>

                  <Link
                    to="/properties/create"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <PlusCircleIcon className="w-5 h-5" />
                    <span>List Your Property</span>
                  </Link>

                  <Link
                    to="/dashboard?tab=drafts"
                    onClick={(e) => {
                      e.preventDefault()
                      navigate('/dashboard?tab=drafts')
                      onClose()
                    }}
                    className="relative flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <DocumentTextIcon className="w-5 h-5 text-orange-500 dark:text-orange-400" />
                    <span>Draft Properties</span>
                    {draftCount > 0 && (
                      <span className="ml-auto flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-orange-500 dark:bg-orange-600 text-white text-xs font-bold rounded-full">
                        {draftCount > 9 ? '9+' : draftCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/notifications"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <BellIcon className="w-5 h-5" />
                    <span>Notifications</span>
                    {notificationCount > 0 && (
                      <span className="ml-auto flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-red-500 dark:bg-red-600 text-white text-xs font-bold rounded-full">
                        {notificationCount > 9 ? '9+' : notificationCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/wishlist"
                    onClick={onClose}
                    className="relative flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <HeartIcon className="w-5 h-5" />
                    <span>Wishlist</span>
                    {wishlistCount > 0 && (
                      <span className="ml-auto flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-primary-600 dark:bg-primary-500 text-white text-xs font-bold rounded-full">
                        {wishlistCount > 9 ? '9+' : wishlistCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/settings"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Cog6ToothIcon className="w-5 h-5" />
                    <span>Settings</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <UserIcon className="w-5 h-5" />
                    <span>Sign In</span>
                  </Link>

                  <Link
                    to="/register"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
                  >
                    <UserIcon className="w-5 h-5" />
                    <span>Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </nav>

          {/* Footer */}
          {isAuthenticated && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="px-4 py-2 mb-2">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

