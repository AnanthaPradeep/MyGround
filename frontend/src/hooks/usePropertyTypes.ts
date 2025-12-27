import { useState, useEffect } from 'react'
import api from '../services/api'
import { PropertyCategory } from '../types/property'

export interface PropertyTypeOption {
  value: PropertyCategory
  label: string
  description?: string
  icon?: string
}

// Fallback sample property types
const samplePropertyTypes: PropertyTypeOption[] = [
  { value: 'RESIDENTIAL', label: 'Residential', description: 'Homes, apartments, villas' },
  { value: 'COMMERCIAL', label: 'Commercial', description: 'Offices, shops, retail spaces' },
  { value: 'INDUSTRIAL', label: 'Industrial', description: 'Warehouses, factories, plants' },
  { value: 'LAND', label: 'Land', description: 'Plots, agricultural land' },
  { value: 'AGRICULTURAL', label: 'Agricultural', description: 'Farming land, plantations' },
  { value: 'SPECIAL', label: 'Special Assets', description: 'Islands, resorts, heritage' },
  { value: 'ISLAND', label: 'Island', description: 'Private islands' },
]

interface UsePropertyTypesOptions {
  useSampleData?: boolean
}

export const usePropertyTypes = (options: UsePropertyTypesOptions = {}) => {
  const { useSampleData = true } = options
  const [propertyTypes, setPropertyTypes] = useState<PropertyTypeOption[]>(samplePropertyTypes)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPropertyTypes()
  }, [useSampleData])

  const fetchPropertyTypes = async () => {
    setLoading(true)
    setError(null)

    try {
      if (useSampleData) {
        // Use sample data
        await new Promise((resolve) => setTimeout(resolve, 300))
        setPropertyTypes(samplePropertyTypes)
      } else {
        // Fetch from API
        const response = await api.get('/config/property-types')
        setPropertyTypes(response.data.propertyTypes || samplePropertyTypes)
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch property types')
      // Fallback to sample data on error
      setPropertyTypes(samplePropertyTypes)
    } finally {
      setLoading(false)
    }
  }

  return { propertyTypes, loading, error, refetch: fetchPropertyTypes }
}

