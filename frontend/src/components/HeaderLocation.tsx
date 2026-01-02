import { useState, useRef, useEffect } from 'react'
import { MapPinIcon, ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useLocationStore } from '../store/locationStore'
import { useUserLocation } from '../hooks/useUserLocation'
import LocationAutocomplete, { LocationSuggestion } from './LocationAutocomplete'
import MapPicker from './MapPicker'

/**
 * Header Location Component
 * Displays and allows changing user's selected location
 */
export default function HeaderLocation() {
  const { userLocation, setLocation } = useLocationStore()
  const { saveUserLocation } = useUserLocation({ autoSync: true })
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<'select' | 'map'>('select')
  const [selectedLocation, setSelectedLocation] = useState<LocationSuggestion | null>(null)
  const [latitude, setLatitude] = useState(userLocation?.coordinates?.lat || 19.0760)
  const [longitude, setLongitude] = useState(userLocation?.coordinates?.lng || 72.8777)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (userLocation) {
      const location: LocationSuggestion = {
        id: 'current',
        displayName: userLocation.displayName,
        city: userLocation.city,
        state: userLocation.state,
        country: userLocation.country,
        area: userLocation.area,
        pincode: userLocation.pincode,
        coordinates: userLocation.coordinates,
      }
      setSelectedLocation(location)
      if (userLocation.coordinates) {
        setLatitude(userLocation.coordinates.lat)
        setLongitude(userLocation.coordinates.lng)
      }
    }
  }, [userLocation])

  // Position dropdown and close when clicking outside
  useEffect(() => {
    if (!isOpen) return

    const updateDropdownPosition = () => {
      if (buttonRef.current && dropdownRef.current && window.innerWidth >= 1024) {
        const buttonRect = buttonRef.current.getBoundingClientRect()
        const dropdown = dropdownRef.current
        
        // Position dropdown below the button, aligned to the right
        dropdown.style.position = 'absolute'
        dropdown.style.top = `${buttonRect.height + 8}px` // 8px = mt-2
        dropdown.style.right = '0'
        dropdown.style.left = 'auto'
        dropdown.style.transform = 'none'
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setStep('select')
      }
    }

    // Update position on mount and resize
    updateDropdownPosition()
    window.addEventListener('resize', updateDropdownPosition)

    // Small delay to prevent immediate close on open
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 100)

    // Prevent body scroll when dropdown is open on mobile
    if (window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', updateDropdownPosition)
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleLocationSelect = (location: LocationSuggestion | null) => {
    setSelectedLocation(location)
    if (location?.coordinates) {
      setLatitude(location.coordinates.lat)
      setLongitude(location.coordinates.lng)
    }
  }

  const handleMapChange = async (lat: number, lng: number, _source: 'GPS' | 'MANUAL' = 'MANUAL') => {
    setLatitude(lat)
    setLongitude(lng)
    
    // If no location selected or it's a map-selected location, reverse geocode
    if (!selectedLocation || selectedLocation.id === 'map-selected') {
      try {
        const { getCurrentLocationWithAddress } = await import('../utils/geolocation')
        const locationData = await getCurrentLocationWithAddress(lat, lng)

        if (locationData) {
          const location: LocationSuggestion = {
            id: 'map-selected',
            displayName: locationData.address || `${locationData.city || locationData.area || 'Selected Location'}, ${locationData.state || ''}`,
            city: locationData.city || locationData.area || 'Selected Location',
            state: locationData.state || '',
            country: locationData.country || 'India',
            area: locationData.area || locationData.locality,
            locality: locationData.locality || locationData.area,
            pincode: locationData.pincode,
            coordinates: { lat, lng },
          }
          setSelectedLocation(location)
        }
      } catch (error) {
        console.error('Error reverse geocoding:', error)
      }
    }
  }

  const handleConfirm = async () => {
    if (selectedLocation || (latitude && longitude)) {
      let finalLocation = selectedLocation

      // If location doesn't have proper details, reverse geocode
      if (!selectedLocation || !selectedLocation.city || selectedLocation.city === 'Selected Location' || selectedLocation.city === 'Current Location' || selectedLocation.city.match(/^\d+\.\d+,\s*\d+\.\d+$/)) {
        try {
          const { getCurrentLocationWithAddress } = await import('../utils/geolocation')
          const locationData = await getCurrentLocationWithAddress(latitude, longitude)

          if (locationData) {
            finalLocation = {
              id: selectedLocation?.id || 'confirmed',
              displayName: locationData.address || `${locationData.city || locationData.area || 'Selected Location'}, ${locationData.state || ''}`,
              city: locationData.city || locationData.area || 'Selected Location',
              state: locationData.state || '',
              country: locationData.country || 'India',
              area: locationData.area || locationData.locality,
              locality: locationData.locality || locationData.area,
              pincode: locationData.pincode,
              coordinates: { lat: latitude, lng: longitude },
            }
          }
        } catch (error) {
          console.error('Error reverse geocoding on confirm:', error)
        }
      }

      if (finalLocation) {
        const newLocation = {
          city: finalLocation.city,
          state: finalLocation.state,
          country: finalLocation.country,
          area: finalLocation.area || finalLocation.locality,
          locality: finalLocation.locality || finalLocation.area || finalLocation.city,
          pincode: finalLocation.pincode,
          coordinates: {
            lat: latitude,
            lng: longitude,
          },
          displayName: finalLocation.displayName,
        }
        setLocation(newLocation)
        
        // Save to backend if authenticated
        await saveUserLocation(newLocation, 'MANUAL').catch((err: any) => {
          console.warn('Failed to save user location to backend:', err)
        })
        
        setIsOpen(false)
        setStep('select')
      }
    }
  }

  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser. Please use the search option.')
      return
    }

    // Check permission status first (if available)
    if (navigator.permissions && navigator.permissions.query) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' as PermissionName })
        // Don't request again if permission was denied
        if (permission.state === 'denied') {
          alert('Location access was previously denied. Please enable location permissions in your browser settings, or use the search option.')
          return
        }
      } catch {
        // Permission query not supported, continue anyway
      }
    }

    try {
      // Get current position (only called on user action - button click)
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000, // Use cached location if available (up to 1 minute old)
        })
      })

      const { latitude, longitude } = position.coords
      setLatitude(latitude)
      setLongitude(longitude)

      // Reverse geocode to get actual address details
      const { getCurrentLocationWithAddress } = await import('../utils/geolocation')
      const locationData = await getCurrentLocationWithAddress(latitude, longitude)

      if (locationData) {
        // Prioritize area/locality over city for display
        const displayArea = locationData.area || locationData.locality || locationData.city
        const displayCity = locationData.city || locationData.area || locationData.locality || 'Unknown Location'
        
        // Create location object with actual address details
        const location: LocationSuggestion = {
          id: 'current',
          displayName: locationData.address || `${displayArea || displayCity}${locationData.state ? `, ${locationData.state}` : ''}${locationData.country && locationData.country !== 'India' ? `, ${locationData.country}` : ''}`,
          city: displayCity,
          state: locationData.state || '',
          country: locationData.country || 'India',
          area: locationData.area || locationData.locality || locationData.city,
          locality: locationData.locality || locationData.area || locationData.city,
          pincode: locationData.pincode,
          coordinates: { lat: latitude, lng: longitude },
        }
        setSelectedLocation(location)
      } else {
        // Fallback if reverse geocoding fails - use coordinates as location name
        const defaultLocation: LocationSuggestion = {
          id: 'current',
          displayName: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          city: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          state: '',
          country: 'India',
          coordinates: { lat: latitude, lng: longitude },
        }
        setSelectedLocation(defaultLocation)
      }
      
      // Automatically move to map step to show location
      setStep('map')
    } catch (error: any) {
      console.error('Error getting location:', error)
      let errorMessage = 'Unable to get your location'
      if (error.code === error.PERMISSION_DENIED) {
        errorMessage = 'Location access denied. Please enable location permissions in your browser settings.'
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        errorMessage = 'Location information unavailable.'
      } else if (error.code === error.TIMEOUT) {
        errorMessage = 'Location request timed out. Please try again.'
      }
      alert(errorMessage)
    }
  }

  return (
    <div className="relative">
          {/* Location Display Button */}
          <button
            ref={buttonRef}
            data-location-trigger
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors max-w-[140px] xs:max-w-[180px] sm:max-w-[220px] md:max-w-none lg:flex"
            title={userLocation ? userLocation.displayName : 'Select Location'}
          >
        <span className="hidden lg:contents">
          <MapPinIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-600 dark:text-primary-400 flex-shrink-0" />
          <span className="truncate hidden sm:inline">
            {userLocation ? (
              <>
                {userLocation.area || userLocation.locality || userLocation.city}
                {userLocation.city && userLocation.area && userLocation.city !== userLocation.area && `, ${userLocation.city}`}
              </>
            ) : (
              'Select Location'
            )}
          </span>
          <span className="truncate sm:hidden text-xs">
            {userLocation ? (userLocation.area || userLocation.locality || userLocation.city) : 'Location'}
          </span>
        </span>
        <ChevronDownIcon className={`w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Mobile Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-[9998] lg:hidden"
            onClick={() => {
              setIsOpen(false)
              setStep('select')
            }}
          />
          {/* Dropdown Content */}
          <div 
            ref={dropdownRef}
            className="fixed lg:absolute left-2 right-2 lg:left-auto top-1/2 lg:top-auto -translate-y-1/2 lg:translate-y-0 w-[calc(100vw-1rem)] lg:w-[320px] max-w-[320px] sm:max-w-[400px] md:w-80 md:max-w-[384px] bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 z-[9999] lg:z-50 max-h-[90vh] flex flex-col [&_button]:!opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
          {/* Header */}
          <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-900 flex-shrink-0">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">Change Location</h3>
            <button
              onClick={() => {
                setIsOpen(false)
                setStep('select')
              }}
              className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 overflow-y-auto scrollbar-hide" style={{ maxHeight: 'calc(90vh - 80px)', minHeight: 'auto', visibility: 'visible' }}>
            {step === 'select' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Search Location
                  </label>
                  <LocationAutocomplete
                    value={selectedLocation?.displayName || ''}
                    onChange={handleLocationSelect}
                    placeholder="Search city, area, or location..."
                    className="w-full"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">OR</span>
                  <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
                </div>

                <button
                  onClick={handleUseCurrentLocation}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-primary-300 dark:border-primary-600 rounded-lg text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 font-medium text-xs sm:text-sm transition-colors"
                >
                  <div className="flex items-center justify-center gap-2">
                    <MapPinIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Use Current Location</span>
                  </div>
                </button>

                {/* Always show location display */}
                <div className="bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 rounded-lg p-3">
                  <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                    {selectedLocation?.displayName || 
                     (userLocation && `${userLocation.area || userLocation.locality || userLocation.city || 'Unknown Location'}`) ||
                     'Unknown Location'}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {selectedLocation?.state || userLocation?.state || ''}, {selectedLocation?.country || userLocation?.country || 'India'}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      setStep('select')
                    }}
                    className="flex-1 px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium text-xs sm:text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (selectedLocation || userLocation) {
                        setStep('map')
                      }
                    }}
                    disabled={!selectedLocation && !userLocation}
                    className="flex-1 px-3 sm:px-4 py-2.5 sm:py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 font-medium text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Set on Map
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="flex-1 px-3 sm:px-4 py-2.5 sm:py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 font-medium text-xs sm:text-sm transition-colors"
                  >
                    Confirm
                  </button>
                </div>
              </>
            )}

            {step === 'map' && selectedLocation && (
              <>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Pinpoint Location</h4>
                  <div className="h-[250px] sm:h-[300px]">
                    <MapPicker
                      latitude={latitude}
                      longitude={longitude}
                      onLocationChange={handleMapChange}
                      height="100%"
                      readOnly={false}
                    />
                  </div>
                </div>

                {/* Location Info and Controls - Outside Map */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {selectedLocation.displayName && 
                       selectedLocation.displayName !== 'Unknown Location' && 
                       !selectedLocation.displayName.match(/^\d+\.\d+,\s*\d+\.\d+$/)
                        ? selectedLocation.displayName 
                        : `${selectedLocation.area || selectedLocation.locality || selectedLocation.city || 'Selected Location'}`}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    className="w-full px-3 py-2 bg-primary-600 dark:bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <MapPinIcon className="w-4 h-4" />
                    <span>Use My Location</span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => setStep('select')}
                    className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium text-xs sm:text-sm transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="flex-1 px-3 sm:px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 font-medium text-xs sm:text-sm transition-colors"
                  >
                    Confirm
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        </>
      )}
    </div>
  )
}

