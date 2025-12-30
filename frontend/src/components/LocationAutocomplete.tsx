import { useState, useRef, useEffect, useCallback } from 'react'
import { MapPinIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { usePopularLocations } from '../hooks/usePopularLocations'

export interface LocationSuggestion {
  id: string
  displayName: string
  city: string
  state: string
  country: string
  coordinates?: {
    lat: number
    lng: number
  }
  pincode?: string
  area?: string
  locality?: string
}

interface LocationAutocompleteProps {
  value?: string
  onChange: (location: LocationSuggestion | null) => void
  placeholder?: string
  className?: string
  required?: boolean
  error?: string
  onCoordinatesChange?: (lat: number, lng: number) => void
}

// Nominatim API for geocoding (OpenStreetMap)
const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org'

// Debounce function
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Location Autocomplete Component using OpenStreetMap Nominatim API
 * Provides location search with autocomplete suggestions
 */
export default function LocationAutocomplete({
  value = '',
  onChange,
  placeholder = 'Search location...',
  className = '',
  required = false,
  error,
  onCoordinatesChange
}: LocationAutocompleteProps) {
  const [query, setQuery] = useState(value)
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<LocationSuggestion | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Sync query state with value prop changes (when value is updated externally)
  useEffect(() => {
    if (value !== undefined && value !== query) {
      setQuery(value)
    }
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch popular locations from API/JSON
  const { popularLocations } = usePopularLocations({ useSampleData: true })

  // Search using Nominatim API
  const searchLocations = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([])
      setIsOpen(false)
      return
    }

    setIsSearching(true)

    try {
      // Search using Nominatim API (OpenStreetMap)
      const response = await fetch(
        `${NOMINATIM_BASE_URL}/search?` +
        `q=${encodeURIComponent(searchQuery)}` +
        `&format=json` +
        `&addressdetails=1` +
        `&limit=5` +
        `&countrycodes=in` + // Restrict to India
        `&bounded=1` +
        `&viewbox=68.1,6.5,97.4,35.5` + // India bounding box
        `&email=contact@myground.in`, // Required by Nominatim usage policy
        {
          headers: {
            'User-Agent': 'MyGround Real Estate Platform',
          },
        }
      )

      if (!response.ok) {
        throw new Error('Geocoding service unavailable')
      }

      const data = await response.json()

      if (Array.isArray(data) && data.length > 0) {
        const formattedSuggestions: LocationSuggestion[] = data.map((item, index) => {
          const address = item.address || {}
          
          return {
            id: item.place_id?.toString() || `place-${index}`,
            displayName: item.display_name || searchQuery,
            city: address.city || address.town || address.village || address.county || '',
            state: address.state || '',
            country: address.country || 'India',
            coordinates: {
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
            },
            pincode: address.postcode || '',
            area: address.suburb || address.neighbourhood || address.locality || '',
            locality: address.locality || address.suburb || '',
          }
        })
        setSuggestions(formattedSuggestions)
        setIsOpen(true)
      } else {
        // Fallback to popular locations if no results
        const filtered = popularLocations.filter(loc =>
          loc.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          loc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          loc.state.toLowerCase().includes(searchQuery.toLowerCase())
        )
        setSuggestions(filtered.slice(0, 5))
        setIsOpen(true)
      }
    } catch (error) {
      console.error('Geocoding error:', error)
      // Fallback to popular locations on error
      const filtered = popularLocations.filter(loc =>
        loc.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.state.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setSuggestions(filtered.slice(0, 5))
      setIsOpen(true)
    } finally {
      setIsSearching(false)
    }
  }, [popularLocations])

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      searchLocations(searchQuery)
    }, 300),
    [searchLocations]
  )

  // Search when query changes
  useEffect(() => {
    if (query.trim().length >= 2) {
      debouncedSearch(query)
    } else if (query.trim().length === 0) {
      setSuggestions([])
      setIsOpen(false)
    } else if (query.trim().length === 1) {
      // Show popular locations for single character
      const filtered = popularLocations.filter(loc =>
        loc.displayName.toLowerCase().startsWith(query.toLowerCase()) ||
        loc.city.toLowerCase().startsWith(query.toLowerCase())
      )
      setSuggestions(filtered.slice(0, 5))
      setIsOpen(true)
    }
  }, [query, debouncedSearch, popularLocations])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Reverse geocoding to get address details from coordinates
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `${NOMINATIM_BASE_URL}/reverse?` +
        `lat=${lat}&lon=${lng}` +
        `&format=json` +
        `&addressdetails=1` +
        `&email=contact@myground.in`,
        {
          headers: {
            'User-Agent': 'MyGround Real Estate Platform',
          },
        }
      )

      if (!response.ok) {
        throw new Error('Reverse geocoding failed')
      }

      const data = await response.json()
      const address = data.address || {}

      return {
        city: address.city || address.town || address.village || address.county || '',
        state: address.state || '',
        country: address.country || 'India',
        pincode: address.postcode || '',
        area: address.suburb || address.neighbourhood || address.locality || '',
        locality: address.locality || address.suburb || '',
        displayName: data.display_name || '',
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error)
      return null
    }
  }, [])

  const handleSelect = useCallback(async (location: LocationSuggestion) => {
    setQuery(location.displayName)
    setSelectedLocation(location)
    setIsOpen(false)
    onChange(location)

    if (location.coordinates && onCoordinatesChange) {
      onCoordinatesChange(location.coordinates.lat, location.coordinates.lng)
    } else if (location.coordinates) {
      // If coordinates are missing, try to get them from reverse geocoding
      // This shouldn't happen with Nominatim, but just in case
      const addressDetails = await reverseGeocode(
        location.coordinates.lat,
        location.coordinates.lng
      )
      if (addressDetails) {
        const updatedLocation: LocationSuggestion = {
          ...location,
          ...addressDetails,
        }
        onChange(updatedLocation)
      }
    }
  }, [onChange, onCoordinatesChange, reverseGeocode])

  const handleClear = () => {
    setQuery('')
    setSelectedLocation(null)
    onChange(null)
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    if (!e.target.value) {
      setSelectedLocation(null)
      onChange(null)
    }
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <MapPinIcon className="absolute left-3 sm:left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-500" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          required={required}
          className={`w-full pl-9 sm:pl-11 pr-9 sm:pr-11 py-2.5 text-sm sm:text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 border ${
            error ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
          } rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400`}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true)
          }}
        />
        {isSearching && (
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
          </div>
        )}
        {selectedLocation && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Clear location"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg dark:shadow-gray-900/50 max-h-[200px] sm:max-h-60 overflow-y-auto scrollbar-hide">
          {suggestions.map((location) => (
            <button
              key={location.id}
              type="button"
              onClick={() => handleSelect(location)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 text-sm sm:text-base"
            >
              <div className="flex items-start gap-3">
                <MapPinIcon className="h-5 w-5 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-gray-100">{location.displayName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {location.city && location.state 
                      ? `${location.city}, ${location.state}, ${location.country}`
                      : location.state 
                      ? `${location.state}, ${location.country}`
                      : location.country}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && query.trim().length > 0 && suggestions.length === 0 && !isSearching && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg dark:shadow-gray-900/50 p-4 text-center text-gray-500 dark:text-gray-400">
          <p className="text-sm">No locations found. Try a different search term.</p>
        </div>
      )}
    </div>
  )
}
