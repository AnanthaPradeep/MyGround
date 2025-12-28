import { useRef, useEffect } from 'react'
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
  Squares2X2Icon
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../store/authStore'
import { useLocationStore } from '../store/locationStore'
import Logo from './Logo'
import HeaderLocation from './HeaderLocation'
import ThemeToggle from './ThemeToggle'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { isAuthenticated, user, logout } = useAuthStore()
  const { userLocation } = useLocationStore()
  const navigate = useNavigate()
  const menuRef = useRef<HTMLDivElement>(null)

  const handleLogout = () => {
    logout()
    navigate('/')
    onClose()
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
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <Logo showText={true} size="sm" />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={onClose}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                aria-label="Close menu"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
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
                    <span>List Property</span>
                  </Link>

                  <Link
                    to="/notifications"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <BellIcon className="w-5 h-5" />
                    <span>Notifications</span>
                  </Link>

                  <Link
                    to="/profile"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <UserIcon className="w-5 h-5" />
                    <span>Profile</span>
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

