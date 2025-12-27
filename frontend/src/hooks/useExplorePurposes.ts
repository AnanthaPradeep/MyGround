import { useState, useEffect } from 'react'
import api from '../services/api'
import explorePurposesData from '../data/explorePurposes.json'

export interface ExplorePurpose {
  icon: string
  title: string
  description: string
  link: string
  color: string
}

interface UseExplorePurposesOptions {
  useSampleData?: boolean
}

export const useExplorePurposes = (options: UseExplorePurposesOptions = {}) => {
  const { useSampleData = true } = options
  const [purposes, setPurposes] = useState<ExplorePurpose[]>(explorePurposesData as ExplorePurpose[])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchExplorePurposes()
  }, [useSampleData])

  const fetchExplorePurposes = async () => {
    setLoading(true)
    setError(null)

    try {
      if (useSampleData) {
        // Use sample data from JSON
        await new Promise((resolve) => setTimeout(resolve, 300))
        setPurposes(explorePurposesData as ExplorePurpose[])
      } else {
        // Fetch from API
        const response = await api.get('/config/explore-purposes')
        setPurposes(response.data.purposes || explorePurposesData)
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch explore purposes')
      // Fallback to sample data on error
      setPurposes(explorePurposesData as ExplorePurpose[])
    } finally {
      setLoading(false)
    }
  }

  return { purposes, loading, error, refetch: fetchExplorePurposes }
}

