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
  HomeIcon as PropertyIcon,
  DocumentTextIcon,
  CheckIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'
import { useState, useRef, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { useNotificationStore } from '../store/notificationStore'
import { useWishlistStore } from '../store/wishlistStore'
import { useNotifications } from '../hooks/useNotifications'
import { usePublicNotifications } from '../hooks/usePublicNotifications'
import { useWishlist } from '../hooks/useWishlist'
import { useDrafts } from '../hooks/useDrafts'
import { Notification } from '../types/notification'
import api from '../services/api'
import ThemeToggle from './ThemeToggle'
import LanguageSelector from './LanguageSelector'
import toast from 'react-hot-toast'

/**
 * Header Icons Component - Dashboard, Notification, Wishlist, List Property
 */
export default function HeaderIcons() {
  const { isAuthenticated, user } = useAuthStore()
  const navigate = useNavigate()
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isListPropertyOpen, setIsListPropertyOpen] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)
  const wishlistRef = useRef<HTMLDivElement>(null)
  const listPropertyRef = useRef<HTMLDivElement>(null)

  // Fetch wishlist from API
  const { wishlist, refetch: refetchWishlist, getWishlistCount } = useWishlist({
    useSampleData: false,
    userId: user?.id,
  })

  // Get wishlist count
  const [wishlistCount, setWishlistCount] = useState(0)
  
  // Get wishlist store to listen for updates
  const { lastUpdate: wishlistLastUpdate } = useWishlistStore()

  // Store refetch function in a ref
  const wishlistRefetchRef = useRef(refetchWishlist)
  useEffect(() => {
    wishlistRefetchRef.current = refetchWishlist
  }, [refetchWishlist])

  // Fetch wishlist count immediately when lastUpdate changes
  useEffect(() => {
    if (!isAuthenticated) return
    
    // Immediately fetch count when wishlist updates
    const fetchCount = async () => {
      const count = await getWishlistCount()
      setWishlistCount(count)
    }
    
    fetchCount()
  }, [isAuthenticated, getWishlistCount, wishlistLastUpdate])

  // Refetch wishlist when lastUpdate changes (with small delay to debounce)
  useEffect(() => {
    if (!isAuthenticated || !wishlistLastUpdate) return
    const timeoutId = setTimeout(() => {
      wishlistRefetchRef.current()
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [wishlistLastUpdate, isAuthenticated])

  // Refetch wishlist periodically
  useEffect(() => {
    if (!isAuthenticated) return
    wishlistRefetchRef.current()
    getWishlistCount().then(setWishlistCount)
    const interval = setInterval(() => {
      wishlistRefetchRef.current()
      getWishlistCount().then(setWishlistCount)
    }, 60000) // 60 seconds
    return () => clearInterval(interval)
  }, [isAuthenticated, getWishlistCount])

  // Fetch real notifications from API
  const { 
    notifications: userNotifications, 
    refetch: refetchNotifications,
    markAsRead: markNotificationAsRead,
    markAllAsRead: markAllNotificationsAsRead,
  } = useNotifications({
    useSampleData: false, // Use real API data
    userId: user?.id,
  })

  // Fetch public notifications (property added, sold, etc.)
  const { 
    notifications: publicNotifications,
    unreadCount: unreadPublicCount,
    markAsRead: markPublicAsRead,
    markAllAsRead: markAllPublicAsRead,
    refetch: refetchPublicNotifications,
  } = usePublicNotifications({
    useSampleData: false,
    limit: 10, // Get recent 10 public notifications
  })

  // Get notification store to listen for updates
  const { lastUpdate } = useNotificationStore()

  // Store notification count in state for proper updates (only user notifications count)
  const [notificationCount, setNotificationCount] = useState(0)

  // Combine user and public notifications
  const allNotifications = [
    ...userNotifications.map(n => ({
      ...n,
      isPublic: false,
    })),
    ...publicNotifications.map(n => {
      const location = n.location?.area && n.location?.city 
        ? `${n.location.area}, ${n.location.city}`
        : n.location?.city || 'New Location'
      
      let displayTitle = ''
      let displayMessage = ''
      
      switch (n.type) {
        case 'PROPERTY_ADDED':
          displayTitle = 'New Property Added'
          const transactionLabel = n.transactionType === 'SELL' ? 'for Sale' : 
                                  n.transactionType === 'RENT' ? 'for Rent' : 
                                  n.transactionType === 'LEASE' ? 'for Lease' : 'available'
          displayMessage = `New ${n.propertyCategory} property "${n.propertyTitle}" ${transactionLabel} in ${location}`
          break
        case 'PROPERTY_DELETED':
          displayTitle = 'Property Removed'
          displayMessage = `${n.propertyCategory} property "${n.propertyTitle}" has been removed from ${location}`
          break
        case 'PROPERTY_SOLD':
          displayTitle = 'Property Sold'
          displayMessage = `${n.propertyCategory} property "${n.propertyTitle}" in ${location} has been sold`
          break
        case 'PROPERTY_RENTED':
          displayTitle = 'Property Rented'
          displayMessage = `${n.propertyCategory} property "${n.propertyTitle}" in ${location} has been rented`
          break
        default:
          displayTitle = 'Property Update'
          displayMessage = `${n.propertyCategory} property "${n.propertyTitle}" in ${location} has been updated`
      }
      
      return {
        id: n._id,
        title: displayTitle,
        message: displayMessage,
        type: 'info' as const,
        read: n.read || false, // Use read status from API
        timestamp: new Date(n.createdAt),
        link: `/properties/${n.propertyId}`,
        isPublic: true,
      }
    }),
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  // Update notification count - includes both unread user notifications and unread public notifications
  useEffect(() => {
    // Count unread user notifications
    const unreadUserCount = userNotifications.filter(n => !n.read).length
    // Count unread public notifications (from API)
    // Total count includes both user and public unread notifications
    setNotificationCount(unreadUserCount + unreadPublicCount)
  }, [userNotifications, unreadPublicCount])

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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false)
      }
      if (wishlistRef.current && !wishlistRef.current.contains(event.target as Node)) {
        setIsWishlistOpen(false)
      }
      if (listPropertyRef.current && !listPropertyRef.current.contains(event.target as Node)) {
        setIsListPropertyOpen(false)
      }
    }

    if (isNotificationOpen || isWishlistOpen || isListPropertyOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isNotificationOpen, isWishlistOpen, isListPropertyOpen])

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

  const handleNotificationClick = async (notification: any) => {
    const isPublic = (notification as any).isPublic
    
    // Mark as read via API if not already read
    if (!notification.read) {
      if (isPublic) {
        // Optimistically update local state immediately for public notification
        markPublicAsRead(notification.id)
        // Then update on server
        api.put(`/public-notifications/${notification.id}/read`).then(() => {
          // Refetch public notifications to update unread count
          refetchPublicNotifications()
          triggerRefetch()
        }).catch((error: any) => {
          console.error('Error marking public notification as read:', error)
          // On error, refetch to revert optimistic update
          refetchPublicNotifications()
        })
      } else {
        // Optimistically update local state immediately for user notification
        markNotificationAsRead(notification.id)
        // Then update on server
        api.put(`/notifications/${notification.id}/read`).then(() => {
          refetchNotifications(true)
          triggerRefetch()
        }).catch((error: any) => {
          console.error('Error marking notification as read:', error)
          refetchNotifications(true)
        })
      }
    }

    // Navigate to link if available (works for both public and private)
    if (notification.link) {
      navigate(notification.link)
    }
    setIsNotificationOpen(false)
  }

  const markAllAsRead = async () => {
    try {
      // Optimistically update local state immediately - this will trigger count update via useEffect
      markAllNotificationsAsRead() // Mark all user notifications as read
      markAllPublicAsRead() // Mark all public notifications as read
      // Show success immediately since count is already updated
      toast.success('All notifications marked as read')
      // Then update on server (fire and forget - optimistic update already applied)
      Promise.all([
        api.put('/notifications/read-all'),
        api.put('/public-notifications/read-all'),
      ]).then(() => {
        // Refetch after server confirms to ensure sync
        refetchNotifications(true)
        triggerRefetch()
      }).catch((error: any) => {
        console.error('Error marking all as read on server:', error)
        // On error, refetch to revert optimistic update
        refetchNotifications(true)
      })
    } catch (error: any) {
      console.error('Error marking all as read:', error)
      toast.error(error.response?.data?.error || 'Failed to mark all as read')
    }
  }

  const handleSeeMore = () => {
    navigate('/notifications')
    setIsNotificationOpen(false)
  }

  const handleSeeMoreWishlist = () => {
    navigate('/wishlist')
    setIsWishlistOpen(false)
  }

  // Get recent notifications (last 5 from combined list)
  const recentNotifications = allNotifications.slice(0, 5)
  
  // Get recent wishlist items (last 4)
  const recentWishlist = wishlist.slice(0, 4)

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="hidden lg:flex items-center gap-2 xl:gap-3">
      {/* Language Selector */}
      <LanguageSelector variant="dropdown" />

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
            <span className="absolute top-0 right-0 flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-red-500 dark:bg-red-600 text-white text-xs font-bold rounded-full transform translate-x-1/2 -translate-y-1/2">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </button>

        {/* Notification Dropdown */}
        {isNotificationOpen && (
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
                {notificationCount > 0 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">({notificationCount} new)</span>
                )}
              </div>
              {notificationCount > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    markAllAsRead()
                  }}
                  className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                  title="Mark all as read"
                >
                  <CheckIcon className="w-5 h-5" />
                </button>
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
                  {recentNotifications.map((notification) => {
                    const isPublic = (notification as any).isPublic
                    return (
                      <button
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`relative w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                          !notification.read && !isPublic 
                            ? 'bg-primary-50 dark:bg-primary-900/20 border-l-2 border-primary-500 dark:border-primary-400' 
                            : notification.read && !isPublic
                            ? 'bg-gray-50/50 dark:bg-gray-800/30 opacity-75'
                            : !notification.read && isPublic
                            ? 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500 dark:border-blue-400'
                            : notification.read && isPublic
                            ? 'bg-blue-50/30 dark:bg-blue-900/10 opacity-75'
                            : ''
                        }`}
                      >
                        {/* Blue dot indicator for unread notifications - top right corner */}
                        {!notification.read && (
                          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-blue-500 dark:bg-blue-400 rounded-full shadow-sm"></span>
                        )}
                        {/* Checkmark indicator for read notifications */}
                        {notification.read && (
                          <span className="absolute top-2 right-2 w-4 h-4 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full">
                            <CheckIcon className="w-2.5 h-2.5 text-gray-500 dark:text-gray-400" />
                          </span>
                        )}
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {isPublic ? (
                              <div className={notification.read ? 'opacity-60' : ''}>
                                <GlobeAltIcon className="w-5 h-5 text-blue-500" />
                              </div>
                            ) : (
                              <div className={notification.read ? 'opacity-60' : ''}>
                                {getNotificationIcon(notification.type)}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0 pr-2">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <p className={`text-sm ${!notification.read 
                                  ? 'font-semibold text-gray-900 dark:text-gray-100' 
                                  : 'font-normal text-gray-600 dark:text-gray-400'}`}>
                                  {notification.title}
                                </p>
                                {isPublic && (
                                  <span className="flex-shrink-0 px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded">
                                    Public
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className={`text-xs mt-1 line-clamp-2 ${
                              notification.read 
                                ? 'text-gray-500 dark:text-gray-500' 
                                : 'text-gray-600 dark:text-gray-400'
                            }`}>
                              {notification.message}
                            </p>
                            <p className={`text-xs mt-1 ${
                              notification.read 
                                ? 'text-gray-400 dark:text-gray-600' 
                                : 'text-gray-400 dark:text-gray-500'
                            }`}>
                              {formatTimeAgo(notification.timestamp)}
                            </p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
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

      {/* Wishlist Icon with Dropdown */}
      <div className="relative" ref={wishlistRef}>
        <button
          className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          title="Wishlist"
          onClick={() => setIsWishlistOpen(!isWishlistOpen)}
        >
          <HeartIcon className="w-6 h-6" />
          {wishlistCount > 0 && (
            <span className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 bg-primary-600 dark:bg-primary-500 text-white text-xs font-bold rounded-full">
              {wishlistCount > 9 ? '9+' : wishlistCount}
            </span>
          )}
        </button>

        {/* Wishlist Dropdown */}
        {isWishlistOpen && (
          <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-[32rem] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-900">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Wishlist</h3>
              {wishlistCount > 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">{wishlistCount} items</span>
              )}
            </div>

            {/* Wishlist Items */}
            <div className="overflow-y-auto scrollbar-hide max-h-96">
              {recentWishlist.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  <HeartIcon className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                  <p className="text-sm">Your wishlist is empty</p>
                  <p className="text-xs mt-1">Start saving properties you love!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {recentWishlist.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        navigate(`/properties/${item.property._id}`)
                        setIsWishlistOpen(false)
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        {/* Property Image */}
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                          {item.property.media?.images && item.property.media.images.length > 0 ? (
                            <img
                              src={item.property.media.images[0]}
                              alt={item.property.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <PropertyIcon className="w-full h-full text-gray-400 dark:text-gray-500 p-2" />
                          )}
                        </div>
                        {/* Property Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                            {item.property.title}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                            {item.property.location?.locality}, {item.property.location?.city}
                          </p>
                          <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mt-1">
                            {item.property.pricing?.expectedPrice 
                              ? `₹${(item.property.pricing.expectedPrice / 100000).toFixed(1)}L`
                              : item.property.pricing?.rentAmount 
                              ? `₹${(item.property.pricing.rentAmount / 1000).toFixed(0)}K/mo`
                              : 'Price on request'}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer - See More Button */}
            {recentWishlist.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <button
                  onClick={handleSeeMoreWishlist}
                  className="w-full text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-center"
                >
                  See More
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* List Property Dropdown */}
      <div className="relative" ref={listPropertyRef}>
        <button
          className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          title="List Property"
          onClick={() => setIsListPropertyOpen(!isListPropertyOpen)}
        >
          <PlusCircleIcon className="w-6 h-6" />
          {draftCount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-orange-500 dark:bg-orange-600 text-white text-xs font-bold rounded-full border-2 border-white dark:border-gray-800 shadow-sm z-10">
              {draftCount > 9 ? '9+' : draftCount}
            </span>
          )}
        </button>

        {/* List Property Dropdown Menu */}
        {isListPropertyOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 py-1 z-50">
            <Link
              to="/properties/create"
              onClick={() => setIsListPropertyOpen(false)}
              className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <PlusCircleIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span>List Your Property</span>
            </Link>
            
            <Link
              to="/dashboard?tab=drafts"
              onClick={() => {
                setIsListPropertyOpen(false)
                navigate('/dashboard?tab=drafts')
              }}
              className="flex items-center justify-between space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <DocumentTextIcon className="w-5 h-5 text-orange-500 dark:text-orange-400" />
                <span>Draft Properties</span>
              </div>
              {draftCount > 0 && (
                <span className="px-2 py-0.5 bg-orange-500 dark:bg-orange-600 text-white text-xs font-bold rounded-full">
                  {draftCount > 9 ? '9+' : draftCount}
                </span>
              )}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

