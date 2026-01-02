import { useState, useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { PropertyFormData } from '../../types/property'
import { INDIAN_STATES } from '../../constants/propertyTypes'
import LocationAutocomplete from '../LocationAutocomplete'
import MapPicker from '../MapPicker'
import { useUserLocation } from '../../hooks/useUserLocation'
import { useAuthStore } from '../../store/authStore'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

interface Props {
  form: UseFormReturn<PropertyFormData>
}

export default function Step2Location({ form }: Props) {
  const { register, watch, setValue, formState: { errors } } = form
  const { isAuthenticated } = useAuthStore()
  const { saveUserLocation } = useUserLocation({ autoSync: false })

  const coordinates = watch('location.coordinates.coordinates')
  const latitude = coordinates?.[1] || 19.0760 // Default to Mumbai
  const longitude = coordinates?.[0] || 72.8777
  
  // State for location confirmation and address auto-fill
  const [pendingCoordinates, setPendingCoordinates] = useState<[number, number] | null>(null)
  const [isLocationPending, setIsLocationPending] = useState(false)
  const [addressSameAsLocation, setAddressSameAsLocation] = useState(false)
  const [locationAddress, setLocationAddress] = useState<string>('')
  
  // Watch location fields for address auto-fill
  const country = watch('location.country')
  const state = watch('location.state')
  const city = watch('location.city')
  const area = watch('location.area')
  const locality = watch('location.locality')
  const pincode = watch('location.pincode')

  const handleMapClick = async (lat: number, lng: number, source: 'GPS' | 'MANUAL' = 'MANUAL') => {
    // Set pending coordinates (waiting for confirmation)
    setPendingCoordinates([lat, lng])
    setIsLocationPending(true)
    
    // Reverse geocode to get location details
    try {
      const { reverseGeocode } = await import('../../utils/geolocation')
      const locationData = await reverseGeocode(lat, lng)
      
      if (locationData) {
        // Auto-fill location fields from reverse geocoding (but don't update coordinates yet)
        if (locationData.city) setValue('location.city', locationData.city, { shouldValidate: true })
        if (locationData.state) setValue('location.state', locationData.state, { shouldValidate: true })
        if (locationData.country) setValue('location.country', locationData.country, { shouldValidate: true })
        if (locationData.area) setValue('location.area', locationData.area, { shouldValidate: true })
        if (locationData.locality) setValue('location.locality', locationData.locality, { shouldValidate: true })
        if (locationData.pincode) setValue('location.pincode', locationData.pincode, { shouldValidate: true })
        
        // Update location address display with complete address from reverse geocoding
        if (locationData.address) {
          setLocationAddress(locationData.address)
        } else {
          // Fallback to constructed address if display_name not available
          const addressParts: string[] = []
          if (locationData.area || locationData.locality) addressParts.push(locationData.area || locationData.locality || '')
          if (locationData.city) addressParts.push(locationData.city)
          if (locationData.state) addressParts.push(locationData.state)
          if (locationData.pincode) addressParts.push(locationData.pincode)
          if (locationData.country) addressParts.push(locationData.country)
          setLocationAddress(addressParts.filter(Boolean).join(', '))
        }
        
        // Only auto-confirm for GPS, not for manual selection
        if (source === 'GPS') {
          confirmLocation(lat, lng, locationData)
        }
      }
    } catch (error) {
      console.warn('Reverse geocoding failed:', error)
      // Only auto-confirm GPS even if reverse geocoding fails
      if (source === 'GPS') {
        confirmLocation(lat, lng, null)
      }
    }
  }
  
  // Confirm location and update coordinates
  const confirmLocation = (lat: number, lng: number, locationData: any) => {
    // Get current location values from form
    const currentCity = watch('location.city')
    const currentState = watch('location.state')
    const currentCountry = watch('location.country') || 'India'
    const currentArea = watch('location.area')
    const currentLocality = watch('location.locality')
    const currentPincode = watch('location.pincode')
    
    // Update coordinates
    setValue('location.coordinates.coordinates', [lng, lat], { shouldValidate: true })
    setValue('location.coordinates.type', 'Point', { shouldValidate: true })
    
    // Update search location display with complete address if available, otherwise construct it
    const displayText = locationData?.address 
      ? locationData.address
      : currentCity 
      ? `${currentCity}${currentState ? `, ${currentState}` : ''}`
      : ''
    setLocationAddress(locationData?.address || displayText)
    
    // Clear pending state
    setPendingCoordinates(null)
    setIsLocationPending(false)
    
    // Save to user location if authenticated
    if (isAuthenticated && locationData) {
      saveUserLocation({
        city: currentCity || '',
        state: currentState || '',
        country: locationData.country || currentCountry || 'India',
        area: locationData.area || currentArea,
        locality: locationData.locality || currentLocality,
        pincode: locationData.pincode || currentPincode,
        coordinates: { lat, lng },
        displayName: locationData.address || `${currentCity || ''}, ${currentState || ''}`,
      }, 'MANUAL').catch((err: any) => {
        console.warn('Failed to save user location:', err)
      })
    }
  }
  
  // Auto-fill address when checkbox is checked
  useEffect(() => {
    if (addressSameAsLocation) {
      const addressParts: string[] = []
      
      if (area || locality) {
        addressParts.push(area || locality || '')
      }
      if (city) {
        addressParts.push(city)
      }
      if (state) {
        addressParts.push(state)
      }
      if (pincode) {
        addressParts.push(pincode)
      }
      if (country) {
        addressParts.push(country)
      }
      
      const fullAddress = addressParts.filter(Boolean).join(', ')
      if (fullAddress) {
        setValue('location.address', fullAddress, { shouldValidate: true })
      }
    }
  }, [addressSameAsLocation, area, locality, city, state, pincode, country, setValue])

  const handleLocationSelect = (location: any) => {
    if (location) {
      setValue('location.city', location.city, { shouldValidate: true })
      setValue('location.state', location.state, { shouldValidate: true })
      setValue('location.country', location.country, { shouldValidate: true })
      if (location.area) {
        setValue('location.area', location.area, { shouldValidate: true })
      }
      if (location.locality) {
        setValue('location.locality', location.locality, { shouldValidate: true })
      }
      if (location.pincode) {
        setValue('location.pincode', location.pincode, { shouldValidate: true })
      }
      
      // Update search location display with complete displayName if available
      const displayText = location.displayName 
        ? location.displayName
        : location.city 
        ? `${location.city}${location.state ? `, ${location.state}` : ''}`
        : ''
      setLocationAddress(displayText)
      
      // Update coordinates and confirm immediately for search selection
      if (location.coordinates) {
        setValue('location.coordinates.coordinates', [location.coordinates.lng, location.coordinates.lat], { shouldValidate: true })
        setValue('location.coordinates.type', 'Point', { shouldValidate: true })
        setPendingCoordinates(null)
        setIsLocationPending(false)
      }
    } else {
      // Location cleared - reset address display
      setLocationAddress('')
    }
  }

  return (
      <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-gray-100 mb-2">Location & Geo-Verification</h2>
        <p className="text-gray-600 dark:text-gray-400">Provide the exact location of your property</p>
      </div>

      {/* Location Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Search Location
        </label>
        <LocationAutocomplete
          value={locationAddress || (watch('location.city') ? `${watch('location.city')}${watch('location.state') ? `, ${watch('location.state')}` : ''}` : '')}
          onChange={handleLocationSelect}
          placeholder="Search city, area, or landmark..."
          required={false}
          error={errors.location?.city?.message}
          onCoordinatesChange={handleMapClick}
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Start typing to search for locations. This will auto-fill the location details below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Country
          </label>
          <input
            type="text"
            {...register('location.country')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
            placeholder="e.g., India"
          />
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            State <span className="text-red-500 dark:text-red-400">*</span>
          </label>
          <select
            {...register('location.state', { required: 'State is required' })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
          >
            <option value="">Select state</option>
            {INDIAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          {errors.location?.state && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.location.state.message}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            City <span className="text-red-500 dark:text-red-400">*</span>
          </label>
          <input
            type="text"
            {...register('location.city', { required: 'City is required' })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
          />
          {errors.location?.city && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.location.city.message}</p>
          )}
        </div>

        {/* Area */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Area / Locality <span className="text-red-500 dark:text-red-400">*</span>
          </label>
          <input
            type="text"
            {...register('location.area', { required: 'Area is required' })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
          />
          {errors.location?.area && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.location.area.message}</p>
          )}
        </div>

        {/* Locality */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Locality
          </label>
          <input
            type="text"
            {...register('location.locality')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
          />
        </div>

        {/* Pincode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Pincode / ZIP <span className="text-red-500 dark:text-red-400">*</span>
          </label>
          <input
            type="text"
            {...register('location.pincode', {
              required: 'Pincode is required',
              pattern: {
                value: /^[0-9]{6}$/,
                message: 'Pincode must be 6 digits',
              },
            })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
          />
          {errors.location?.pincode && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.location.pincode.message}</p>
          )}
        </div>
      </div>

      {/* Landmark */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Landmark</label>
        <input
          type="text"
          {...register('location.landmark')}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
          placeholder="e.g., Near Metro Station, Opposite Mall"
        />
      </div>

      {/* Address */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Complete Address
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={addressSameAsLocation}
              onChange={(e) => setAddressSameAsLocation(e.target.checked)}
              className="w-4 h-4 text-primary-600 dark:text-primary-400 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 dark:focus:ring-primary-400"
            />
            <span>Address same as search location</span>
          </label>
        </div>
        <textarea
          {...register('location.address')}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
          placeholder="Enter complete address"
          readOnly={addressSameAsLocation}
        />
        {addressSameAsLocation && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Address will be auto-filled from location fields above
          </p>
        )}
      </div>

      {/* Interactive Map */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Exact Location on Map <span className="text-red-500 dark:text-red-400">*</span>
        </label>
        <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
          <MapPicker
            latitude={pendingCoordinates ? pendingCoordinates[0] : latitude}
            longitude={pendingCoordinates ? pendingCoordinates[1] : longitude}
            onLocationChange={(lat, lng) => {
              // This is called when marker is dragged or map is clicked
              // It sets pending location and triggers reverse geocoding
              handleMapClick(lat, lng, 'MANUAL')
            }}
            height="400px"
            showConfirmButton={false}
            onConfirm={(lat, lng) => {
              // Fallback confirm handler
              handleMapClick(lat, lng, 'MANUAL')
            }}
          />
        </div>
        
        {/* Confirm Location Button - Outside Map */}
        {isLocationPending && pendingCoordinates && (
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const [lat, lng] = pendingCoordinates
                // Get current location data from form
                const currentCity = watch('location.city')
                const currentState = watch('location.state')
                const currentCountry = watch('location.country') || 'India'
                const currentArea = watch('location.area')
                const currentLocality = watch('location.locality')
                const currentPincode = watch('location.pincode')
                
                // Get the location address from state or construct it
                const locationDataForConfirm = {
                  address: locationAddress || (currentArea || currentLocality || currentCity 
                    ? `${currentArea || currentLocality || ''}${currentCity ? `, ${currentCity}` : ''}${currentState ? `, ${currentState}` : ''}${currentPincode ? `, ${currentPincode}` : ''}${currentCountry ? `, ${currentCountry}` : ''}`
                    : ''),
                  city: currentCity,
                  state: currentState,
                  country: currentCountry,
                  area: currentArea,
                  locality: currentLocality,
                  pincode: currentPincode,
                }
                confirmLocation(lat, lng, locationDataForConfirm)
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 dark:bg-primary-500 hover:bg-primary-700 dark:hover:bg-primary-600 text-white rounded-lg shadow-md transition-colors font-medium text-sm"
            >
              <CheckCircleIcon className="w-5 h-5" />
              Confirm Location
            </button>
            <button
              type="button"
              onClick={() => {
                setPendingCoordinates(null)
                setIsLocationPending(false)
              }}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors font-medium text-sm"
            >
              Cancel
            </button>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Location pending confirmation
            </p>
          </div>
        )}
        
        {errors.location?.coordinates && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">Location coordinates are required</p>
        )}
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          <strong>Click anywhere on the map</strong> or drag the marker to set the exact property location. This is used for geo-verification and nearby property searches.
        </p>
        {coordinates && coordinates[0] !== 0 && coordinates[1] !== 0 && !isLocationPending && (
          <p className="mt-1 text-xs text-green-600 dark:text-green-400 font-medium">
            ✅ Location confirmed: {coordinates[1].toFixed(6)}, {coordinates[0].toFixed(6)}
          </p>
        )}
      </div>
    </div>
  )
}

