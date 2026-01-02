import { useState, useEffect } from 'react'
import api from '../services/api'
import { Currency } from '../store/currencyStore'

interface UseCurrenciesOptions {
  useSampleData?: boolean
}

// Fallback sample currencies
const sampleCurrencies: Currency[] = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', exchangeRate: 1 },
  { code: 'USD', symbol: '$', name: 'US Dollar', exchangeRate: 0.012 },
  { code: 'EUR', symbol: '€', name: 'Euro', exchangeRate: 0.011 },
  { code: 'GBP', symbol: '£', name: 'British Pound', exchangeRate: 0.0095 },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', exchangeRate: 0.044 },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', exchangeRate: 0.016 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', exchangeRate: 0.018 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', exchangeRate: 0.016 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', exchangeRate: 1.8 },
]

export const useCurrencies = (options: UseCurrenciesOptions = {}) => {
  const { useSampleData = true } = options
  const [currencies, setCurrencies] = useState<Currency[]>(sampleCurrencies)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCurrencies()
  }, [useSampleData])

  const fetchCurrencies = async () => {
    setLoading(true)
    setError(null)

    try {
      if (useSampleData) {
        // Use sample data
        await new Promise((resolve) => setTimeout(resolve, 300))
        setCurrencies(sampleCurrencies)
      } else {
        // Fetch from API
        const response = await api.get('/config/currencies')
        setCurrencies(response.data.currencies || sampleCurrencies)
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch currencies')
      // Fallback to sample data on error
      setCurrencies(sampleCurrencies)
    } finally {
      setLoading(false)
    }
  }

  return { currencies, loading, error, refetch: fetchCurrencies }
}




