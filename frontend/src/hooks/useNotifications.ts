import { useState, useEffect, useCallback, useRef } from 'react'
import api from '../services/api'
import { Notification } from '../types/notification'
import sampleNotificationsData from '../data/sampleNotifications.json'
import { useAuthStore } from '../store/authStore'

interface UseNotificationsOptions {
  useSampleData?: boolean
  userId?: string
}

export const useNotifications = (options: UseNotificationsOptions = {}) => {
  const { useSampleData = true, userId } = options
  const { isAuthenticated } = useAuthStore()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fetchingRef = useRef(false) // Prevent concurrent fetches
  const lastFetchRef = useRef(0) // Track last fetch time for throttling

  const fetchNotifications = useCallback(async () => {
    // Don't fetch if not authenticated (unless using sample data)
    if (!useSampleData && !isAuthenticated) {
      setNotifications([])
      setLoading(false)
      return
    }

    // Throttle: Don't fetch if last fetch was less than 2 seconds ago
    const now = Date.now()
    if (now - lastFetchRef.current < 2000) {
      return
    }

    // Prevent concurrent fetches
    if (fetchingRef.current) {
      return
    }

    fetchingRef.current = true
    lastFetchRef.current = now
    setLoading(true)
    setError(null)

    try {
      if (useSampleData) {
        // Use sample data from JSON
        await new Promise((resolve) => setTimeout(resolve, 300))
        const sampleData = sampleNotificationsData.map((notif: any) => ({
          ...notif,
          timestamp: new Date(notif.timestamp),
        })) as Notification[]
        setNotifications(sampleData)
      } else {
        // Fetch from API (only if authenticated)
        if (!isAuthenticated) {
          setNotifications([])
          return
        }

        const params = new URLSearchParams()
        if (userId) params.append('userId', userId)
        const response = await api.get(`/notifications?${params.toString()}`)
        const apiData = (response.data.notifications || []).map((notif: any) => ({
          id: notif._id || notif.id, // Use _id from MongoDB or id if present
          title: notif.title,
          message: notif.message,
          type: notif.type || 'info',
          read: notif.read || false,
          timestamp: new Date(notif.createdAt || notif.timestamp),
          link: notif.link,
        })) as Notification[]
        setNotifications(apiData)
      }
    } catch (err: any) {
      // Only log error if authenticated (401 when not authenticated is expected)
      if (isAuthenticated) {
        console.error('Error fetching notifications:', err)
        setError(err.response?.data?.error || 'Failed to fetch notifications')
      }
      // Don't fallback to sample data on error - keep existing notifications
      // This prevents showing fake data when API fails
      setNotifications([])
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }, [useSampleData, userId, isAuthenticated])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  return { notifications, loading, error, refetch: fetchNotifications, setNotifications }
}

