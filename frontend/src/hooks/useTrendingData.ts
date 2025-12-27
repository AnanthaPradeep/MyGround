import { useState, useEffect } from 'react'
import api from '../services/api'
import trendingData from '../data/trendingData.json'

export interface TrendingTab {
  id: string
  label: string
  count: number
}

export interface TrendingDataItem {
  id: string
  name: string
  value: string
  change: number
  changeType: 'up' | 'down'
  badge?: string
  badgeText?: string
  badgeIcon?: string
}

interface TrendingDataResponse {
  tabs: TrendingTab[]
  trendingLocalities: TrendingDataItem[]
  priceDrops: TrendingDataItem[]
  newlyVerified: TrendingDataItem[]
  highYield: TrendingDataItem[]
  descriptions: Record<string, string>
}

interface UseTrendingDataOptions {
  useSampleData?: boolean
}

export const useTrendingData = (options: UseTrendingDataOptions = {}) => {
  const { useSampleData = true } = options
  const [data, setData] = useState<TrendingDataResponse>(trendingData as TrendingDataResponse)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTrendingData()
  }, [useSampleData])

  const fetchTrendingData = async () => {
    setLoading(true)
    setError(null)

    try {
      if (useSampleData) {
        // Use sample data from JSON
        await new Promise((resolve) => setTimeout(resolve, 300))
        setData(trendingData as TrendingDataResponse)
      } else {
        // Fetch from API
        const response = await api.get('/config/trending-data')
        setData(response.data || trendingData)
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch trending data')
      // Fallback to sample data on error
      setData(trendingData as TrendingDataResponse)
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, refetch: fetchTrendingData }
}

