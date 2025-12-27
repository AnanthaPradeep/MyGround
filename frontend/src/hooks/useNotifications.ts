import { useState, useEffect } from 'react'
import api from '../services/api'
import { Notification } from '../types/notification'
import sampleNotificationsData from '../data/sampleNotifications.json'

interface UseNotificationsOptions {
  useSampleData?: boolean
  userId?: string
}

export const useNotifications = (options: UseNotificationsOptions = {}) => {
  const { useSampleData = true, userId } = options
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNotifications()
  }, [useSampleData, userId])

  const fetchNotifications = async () => {
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
        // Fetch from API
        const params = new URLSearchParams()
        if (userId) params.append('userId', userId)
        const response = await api.get(`/notifications?${params.toString()}`)
        const apiData = (response.data.notifications || []).map((notif: any) => ({
          ...notif,
          timestamp: new Date(notif.createdAt || notif.timestamp),
        })) as Notification[]
        setNotifications(apiData)
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch notifications')
      // Fallback to sample data on error
      const sampleData = sampleNotificationsData.map((notif: any) => ({
        ...notif,
        timestamp: new Date(notif.timestamp),
      })) as Notification[]
      setNotifications(sampleData)
    } finally {
      setLoading(false)
    }
  }

  return { notifications, loading, error, refetch: fetchNotifications, setNotifications }
}

