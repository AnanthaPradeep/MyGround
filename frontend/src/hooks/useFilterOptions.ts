import { useState, useEffect } from 'react'
import api from '../services/api'

export interface TransactionTypeOption {
  value: string
  label: string
}

export interface PropertyCategoryOption {
  value: string
  label: string
}

export interface OwnershipTypeOption {
  value: string
  label: string
}

export interface PossessionStatusOption {
  value: string
  label: string
}

export interface FurnishingTypeOption {
  value: string
  label: string
}

export interface ParkingTypeOption {
  value: string
  label: string
}

export interface AreaUnitOption {
  value: string
  label: string
}

export interface FilterOptions {
  transactionTypes: TransactionTypeOption[]
  propertyCategories: PropertyCategoryOption[]
  propertySubTypes: Record<string, string[]>
  ownershipTypes: OwnershipTypeOption[]
  possessionStatuses: PossessionStatusOption[]
  furnishingTypes: FurnishingTypeOption[]
  parkingTypes: ParkingTypeOption[]
  areaUnits: AreaUnitOption[]
  bhkOptions: number[]
}

// Fallback data (matching backend structure)
const fallbackFilterOptions: FilterOptions = {
  transactionTypes: [
    { value: 'SELL', label: 'Sell' },
    { value: 'RENT', label: 'Rent' },
    { value: 'LEASE', label: 'Lease' },
    { value: 'SUB_LEASE', label: 'Sub Lease' },
    { value: 'FRACTIONAL', label: 'Fractional Ownership' },
  ],
  propertyCategories: [
    { value: 'RESIDENTIAL', label: 'Residential' },
    { value: 'COMMERCIAL', label: 'Commercial' },
    { value: 'INDUSTRIAL', label: 'Industrial' },
    { value: 'LAND', label: 'Land' },
    { value: 'SPECIAL', label: 'Special Assets' },
    { value: 'ISLAND', label: 'Island' },
  ],
  propertySubTypes: {
    RESIDENTIAL: [
      'Apartment / Flat',
      'Builder Floor',
      'Independent House',
      'Villa',
      'Studio Apartment',
      'Penthouse',
      'Duplex / Triplex',
      'Serviced Apartment',
      'Co-Living Property',
      'PG / Shared Accommodation',
    ],
    COMMERCIAL: [
      'Office Space (IT / Non-IT)',
      'Co-Working Space',
      'Business Center',
      'Retail Shop',
      'Showroom',
      'Mall Unit',
      'Hotel / Hospitality Property',
      'Restaurant / Café Space',
      'Medical / Clinic Space',
    ],
    INDUSTRIAL: [
      'Warehouse',
      'Factory',
      'Manufacturing Unit',
      'Industrial Shed',
      'Logistics Park',
      'Cold Storage',
      'Data Center',
      'Power / Utility Facility',
    ],
    LAND: [
      'Residential Plot',
      'Commercial Plot',
      'Industrial Plot',
      'Agricultural Land',
      'Farm Land',
      'SEZ Land',
      'Institutional Land',
      'Mixed-Use Land',
    ],
    SPECIAL: [
      'Resort',
      'Heritage Property',
      'Hospital Property',
      'School / College Property',
      'Stadium / Arena',
      'Convention Center',
      'Airport Property',
      'Port / Marine Property',
      'Renewable Energy Asset',
    ],
    ISLAND: [
      'Private Island',
      'Resort Island',
      'Agricultural Island',
      'Conservation Island',
      'Tourism Island',
      'Institutional / Government Island',
    ],
  },
  ownershipTypes: [
    { value: 'FREEHOLD', label: 'Freehold' },
    { value: 'LEASEHOLD', label: 'Leasehold' },
    { value: 'GOVERNMENT', label: 'Government' },
    { value: 'TRUST', label: 'Trust' },
  ],
  possessionStatuses: [
    { value: 'READY', label: 'Ready to Move' },
    { value: 'UNDER_CONSTRUCTION', label: 'Under Construction' },
    { value: 'PRE_LAUNCH', label: 'Pre Launch' },
  ],
  furnishingTypes: [
    { value: 'FULLY_FURNISHED', label: 'Fully Furnished' },
    { value: 'SEMI_FURNISHED', label: 'Semi Furnished' },
    { value: 'UNFURNISHED', label: 'Unfurnished' },
  ],
  parkingTypes: [
    { value: 'OPEN', label: 'Open' },
    { value: 'COVERED', label: 'Covered' },
    { value: 'NONE', label: 'None' },
  ],
  areaUnits: [
    { value: 'SQFT', label: 'Square Feet (sq ft)' },
    { value: 'SQMT', label: 'Square Meters (sq m)' },
    { value: 'ACRE', label: 'Acre' },
    { value: 'HECTARE', label: 'Hectare' },
  ],
  bhkOptions: [1, 2, 3, 4, 5, 6, 7],
}

interface UseFilterOptionsOptions {
  useSampleData?: boolean
}

export const useFilterOptions = (options: UseFilterOptionsOptions = {}) => {
  const { useSampleData = false } = options
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(fallbackFilterOptions)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFilterOptions()
  }, [useSampleData])

  const fetchFilterOptions = async () => {
    setLoading(true)
    setError(null)

    try {
      if (useSampleData) {
        // Use fallback data
        await new Promise((resolve) => setTimeout(resolve, 100))
        setFilterOptions(fallbackFilterOptions)
      } else {
        // Fetch from API
        const response = await api.get('/filters/options')
        if (response.data.success && response.data.data) {
          const data = response.data.data
          // Check if arrays are empty (database not seeded)
          const isEmpty = 
            (!data.transactionTypes || data.transactionTypes.length === 0) &&
            (!data.propertyCategories || data.propertyCategories.length === 0)
          
          if (isEmpty) {
            console.warn('⚠️  Filter options from database are empty. Using fallback data.')
            console.warn('⚠️  To fix: Run "npm run seed-filters" in the backend directory')
            setFilterOptions(fallbackFilterOptions)
          } else {
            console.log('✅ Filter options loaded from database:', {
              transactionTypes: data.transactionTypes?.length || 0,
              propertyCategories: data.propertyCategories?.length || 0,
            })
            setFilterOptions(data)
          }
        } else {
          console.warn('⚠️  Invalid response from API, using fallback data')
          setFilterOptions(fallbackFilterOptions)
        }
      }
    } catch (err: any) {
      console.error('❌ Failed to fetch filter options from API:', err.message)
      console.warn('⚠️  Using fallback data. Check if backend is running and database is seeded.')
      setError(err.response?.data?.error || 'Failed to fetch filter options')
      // Fallback to default data on error
      setFilterOptions(fallbackFilterOptions)
    } finally {
      setLoading(false)
    }
  }

  return {
    filterOptions,
    loading,
    error,
    refetch: fetchFilterOptions,
  }
}

