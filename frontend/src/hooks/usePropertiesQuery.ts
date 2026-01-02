/**
 * React Query hooks for Properties
 * Professional caching and state management
 */

import { useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'
import { Property } from '../types/property'
import sampleProperties from '../data/sampleProperties.json'

interface UsePropertiesQueryOptions {
  useSampleData?: boolean
  filters?: Record<string, any>
  enabled?: boolean
}

/**
 * Query key factory for properties
 */
export const propertyKeys = {
  all: ['properties'] as const,
  lists: () => [...propertyKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...propertyKeys.lists(), filters] as const,
  details: () => [...propertyKeys.all, 'detail'] as const,
  detail: (id: string) => [...propertyKeys.details(), id] as const,
}

/**
 * Fetch properties with React Query caching
 * Cache strategy: 2 minutes stale time, 5 minutes cache time
 */
export const usePropertiesQuery = (options: UsePropertiesQueryOptions = {}) => {
  const { useSampleData = false, filters = {}, enabled = true } = options

  return useQuery({
    queryKey: propertyKeys.list(filters),
    queryFn: async (): Promise<Property[]> => {
      if (useSampleData) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))
        return sampleProperties as Property[]
      }

      // Fetch from API
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value))
      })

      const response = await api.get(`/properties?${params.toString()}`)
      return response.data.properties || []
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - properties change frequently
    gcTime: 5 * 60 * 1000, // 5 minutes (garbage collection time)
    enabled,
    retry: 1,
  })
}

/**
 * Fetch single property with React Query caching
 * Cache strategy: 5 minutes stale time, 10 minutes cache time
 */
export const usePropertyQuery = (id: string, useSampleData: boolean = false, enabled: boolean = true) => {
  return useQuery({
    queryKey: propertyKeys.detail(id),
    queryFn: async (): Promise<Property> => {
      if (useSampleData) {
        await new Promise((resolve) => setTimeout(resolve, 300))
        const found = sampleProperties.find((p) => p._id === id)
        if (!found) {
          throw new Error('Property not found')
        }
        return found as Property
      }

      const response = await api.get(`/properties/${id}`)
      if (!response.data.property) {
        throw new Error('Property not found')
      }
      return response.data.property
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - individual properties change less frequently
    gcTime: 10 * 60 * 1000, // 10 minutes (garbage collection time)
    enabled: enabled && !!id,
    retry: 1,
  })
}

/**
 * Invalidate properties cache (useful after mutations)
 */
export const useInvalidateProperties = () => {
  const queryClient = useQueryClient()

  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: propertyKeys.all }),
    invalidateList: (filters?: Record<string, any>) => 
      queryClient.invalidateQueries({ queryKey: propertyKeys.list(filters) }),
    invalidateDetail: (id: string) => 
      queryClient.invalidateQueries({ queryKey: propertyKeys.detail(id) }),
  }
}

