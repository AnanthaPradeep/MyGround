import { useState, useEffect } from 'react'
import api from '../services/api'
import { Property } from '../types/property'
import sampleProperties from '../data/sampleProperties.json'

interface UsePropertiesOptions {
  useSampleData?: boolean
  filters?: Record<string, any>
}

export const useProperties = (options: UsePropertiesOptions = {}) => {
  const { useSampleData = true, filters = {} } = options
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProperties()
  }, [useSampleData, JSON.stringify(filters)])

  const fetchProperties = async () => {
    setLoading(true)
    setError(null)

    try {
      if (useSampleData) {
        // Use sample data from JSON file
        await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay
        setProperties(sampleProperties as Property[])
      } else {
        // Fetch from API
        const params = new URLSearchParams()
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, String(value))
        })

        const response = await api.get(`/properties?${params.toString()}`)
        setProperties(response.data.properties || [])
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch properties')
      // Fallback to sample data on error
      if (useSampleData) {
        setProperties(sampleProperties as Property[])
      }
    } finally {
      setLoading(false)
    }
  }

  return { properties, loading, error, refetch: fetchProperties }
}

export const useProperty = (id: string, useSampleData: boolean = true) => {
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProperty()
  }, [id, useSampleData])

  const fetchProperty = async () => {
    setLoading(true)
    setError(null)

    try {
      if (useSampleData) {
        // Use sample data
        await new Promise((resolve) => setTimeout(resolve, 300))
        const found = sampleProperties.find((p) => p._id === id)
        if (found) {
          setProperty(found as Property)
        } else {
          setError('Property not found')
        }
      } else {
        const response = await api.get(`/properties/${id}`)
        setProperty(response.data.property)
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch property')
    } finally {
      setLoading(false)
    }
  }

  return { property, loading, error, refetch: fetchProperty }
}




