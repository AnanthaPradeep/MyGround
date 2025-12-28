import { useState, useEffect, useCallback } from 'react'
import { useAuthStore } from '../store/authStore'
import api from '../services/api'
import { Property } from '../types/property'

interface WishlistItem {
  id: string
  property: Property
  createdAt: string
}

interface UseWishlistOptions {
  useSampleData?: boolean
  userId?: string
}

export function useWishlist(options: UseWishlistOptions = {}) {
  const { useSampleData = false, userId } = options
  const { isAuthenticated } = useAuthStore()
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated || !userId || useSampleData) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/wishlist')
      setWishlist(response.data.wishlist || [])
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch wishlist')
      setWishlist([])
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, userId, useSampleData])

  useEffect(() => {
    fetchWishlist()
  }, [fetchWishlist])

  const addToWishlist = useCallback(async (propertyId: string) => {
    try {
      await api.post('/wishlist', { propertyId })
      await fetchWishlist()
      return true
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Failed to add to wishlist')
    }
  }, [fetchWishlist])

  const removeFromWishlist = useCallback(async (propertyId: string) => {
    try {
      await api.delete(`/wishlist/${propertyId}`)
      await fetchWishlist()
      return true
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Failed to remove from wishlist')
    }
  }, [fetchWishlist])

  const checkInWishlist = useCallback(async (propertyId: string): Promise<boolean> => {
    try {
      const response = await api.get(`/wishlist/check/${propertyId}`)
      return response.data.isInWishlist
    } catch (err: any) {
      return false
    }
  }, [])

  const getWishlistCount = useCallback(async (): Promise<number> => {
    try {
      const response = await api.get('/wishlist/count')
      return response.data.count || 0
    } catch (err: any) {
      return 0
    }
  }, [])

  return {
    wishlist,
    loading,
    error,
    refetch: fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    checkInWishlist,
    getWishlistCount,
  }
}

