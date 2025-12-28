import { Link, useNavigate } from 'react-router-dom'
import { 
  HomeIcon, 
  BellIcon, 
  HeartIcon,
  PlusCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  Squares2X2Icon,
  HomeIcon as PropertyIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { useState, useRef, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { useNotificationStore } from '../store/notificationStore'
import { useNotifications } from '../hooks/useNotifications'
import { Notification } from '../types/notification'
import api from '../services/api'
import ThemeToggle from './ThemeToggle'

/**
 * Header Icons Component - Dashboard, Notification, Wishlist, List Property
 */
export default function HeaderIcons() {
  const { isAuthenticated, user } = useAuthStore()
  const navigate = useNavigate()
  const [wishlistCount] = useState(0) // TODO: Get from store/API
  const [isWishlistActive, setIsWishlistActive] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)

  // Fetch real notifications from API
  const { notifications, refetch: refetchNotifications } = useNotifications({
    useSampleData: false, // Use real API data
    userId: user?.id,
  })

  // Get notification store to listen for updates
  const { lastUpdate } = useNotificationStore()

  // Calculate unread notification count (only count unread notifications)
  const notificationCount = notifications.filter(n => !n.read).length

  // Store refetch function in a ref to avoid dependency issues
  const refetchRef = useRef(refetchNotifications)
  useEffect(() => {
    refetchRef.current = refetchNotifications
  }, [refetchNotifications])

  // Refetch notifications when lastUpdate changes (triggered from Notifications page)
  useEffect(() => {
    if (!isAuthenticated || !lastUpdate) return
    // Use a small delay to debounce rapid updates
    const timeoutId = setTimeout(() => {
      refetchRef.current()
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [lastUpdate, isAuthenticated])

  // Refetch notifications periodically to get new ones
  useEffect(() => {
    if (!isAuthenticated) return

    // Initial fetch
    refetchRef.current()

    // Refetch every 60 seconds to get new notifications (increased from 30s)
    const interval = setInterval(() => {
      refetchRef.current()
    }, 60000) // 60 seconds

    return () => clearInterval(interval)
  }, [isAuthenticated])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false)
      }
    }

    if (isNotificationOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isNotificationOpen])

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
      case 'error':
        return <XCircleIcon className="w-5 h-5 text-red-500" />
      case 'property':
        return <PropertyIcon className="w-5 h-5 text-primary-600" />
      case 'message':
        return <BellIcon className="w-5 h-5 text-blue-500" />
      default:
        return <InformationCircleIcon className="w-5 h-5 text-gray-500" />
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const { triggerRefetch } = useNotificationStore()

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read via API if not already read
    if (!notification.read) {
      try {
        await api.put(`/notifications/${notification.id}/read`)
        // Refetch to update count
        await refetchNotifications()
        // Trigger refetch in other components
        triggerRefetch()
      } catch (error: any) {
        console.error('Error marking notification as read:', error)
      }
    }

    if (notification.link) {
      navigate(notification.link)
    }
    setIsNotificationOpen(false)
  }

  const handleSeeMore = () => {
    navigate('/notifications')
    setIsNotificationOpen(false)
  }

  // Get recent notifications (last 5)
  const recentNotifications = notifications.slice(0, 5)

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="hidden lg:flex items-center gap-2 xl:gap-3">
      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Home Icon */}
      <Link
        to="/"
        className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        title="Home"
      >
        <HomeIcon className="w-6 h-6" />
      </Link>

      {/* Dashboard Icon */}
      <Link
        to="/dashboard"
        className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        title="Dashboard"
      >
        <Squares2X2Icon className="w-6 h-6" />
      </Link>

      {/* Notification Icon with Dropdown */}
      <div className="relative" ref={notificationRef}>
        <button
          className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          title="Notifications"
          onClick={() => setIsNotificationOpen(!isNotificationOpen)}
        >
          <BellIcon className="w-6 h-6" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </button>

        {/* Notification Dropdown */}
        {isNotificationOpen && (
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-900">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
              {notificationCount > 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">{notificationCount} new</span>
              )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto scrollbar-hide max-h-80">
              {recentNotifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  <BellIcon className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                  <p className="text-sm">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {recentNotifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        !notification.read ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <span className="flex-shrink-0 w-2 h-2 bg-primary-600 dark:bg-primary-400 rounded-full mt-1.5"></span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {formatTimeAgo(notification.timestamp)}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer - See More Button */}
            {recentNotifications.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <button
                  onClick={handleSeeMore}
                  className="w-full text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-center"
                >
                  See More
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Wishlist Icon */}
      <button
        className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        title="Wishlist"
        onClick={() => {
          // TODO: Navigate to wishlist or toggle
          setIsWishlistActive(!isWishlistActive)
        }}
      >
        {isWishlistActive ? (
          <HeartSolidIcon className="w-6 h-6 text-red-500 dark:text-red-400" />
        ) : (
          <HeartIcon className="w-6 h-6" />
        )}
        {wishlistCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 bg-primary-600 dark:bg-primary-500 text-white text-xs font-bold rounded-full">
            {wishlistCount > 9 ? '9+' : wishlistCount}
          </span>
        )}
      </button>

      {/* List Property Icon */}
      <Link
        to="/properties/create"
        className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        title="List Property"
      >
        <PlusCircleIcon className="w-6 h-6" />
      </Link>
    </div>
  )
}

