/**
 * React Query hooks for Configuration Data
 * Professional caching for rarely-changing configuration data
 */

import { useQuery } from '@tanstack/react-query'
import api from '../services/api'
import { PropertyTypeOption } from './usePropertyTypes'
import { FilterOptions } from './useFilterOptions'

/**
 * Query key factory for config
 */
export const configKeys = {
  all: ['config'] as const,
  propertyTypes: () => [...configKeys.all, 'property-types'] as const,
  filterOptions: () => [...configKeys.all, 'filter-options'] as const,
}

// Fallback data
const fallbackPropertyTypes: PropertyTypeOption[] = [
  { value: 'RESIDENTIAL', label: 'Residential', description: 'Homes, apartments, villas' },
  { value: 'COMMERCIAL', label: 'Commercial', description: 'Offices, shops, retail spaces' },
  { value: 'INDUSTRIAL', label: 'Industrial', description: 'Warehouses, factories, plants' },
  { value: 'LAND', label: 'Land', description: 'Plots, agricultural land' },
  { value: 'SPECIAL', label: 'Special Assets', description: 'Islands, resorts, heritage' },
  { value: 'ISLAND', label: 'Island', description: 'Private islands' },
]

/**
 * Fetch property types with React Query
 * Cache strategy: 30 minutes stale time (rarely changes)
 */
export const usePropertyTypesQuery = (useSampleData: boolean = false, enabled: boolean = true) => {
  return useQuery({
    queryKey: configKeys.propertyTypes(),
    queryFn: async (): Promise<PropertyTypeOption[]> => {
      if (useSampleData) {
        await new Promise((resolve) => setTimeout(resolve, 300))
        return fallbackPropertyTypes
      }

      const response = await api.get('/config/property-types')
      return response.data.propertyTypes || fallbackPropertyTypes
    },
    staleTime: 30 * 60 * 1000, // 30 minutes - property types rarely change
    gcTime: 60 * 60 * 1000, // 1 hour (garbage collection time)
    enabled,
    retry: 1,
    placeholderData: fallbackPropertyTypes, // Show fallback immediately
  })
}

/**
 * Fetch filter options with React Query
 * Cache strategy: 30 minutes stale time (rarely changes)
 */
export const useFilterOptionsQuery = (useSampleData: boolean = false, enabled: boolean = true) => {
  return useQuery({
    queryKey: configKeys.filterOptions(),
    queryFn: async (): Promise<FilterOptions> => {
      if (useSampleData) {
        await new Promise((resolve) => setTimeout(resolve, 300))
        // Return minimal fallback
        return {
          transactionTypes: [],
          propertyCategories: [],
          propertySubTypes: {},
          ownershipTypes: [],
          possessionStatuses: [],
          furnishingTypes: [],
          parkingTypes: [],
          areaUnits: [],
          bhkOptions: [],
        }
      }

      const response = await api.get('/config/filter-options')
      return response.data.filterOptions || {
        transactionTypes: [],
        propertyCategories: [],
        propertySubTypes: {},
        ownershipTypes: [],
        possessionStatuses: [],
        furnishingTypes: [],
        parkingTypes: [],
        areaUnits: [],
        bhkOptions: [],
      }
    },
    staleTime: 30 * 60 * 1000, // 30 minutes - filter options rarely change
    gcTime: 60 * 60 * 1000, // 1 hour (garbage collection time)
    enabled,
    retry: 1,
  })
}

