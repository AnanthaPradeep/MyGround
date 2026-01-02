import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  BellIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon, 
  XCircleIcon,
  HomeIcon as PropertyIcon,
  TrashIcon,
  CheckIcon,
  GlobeAltIcon,
  Bars3Icon
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../store/authStore'
import { useNotificationStore } from '../store/notificationStore'
import { useNotifications } from '../hooks/useNotifications'
import { usePublicNotifications } from '../hooks/usePublicNotifications'
import ProtectedRoute from '../components/ProtectedRoute'
import Logo from '../components/Logo'
import HeaderSearchDropdown from '../components/HeaderSearchDropdown'
import HeaderIcons from '../components/HeaderIcons'
import HeaderLocation from '../components/HeaderLocation'
import MobileMenu from '../components/MobileMenu'
import Footer from '../components/Footer'
import UserDropdown from '../components/UserDropdown'
import { Notification } from '../types/notification'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function Notifications() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<'all' | 'unread' | 'public'>('all')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { triggerRefetch } = useNotificationStore()

  // Fetch user-specific notifications (only for property owner)
  const { 
    notifications: userNotifications, 
    loading: loadingUser, 
    refetch: refetchUserNotifications,
    markAsRead: markNotificationAsRead,
    markAllAsRead: markAllNotificationsAsRead,
  } = useNotifications({
    useSampleData: false, // Fetch from API
    userId: user?.id,
  })

  // Fetch public notifications (for all users - property added, deleted, sold, etc.)
  const { 
    notifications: publicNotifications, 
    loading: loadingPublic, 
    refetch: refetchPublicNotifications,
    unreadCount: unreadPublicCount,
    markAsRead: markPublicAsRead,
    markAllAsRead: markAllPublicAsRead,
  } = usePublicNotifications({
    useSampleData: false, // Fetch from API
    limit: 50,
  })

  // Combine and format notifications
  const allNotifications = [
    ...userNotifications.map(n => ({
      ...n,
      isPublic: false,
      displayTitle: n.title,
      displayMessage: n.message,
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
        displayTitle,
        displayMessage,
      }
    }),
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  const notifications = filter === 'unread' 
    ? allNotifications.filter(n => !n.read)
    : filter === 'public'
    ? allNotifications.filter(n => (n as any).isPublic)
    : allNotifications

  const unreadUserCount = userNotifications.filter(n => !n.read).length
  const unreadCount = unreadUserCount + unreadPublicCount // Total unread (user + public)
  const publicCount = publicNotifications.length

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-6 h-6 text-green-500" />
      case 'warning':
        return <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />
      case 'error':
        return <XCircleIcon className="w-6 h-6 text-red-500" />
      case 'property':
        return <PropertyIcon className="w-6 h-6 text-primary-600" />
      case 'message':
        return <BellIcon className="w-6 h-6 text-blue-500" />
      default:
        return <InformationCircleIcon className="w-6 h-6 text-gray-500" />
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes} minutes ago`
    if (hours < 24) return `${hours} hours ago`
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    }).format(date)
  }

  const handleNotificationClick = async (notification: any) => {
    // Mark as read if not already read (works for both user and public notifications)
    if (!notification.read) {
      try {
        if (notification.isPublic) {
          // Optimistically update local state immediately for public notification
          markPublicAsRead(notification.id)
          // Then update on server
          await api.put(`/public-notifications/${notification.id}/read`)
          // Refetch to ensure sync
          await refetchPublicNotifications()
        } else {
          // Optimistically update local state immediately for user notification
          markNotificationAsRead(notification.id)
          // Then update on server
          await api.put(`/notifications/${notification.id}/read`)
          // Refetch to ensure sync (bypass throttle)
          await refetchUserNotifications(true)
        }
        // Trigger refetch in HeaderIcons component
        triggerRefetch()
      } catch (error: any) {
        console.error('Error marking notification as read:', error)
        // On error, refetch to revert optimistic update
        if (notification.isPublic) {
          await refetchPublicNotifications()
        } else {
          await refetchUserNotifications(true)
        }
        toast.error(error.response?.data?.error || 'Failed to mark notification as read')
      }
    }

    if (notification.link) {
      navigate(notification.link)
    }
  }

  const markAllAsRead = async () => {
    try {
      // Optimistically update local state immediately for both user and public notifications
      markAllNotificationsAsRead() // Mark all user notifications as read
      markAllPublicAsRead() // Mark all public notifications as read
      
      // Then update on server
      await Promise.all([
        api.put('/notifications/read-all'),
        api.put('/public-notifications/read-all'),
      ])
      
      // Refetch notifications to ensure sync (bypass throttle)
      await refetchUserNotifications(true)
      await refetchPublicNotifications()
      
      // Trigger refetch in HeaderIcons component
      triggerRefetch()
      
      toast.success('All notifications marked as read')
    } catch (error: any) {
      console.error('Error marking all as read:', error)
      console.error('Error details:', error.response?.data)
      // On error, refetch to revert optimistic update
      await refetchUserNotifications(true)
      await refetchPublicNotifications()
      toast.error(error.response?.data?.error || 'Failed to mark all as read')
    }
  }

  const deleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      // Only delete user notifications (public notifications can't be deleted)
      await api.delete(`/notifications/${id}`)
      // Refetch to get updated list
      await refetchUserNotifications()
      toast.success('Notification deleted')
    } catch (error: any) {
      console.error('Error deleting notification:', error)
      toast.error(error.response?.data?.error || 'Failed to delete notification')
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
                <UserDropdown />
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-gray-100 mb-2">Notifications</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                </p>
              </div>
              <button
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                  unreadCount > 0
                    ? 'text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30'
                    : 'text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50'
                }`}
              >
                <CheckIcon className="w-4 h-4" />
                Mark all as read
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                All ({allNotifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  filter === 'unread'
                    ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                My Notifications ({unreadCount})
              </button>
              <button
                onClick={() => setFilter('public')}
                className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-1 ${
                  filter === 'public'
                    ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <GlobeAltIcon className="w-4 h-4" />
                Activity Feed ({publicCount})
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {(loadingUser || loadingPublic) ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
                <BellIcon className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="text-lg font-heading font-semibold text-gray-900 dark:text-gray-100 mb-2">No notifications</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {filter === 'unread' 
                    ? "You're all caught up! No unread notifications."
                    : "You don't have any notifications yet."}
                </p>
              </div>
            ) : (
              notifications.map((notification) => {
                const isPublic = (notification as any).isPublic
                const hasLink = notification.link
                return (
                  <div
                    key={notification.id}
                    onClick={() => {
                      // Mark as read when clicked (for both public and private)
                      if (!notification.read) {
                        handleNotificationClick(notification)
                      }
                      // Navigate to the link if available
                      if (hasLink) {
                        navigate(notification.link!)
                      }
                    }}
                    className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md dark:hover:shadow-gray-900/50 transition-all ${
                      hasLink ? 'cursor-pointer' : (!isPublic ? 'cursor-pointer' : 'cursor-pointer')
                    } ${
                      !notification.read && !isPublic 
                        ? 'border-l-4 border-primary-600 dark:border-primary-400 bg-primary-50/30 dark:bg-primary-900/10' 
                        : notification.read && !isPublic
                        ? 'border-l-2 border-gray-300 dark:border-gray-600 opacity-75'
                        : !notification.read && isPublic
                        ? 'border-l-4 border-blue-500 dark:border-blue-400 bg-blue-50/30 dark:bg-blue-900/10'
                        : notification.read && isPublic
                        ? 'border-l-2 border-blue-300 dark:border-blue-600 opacity-75'
                        : ''
                    }`}
                  >
                    {/* Blue dot indicator for unread notifications - top right corner */}
                    {!notification.read && (
                      <span className="absolute top-3 right-3 w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded-full shadow-sm ring-2 ring-blue-200 dark:ring-blue-800"></span>
                    )}
                    {/* Checkmark indicator for read notifications */}
                    {notification.read && (
                      <span className="absolute top-3 right-3 w-5 h-5 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full">
                        <CheckIcon className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                      </span>
                    )}
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 ${notification.read ? 'opacity-60' : ''}`}>
                        {isPublic ? (
                          <GlobeAltIcon className="w-6 h-6 text-blue-500" />
                        ) : (
                          getNotificationIcon(notification.type)
                        )}
                      </div>
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`text-base font-heading ${
                                !notification.read 
                                  ? 'font-bold text-gray-900 dark:text-gray-100' 
                                  : 'font-normal text-gray-600 dark:text-gray-400'
                              }`}>
                                {notification.title}
                              </h3>
                              {isPublic && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                  Public
                                </span>
                              )}
                            </div>
                            <p className={`text-sm mb-2 ${
                              notification.read 
                                ? 'text-gray-500 dark:text-gray-500' 
                                : 'text-gray-600 dark:text-gray-400'
                            }`}>
                              {notification.message}
                            </p>
                            <p className={`text-xs ${
                              notification.read 
                                ? 'text-gray-400 dark:text-gray-600' 
                                : 'text-gray-400'
                            }`}>
                              {formatTimeAgo(notification.timestamp)}
                            </p>
                          </div>
                          {!isPublic && (
                            <button
                              onClick={(e) => deleteNotification(notification.id, e)}
                              className="flex-shrink-0 p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              aria-label="Delete notification"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </ProtectedRoute>
  )
}

