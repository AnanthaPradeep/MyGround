import { useState, useRef, useEffect } from 'react'
import { useLoadScript } from '@react-google-maps/api'
import { MapPinIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { GOOGLE_MAPS_CONFIG } from '../config/googleMaps'
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

/**
 * Location Autocomplete Component using Google Places API
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
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null)
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null)

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_CONFIG.apiKey,
    libraries: GOOGLE_MAPS_CONFIG.libraries,
  })

  // Initialize Google Places services
  useEffect(() => {
    if (isLoaded && window.google && window.google.maps && window.google.maps.places) {
      try {
        autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService()
        const div = document.createElement('div')
        placesServiceRef.current = new window.google.maps.places.PlacesService(div)
        console.log('✅ Google Places API initialized')
      } catch (err) {
        console.error('❌ Error initializing Places API:', err)
      }
    }
  }, [isLoaded])

  // Fetch popular locations from API/JSON
  const { popularLocations } = usePopularLocations({ useSampleData: true })

  // Search using Google Places API
  useEffect(() => {
    if (query.trim().length > 2 && isLoaded && autocompleteServiceRef.current) {
      const request: google.maps.places.AutocompletionRequest = {
        input: query,
        componentRestrictions: { country: 'in' }, // Restrict to India
        types: ['(cities)', '(regions)'],
      }

      autocompleteServiceRef.current.getPlacePredictions(request, (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          const formattedSuggestions: LocationSuggestion[] = predictions.map((prediction, index) => {
            // Parse address components
            const addressParts = prediction.description.split(', ')
            const city = addressParts[0] || ''
            const state = addressParts[1] || ''
            const country = addressParts[addressParts.length - 1] || 'India'

            return {
              id: prediction.place_id || `place-${index}`,
              displayName: prediction.description,
              city,
              state,
              country,
              area: addressParts[0],
            }
          })
          setSuggestions(formattedSuggestions)
          setIsOpen(true)
        } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          // Fallback to popular locations if no results
          const filtered = popularLocations.filter(loc =>
            loc.displayName.toLowerCase().includes(query.toLowerCase()) ||
            loc.city.toLowerCase().includes(query.toLowerCase()) ||
            loc.state.toLowerCase().includes(query.toLowerCase())
          )
          setSuggestions(filtered.slice(0, 5))
          setIsOpen(true)
        } else {
          // Use fallback for other errors
          const filtered = popularLocations.filter(loc =>
            loc.displayName.toLowerCase().includes(query.toLowerCase()) ||
            loc.city.toLowerCase().includes(query.toLowerCase()) ||
            loc.state.toLowerCase().includes(query.toLowerCase())
          )
          setSuggestions(filtered.slice(0, 5))
          setIsOpen(true)
        }
      })
    } else if (query.trim().length === 0) {
      setSuggestions([])
      setIsOpen(false)
    } else if (query.trim().length > 0 && query.trim().length <= 2) {
      // Show popular locations for short queries
      const filtered = popularLocations.filter(loc =>
        loc.displayName.toLowerCase().includes(query.toLowerCase()) ||
        loc.city.toLowerCase().includes(query.toLowerCase()) ||
        loc.state.toLowerCase().includes(query.toLowerCase())
      )
      setSuggestions(filtered.slice(0, 5))
      setIsOpen(true)
    }
  }, [query, isLoaded])

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

  const getPlaceDetails = (placeId: string, location: LocationSuggestion) => {
    if (isLoaded && placesServiceRef.current) {
      const request: google.maps.places.PlaceDetailsRequest = {
        placeId,
        fields: ['geometry', 'address_components', 'formatted_address'],
      }

      placesServiceRef.current.getDetails(request, (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
          const coordinates = {
            lat: place.geometry?.location?.lat() || location.coordinates?.lat || 0,
            lng: place.geometry?.location?.lng() || location.coordinates?.lng || 0,
          }

          // Extract address components
          let city = location.city
          let state = location.state
          let pincode = ''
          let area = location.area

          if (place.address_components) {
            place.address_components.forEach((component) => {
              const types = component.types
              if (types.includes('locality') || types.includes('sublocality')) {
                city = component.long_name
              }
              if (types.includes('administrative_area_level_1')) {
                state = component.long_name
              }
              if (types.includes('postal_code')) {
                pincode = component.long_name
              }
              if (types.includes('sublocality_level_1')) {
                area = component.long_name
              }
            })
          }

          const updatedLocation: LocationSuggestion = {
            ...location,
            city,
            state,
            country: 'India',
            pincode: pincode || location.pincode,
            area: area || location.area,
            coordinates,
          }

          console.log('📍 Location selected:', updatedLocation) // Debug log

          setQuery(updatedLocation.displayName)
          setSelectedLocation(updatedLocation)
          setIsOpen(false)
          onChange(updatedLocation)

          if (onCoordinatesChange && coordinates.lat && coordinates.lng) {
            onCoordinatesChange(coordinates.lat, coordinates.lng)
          }
        } else {
          // Fallback if place details fail
          handleSelect(location)
        }
      })
    } else {
      handleSelect(location)
    }
  }

  const handleSelect = (location: LocationSuggestion) => {
    console.log('📍 Location selected (fallback):', location) // Debug log
    
    setQuery(location.displayName)
    setSelectedLocation(location)
    setIsOpen(false)
    onChange(location)

    if (location.coordinates && onCoordinatesChange) {
      onCoordinatesChange(location.coordinates.lat, location.coordinates.lng)
    }
  }

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
        <MapPinIcon className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-500" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          required={required}
          className={`w-full pl-8 sm:pl-10 pr-8 sm:pr-10 py-2 text-sm sm:text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 border ${
            error ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
          } rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400`}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true)
          }}
        />
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

      {loadError && (
        <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
            ⚠️ Google Places API Error
          </p>
          {loadError.message?.includes('BillingNotEnabled') || loadError.message?.includes('billing') ? (
            <div className="text-xs text-yellow-700 dark:text-yellow-400">
              <p className="mb-2">
                <strong>Billing must be enabled</strong> for Google Maps to work. 
                Google offers a <strong>$200/month free credit</strong> that covers most apps.
              </p>
              <a
                href="https://console.cloud.google.com/billing"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 underline font-medium"
              >
                Enable Billing →
              </a>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Using fallback locations until billing is enabled.
              </p>
            </div>
          ) : (
            <p className="text-xs text-yellow-700 dark:text-yellow-400">
              {loadError.message || 'Google Places API not loaded. Using fallback locations.'}
            </p>
          )}
        </div>
      )}

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg dark:shadow-gray-900/50 max-h-[200px] sm:max-h-60 overflow-y-auto scrollbar-hide">
          {suggestions.map((location) => (
            <button
              key={location.id}
              type="button"
              onClick={() => {
                if (location.id.startsWith('place-') || !isLoaded) {
                  handleSelect(location)
                } else {
                  getPlaceDetails(location.id, location)
                }
              }}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 text-sm sm:text-base"
            >
              <div className="flex items-start gap-3">
                <MapPinIcon className="h-5 w-5 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-gray-100">{location.displayName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{location.state}, {location.country}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && query.trim().length > 0 && suggestions.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg dark:shadow-gray-900/50 p-4 text-center text-gray-500 dark:text-gray-400">
          <p className="text-sm">No locations found. Try a different search term.</p>
        </div>
      )}
    </div>
  )
}
