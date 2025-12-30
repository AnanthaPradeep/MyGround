import { useState, useEffect } from 'react'
import { XMarkIcon, MapPinIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import LocationAutocomplete, { LocationSuggestion } from './LocationAutocomplete'
import MapPicker from './MapPicker'
import { useLocationStore, UserLocation } from '../store/locationStore'
import { useUserLocation } from '../hooks/useUserLocation'
import { useAuthStore } from '../store/authStore'

interface LocationSelectorModalProps {
  onClose: () => void
  isOpen: boolean
}

/**
 * Location Selector Modal
 * Shows on app load to get user's location preference
 * Improved with better error handling and user feedback
 */
export default function LocationSelectorModal({ onClose, isOpen }: LocationSelectorModalProps) {
  const { setLocation } = useLocationStore()
  const { isAuthenticated } = useAuthStore()
  const { saveUserLocation } = useUserLocation({ autoSync: false })
  const [selectedLocation, setSelectedLocation] = useState<LocationSuggestion | null>(null)
  const [latitude, setLatitude] = useState(19.0760) // Default to Mumbai
  const [longitude, setLongitude] = useState(72.8777)
  const [step, setStep] = useState<'search' | 'map'>('search')
  const [_canProceed, setCanProceed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (selectedLocation?.coordinates) {
      setLatitude(selectedLocation.coordinates.lat)
      setLongitude(selectedLocation.coordinates.lng)
      setCanProceed(true)
    }
  }, [selectedLocation])

  // Try to get user's location on mount
  useEffect(() => {
    if (isOpen && navigator.geolocation) {
      setIsLoading(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLatitude(latitude)
          setLongitude(longitude)
          setIsLoading(false)
        },
        (_error) => {
          setIsLoading(false)
          // Don't show error, just use default location
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      )
    }
  }, [isOpen])

  const handleLocationSelect = (location: LocationSuggestion | null) => {
    setSelectedLocation(location)
    setError(null)
    if (location?.coordinates) {
      setLatitude(location.coordinates.lat)
      setLongitude(location.coordinates.lng)
      setCanProceed(true)
    } else {
      setCanProceed(false)
    }
  }

  const handleMapChange = async (lat: number, lng: number) => {
    setLatitude(lat)
    setLongitude(lng)
    setCanProceed(true)
    setError(null)
    
    // If no location selected from search, reverse geocode to get address
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
        } else {
          // Fallback if reverse geocoding fails
          const location: LocationSuggestion = {
            id: 'map-selected',
            displayName: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
            city: 'Selected Location',
            state: '',
            country: 'India',
            coordinates: { lat, lng },
          }
          setSelectedLocation(location)
        }
      } catch (error) {
        console.error('Error reverse geocoding:', error)
        // Fallback on error
        const location: LocationSuggestion = {
          id: 'map-selected',
          displayName: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
          city: 'Selected Location',
          state: '',
          country: 'India',
          coordinates: { lat, lng },
        }
        setSelectedLocation(location)
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

      const userLocation: UserLocation = {
        city: finalLocation?.city || 'Selected Location',
        state: finalLocation?.state || '',
        country: finalLocation?.country || 'India',
        area: finalLocation?.area || finalLocation?.locality,
        locality: finalLocation?.locality || finalLocation?.area || finalLocation?.city || 'Selected Location',
        pincode: finalLocation?.pincode,
        coordinates: {
          lat: latitude,
          lng: longitude,
        },
        displayName: finalLocation?.displayName || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
      }
      
      setLocation(userLocation)
      
      // Save to backend if authenticated
      if (isAuthenticated && saveUserLocation) {
        await saveUserLocation(userLocation, 'MANUAL').catch(err => {
          console.warn('Failed to save user location to backend:', err)
          // Continue even if backend save fails
        })
      }
      
      onClose()
    } else {
      setError('Please select a location on the map or search for a location.')
    }
  }

  const handleUseCurrentLocation = async () => {
    setIsLoading(true)
    setError(null)
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      setIsLoading(false)
      return
    }

    try {
      // Get current position
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
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
        
        // Create location object with actual address details - prioritize area name
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
        setCanProceed(true)
      } else {
        // Fallback if reverse geocoding fails - use coordinates
        const defaultLocation: LocationSuggestion = {
          id: 'current',
          displayName: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          city: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          state: '',
          country: 'India',
          coordinates: { lat: latitude, lng: longitude },
        }
        setSelectedLocation(defaultLocation)
        setCanProceed(true)
      }
      
      setIsLoading(false)
      // Move to map step to show location
      setStep('map')
    } catch (error: any) {
      console.error('Error getting location:', error)
      let errorMessage = 'Unable to get your current location. Please select manually.'
      if (error.code === error.PERMISSION_DENIED) {
        errorMessage = 'Location access denied. Please enable location permissions.'
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        errorMessage = 'Location information unavailable.'
      } else if (error.code === error.TIMEOUT) {
        errorMessage = 'Location request timed out. Please try again.'
      }
      setError(errorMessage)
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto scrollbar-hide">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPinIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Select Your Location</h2>
              <p className="text-xs sm:text-sm text-gray-600 truncate">Help us show you relevant properties</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            aria-label="Close"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Step 1: Location Search */}
          {step === 'search' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search for your city or area <span className="text-red-500">*</span>
                </label>
                <LocationAutocomplete
                  value={selectedLocation?.displayName || ''}
                  onChange={handleLocationSelect}
                  placeholder="e.g., Mumbai, Maharashtra or Bandra, Mumbai"
                  required
                  onCoordinatesChange={handleMapChange}
                />
                <p className="mt-2 text-xs text-gray-500">
                  Start typing to search for your preferred location
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1 border-t border-gray-200"></div>
                <span className="text-sm text-gray-500">OR</span>
                <div className="flex-1 border-t border-gray-200"></div>
              </div>

              <button
                onClick={handleUseCurrentLocation}
                disabled={isLoading}
                className="w-full px-4 py-3 border-2 border-dashed border-primary-300 rounded-lg text-primary-600 hover:bg-primary-50 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Getting your location...</span>
                  </>
                ) : (
                  <>
                    <MapPinIcon className="w-5 h-5" />
                    <span>Use My Current Location</span>
                  </>
                )}
              </button>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {selectedLocation && (
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{selectedLocation.displayName}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedLocation.state}, {selectedLocation.country}
                      </p>
                      {selectedLocation.coordinates && (
                        <p className="text-xs text-gray-500 mt-1">
                          Coordinates: {selectedLocation.coordinates.lat.toFixed(6)}, {selectedLocation.coordinates.lng.toFixed(6)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    if (selectedLocation || (latitude && longitude)) {
                      setStep('map')
                    } else {
                      setError('Please search and select a location first, or use your current location.')
                    }
                  }}
                  disabled={!selectedLocation && !latitude}
                  className="flex-1 px-4 py-2.5 sm:py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Confirm Location on Map
                </button>
                {selectedLocation && (
                  <button
                    onClick={handleConfirm}
                    className="flex-1 px-4 py-2.5 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm sm:text-base transition-colors"
                  >
                    Confirm & Continue
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Map Selection */}
          {step === 'map' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Pinpoint Your Exact Location
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Click anywhere on the map or drag the marker to set your exact location
                </p>
                <div className="border-2 border-gray-300 rounded-lg overflow-hidden h-[300px] sm:h-[400px]">
                  <MapPicker
                    latitude={latitude}
                    longitude={longitude}
                    onLocationChange={(lat, lng) => {
                      handleMapChange(lat, lng)
                    }}
                    height="100%"
                    readOnly={false}
                    showConfirmButton={true}
                    onConfirm={(lat, lng) => {
                      handleMapChange(lat, lng)
                    }}
                  />
                </div>
              </div>

              {/* Location Info and Controls - Outside Map */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {selectedLocation?.displayName && 
                       selectedLocation.displayName !== 'Unknown Location' && 
                       !selectedLocation.displayName.match(/^\d+\.\d+,\s*\d+\.\d+$/)
                        ? selectedLocation.displayName
                        : `${selectedLocation?.area || selectedLocation?.locality || selectedLocation?.city || 'Selected Location'}`}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
                    </p>
                  </div>
                  <button
                    onClick={() => setStep('search')}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium ml-4"
                  >
                    Change Location
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Locating...</span>
                    </>
                  ) : (
                    <>
                      <MapPinIcon className="w-4 h-4" />
                      <span>Use My Location</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setStep('search')}
                  className="px-4 py-2.5 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm sm:text-base transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 px-4 py-2.5 sm:py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium text-sm sm:text-base transition-colors"
                >
                  Confirm & Continue
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-4 sm:px-6 py-2 sm:py-3">
          <p className="text-xs text-gray-500 text-center">
            You can change your location anytime from the header
          </p>
        </div>
      </div>
    </div>
  )
}
