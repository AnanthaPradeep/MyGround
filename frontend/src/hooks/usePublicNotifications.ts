import { useState, useEffect } from 'react'
import api from '../services/api'

export interface PublicNotification {
  _id: string
  type: 'PROPERTY_ADDED' | 'PROPERTY_SOLD' | 'PROPERTY_RENTED' | 'PROPERTY_DELETED' | 'PROPERTY_UPDATED'
  propertyId: string
  propertyTitle: string
  propertyCategory: string
  transactionType: string
  location?: {
    city?: string
    area?: string
    state?: string
  }
  createdAt: string
  read?: boolean // Read status for authenticated users
}

interface UsePublicNotificationsOptions {
  useSampleData?: boolean
  type?: string
  limit?: number
}

export const usePublicNotifications = (options: UsePublicNotificationsOptions = {}) => {
  const { useSampleData = false, type, limit = 50 } = options
  const [notifications, setNotifications] = useState<PublicNotification[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetchNotifications()
  }, [useSampleData, type, limit])

  const fetchNotifications = async () => {
    setLoading(true)
    setError(null)

    try {
      if (useSampleData) {
        // Sample data for development
        await new Promise((resolve) => setTimeout(resolve, 300))
        setNotifications([])
        setUnreadCount(0)
      } else {
        // Fetch from API
        const params = new URLSearchParams()
        if (type) params.append('type', type)
        if (limit) params.append('limit', limit.toString())
        
        const response = await api.get(`/public-notifications?${params.toString()}`)
        setNotifications(response.data.notifications || [])
        setUnreadCount(response.data.unreadCount || 0)
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch public notifications')
      setNotifications([])
      setUnreadCount(0)
    } finally {
      setLoading(false)
    }
  }

  // Optimistically mark a public notification as read
  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif._id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  // Optimistically mark all public notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    )
    setUnreadCount(0)
  }

  return { 
    notifications, 
    loading, 
    error, 
    unreadCount,
    refetch: fetchNotifications,
    markAsRead,
    markAllAsRead,
  }
}



