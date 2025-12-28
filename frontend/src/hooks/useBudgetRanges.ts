import { useState, useEffect } from 'react'
import api from '../services/api'

export interface BudgetRange {
  label: string
  min?: number
  max?: number
  currencyCode?: string
}

// Fallback sample budget ranges (for INR)
const sampleBudgetRanges: BudgetRange[] = [
  { label: 'Under ₹50L', max: 5000000, currencyCode: 'INR' },
  { label: '₹50L - ₹1Cr', min: 5000000, max: 10000000, currencyCode: 'INR' },
  { label: '₹1Cr - ₹2Cr', min: 10000000, max: 20000000, currencyCode: 'INR' },
  { label: '₹2Cr - ₹5Cr', min: 20000000, max: 50000000, currencyCode: 'INR' },
  { label: '₹5Cr - ₹10Cr', min: 50000000, max: 100000000, currencyCode: 'INR' },
  { label: 'Above ₹10Cr', min: 100000000, currencyCode: 'INR' },
]

interface UseBudgetRangesOptions {
  useSampleData?: boolean
  currencyCode?: string
}

export const useBudgetRanges = (options: UseBudgetRangesOptions = {}) => {
  const { useSampleData = true, currencyCode = 'INR' } = options
  const [budgetRanges, setBudgetRanges] = useState<BudgetRange[]>(sampleBudgetRanges)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBudgetRanges()
  }, [useSampleData, currencyCode])

  const fetchBudgetRanges = async () => {
    setLoading(true)
    setError(null)

    try {
      if (useSampleData) {
        // Use sample data
        await new Promise((resolve) => setTimeout(resolve, 300))
        setBudgetRanges(sampleBudgetRanges)
      } else {
        // Fetch from API
        const params = new URLSearchParams()
        if (currencyCode) params.append('currencyCode', currencyCode)
        const response = await api.get(`/config/budget-ranges?${params.toString()}`)
        setBudgetRanges(response.data.budgetRanges || sampleBudgetRanges)
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch budget ranges')
      // Fallback to sample data on error
      setBudgetRanges(sampleBudgetRanges)
    } finally {
      setLoading(false)
    }
  }

  return { budgetRanges, loading, error, refetch: fetchBudgetRanges }
}


