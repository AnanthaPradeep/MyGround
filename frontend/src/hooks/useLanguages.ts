import { useState, useEffect, useCallback } from 'react'
import api from '../services/api'
import { LanguagesResponse } from '../types/language'

interface UseLanguagesOptions {
  useSampleData?: boolean
}

// Fallback languages data
const fallbackLanguages: LanguagesResponse = {
  languages: [
    {
      languageCode: 'en',
      languageNameEnglish: 'English',
      languageNameNative: 'English',
      country: 'IN',
      direction: 'ltr',
      isDefault: true,
      order: 1,
    },
  ],
  languagesByCountry: {
    IN: [
      {
        languageCode: 'en',
        languageNameEnglish: 'English',
        languageNameNative: 'English',
        country: 'IN',
        direction: 'ltr',
        isDefault: true,
        order: 1,
      },
    ],
  },
  defaultLanguage: {
    languageCode: 'en',
    languageNameEnglish: 'English',
    languageNameNative: 'English',
    country: 'IN',
    direction: 'ltr',
    isDefault: true,
  },
}

export const useLanguages = (options: UseLanguagesOptions = {}) => {
  const { useSampleData = false } = options
  const [languages, setLanguages] = useState<LanguagesResponse>(fallbackLanguages)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLanguages = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      if (useSampleData) {
        // Use fallback data
        await new Promise((resolve) => setTimeout(resolve, 100))
        setLanguages(fallbackLanguages)
      } else {
        // Fetch from API
        const response = await api.get('/languages')
        if (response.data.success && response.data.data) {
          setLanguages(response.data.data)
        } else {
          console.warn('Invalid response from API, using fallback data')
          setLanguages(fallbackLanguages)
        }
      }
    } catch (err: any) {
      console.error('Failed to fetch languages from API:', err.message)
      console.warn('Using fallback data. Check if backend is running and languages are seeded.')
      setError(err.response?.data?.error || 'Failed to fetch languages')
      // Fallback to default data on error
      setLanguages(fallbackLanguages)
    } finally {
      setLoading(false)
    }
  }, [useSampleData])

  useEffect(() => {
    fetchLanguages()
  }, [fetchLanguages])

  return {
    languages,
    loading,
    error,
    refetch: fetchLanguages,
  }
}

