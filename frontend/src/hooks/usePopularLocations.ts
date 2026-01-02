import { useState, useEffect } from 'react'
import api from '../services/api'
import { LocationSuggestion } from '../components/LocationAutocomplete'
import popularLocationsData from '../data/popularLocations.json'

interface UsePopularLocationsOptions {
  useSampleData?: boolean
}

export const usePopularLocations = (options: UsePopularLocationsOptions = {}) => {
  const { useSampleData = true } = options
  const [popularLocations, setPopularLocations] = useState<LocationSuggestion[]>(popularLocationsData as LocationSuggestion[])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPopularLocations()
  }, [useSampleData])

  const fetchPopularLocations = async () => {
    setLoading(true)
    setError(null)

    try {
      if (useSampleData) {
        // Use sample data from JSON
        await new Promise((resolve) => setTimeout(resolve, 300))
        setPopularLocations(popularLocationsData as LocationSuggestion[])
      } else {
        // Fetch from API
        const response = await api.get('/config/popular-locations')
        setPopularLocations(response.data.locations || popularLocationsData)
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch popular locations')
      // Fallback to sample data on error
      setPopularLocations(popularLocationsData as LocationSuggestion[])
    } finally {
      setLoading(false)
    }
  }

  return { popularLocations, loading, error, refetch: fetchPopularLocations }
}




