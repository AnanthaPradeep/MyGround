import { useState, useEffect, useCallback } from 'react'
import api from '../services/api'
import { useAuthStore } from '../store/authStore'
import { useLocationStore, UserLocation } from '../store/locationStore'

interface UseUserLocationOptions {
  autoSync?: boolean // Automatically sync with backend
}

/**
 * Hook for managing user location with backend persistence
 */
export const useUserLocation = (options: UseUserLocationOptions = {}) => {
  const { autoSync = true } = options
  const { user, isAuthenticated } = useAuthStore()
  const { userLocation, setLocation: setLocationStore } = useLocationStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch user location from backend
  const fetchUserLocation = useCallback(async () => {
    if (!isAuthenticated || !user?.id) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await api.get('/user/location')
      if (response.data.success && response.data.location) {
        const location: UserLocation = {
          city: response.data.location.city || '',
          state: response.data.location.state || '',
          country: response.data.location.country || 'India',
          area: response.data.location.area,
          locality: response.data.location.locality,
          pincode: response.data.location.pincode,
          coordinates: response.data.location.coordinates?.coordinates
            ? {
                lat: response.data.location.coordinates.coordinates[1],
                lng: response.data.location.coordinates.coordinates[0],
              }
            : undefined,
          displayName: response.data.location.displayName || '',
        }
        setLocationStore(location)
        return location
      }
    } catch (err: any) {
      // Don't set error if location just doesn't exist
      if (err.response?.status !== 404) {
        setError(err.response?.data?.error || 'Failed to fetch user location')
      }
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, user?.id, setLocationStore])

  // Save user location to backend
  const saveUserLocation = useCallback(async (
    location: UserLocation,
    source: 'GPS' | 'MANUAL' | 'SEARCH' = 'MANUAL'
  ): Promise<boolean> => {
    if (!isAuthenticated || !user?.id) {
      setError('User must be authenticated to save location')
      return false
    }

    if (!location.coordinates) {
      setError('Coordinates are required to save location')
      return false
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await api.post('/user/location', {
        coordinates: [location.coordinates.lng, location.coordinates.lat], // [longitude, latitude]
        city: location.city,
        state: location.state,
        country: location.country || 'India',
        area: location.area,
        locality: location.locality,
        pincode: location.pincode,
        displayName: location.displayName || `${location.city}, ${location.state}`,
        source: source,
      })

      if (response.data.success) {
        // Update local store
        setLocationStore(location)
        return true
      }
      return false
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save user location')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, user?.id, setLocationStore])

  // Clear user location
  const clearUserLocation = useCallback(async (): Promise<boolean> => {
    if (!isAuthenticated || !user?.id) return false

    setIsLoading(true)
    setError(null)

    try {
      await api.delete('/user/location')
      // Clear local store
      setLocationStore({
        city: '',
        state: '',
        country: 'India',
        displayName: '',
      })
      return true
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to clear user location')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, user?.id, setLocationStore])

  // Auto-sync on mount if enabled
  useEffect(() => {
    if (autoSync && isAuthenticated && user?.id) {
      fetchUserLocation()
    }
  }, [autoSync, isAuthenticated, user?.id, fetchUserLocation])

  return {
    userLocation,
    isLoading,
    error,
    fetchUserLocation,
    saveUserLocation,
    clearUserLocation,
  }
}



