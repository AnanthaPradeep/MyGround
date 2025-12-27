import { useEffect, useState, useCallback, useRef } from 'react'
import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api'
import { MapPinIcon } from '@heroicons/react/24/outline'
import { GOOGLE_MAPS_CONFIG } from '../config/googleMaps'
import { getCurrentLocationWithAddress } from '../utils/geolocation'

interface MapPickerProps {
  latitude: number
  longitude: number
  onLocationChange: (lat: number, lng: number) => void
  className?: string
  height?: string
  readOnly?: boolean
}

const containerStyle = {
  width: '100%',
  height: '100%',
}

const defaultCenter = {
  lat: 19.0760, // Mumbai
  lng: 72.8777,
}

// Custom marker icon - using a simpler approach that works even if Google Maps API has issues
const getMarkerIcon = (isLoaded: boolean) => {
  if (!isLoaded || typeof google === 'undefined' || !google.maps) {
    // Return a simple URL-based icon if Google Maps API isn't fully loaded
    return {
      url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
      scaledSize: { width: 32, height: 32 },
      anchor: { x: 16, y: 32 },
    }
  }
  
  try {
    return {
      url: 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
          <path fill="#0259bb" d="M16 0C7.163 0 0 7.163 0 16c0 11 16 24 16 24s16-13 16-24C32 7.163 24.837 0 16 0z"/>
          <circle fill="#ffffff" cx="16" cy="16" r="8"/>
        </svg>
      `),
      scaledSize: new google.maps.Size(32, 40),
      anchor: new google.maps.Point(16, 40),
    }
  } catch (error) {
    console.warn('Error creating custom marker icon, using default:', error)
    return undefined // Use default Google Maps marker
  }
}

/**
 * Map Picker Component using Google Maps
 * Interactive map for selecting property location
 * Click on map to automatically set location
 */
export default function MapPicker({
  latitude,
  longitude,
  onLocationChange,
  className = '',
  height = '400px',
  readOnly = false,
}: MapPickerProps) {
  const [position, setPosition] = useState<{ lat: number; lng: number }>({
    lat: latitude || defaultCenter.lat,
    lng: longitude || defaultCenter.lng,
  })
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const markerRef = useRef<google.maps.Marker | null>(null)

  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_CONFIG.apiKey,
    libraries: GOOGLE_MAPS_CONFIG.libraries,
    id: 'google-map-script', // Add unique ID to prevent multiple loads
  })

  // Update position when props change
  useEffect(() => {
    if (latitude && longitude) {
      const newPosition = { lat: latitude, lng: longitude }
      if (newPosition.lat !== position.lat || newPosition.lng !== position.lng) {
        setPosition(newPosition)
        
        // Center map on new position
        if (mapRef.current) {
          mapRef.current.setCenter(newPosition)
          mapRef.current.setZoom(15)
        }
      }
    }
  }, [latitude, longitude])

  // Initialize map center - only if no coordinates provided
  useEffect(() => {
    if (isLoaded && mapRef.current) {
      // If coordinates are provided, use them
      if (latitude && longitude && latitude !== 0 && longitude !== 0) {
        const center = { lat: latitude, lng: longitude }
        setPosition(center)
        mapRef.current.setCenter(center)
        mapRef.current.setZoom(15)
      } else {
        // Use default center if no coordinates
        mapRef.current.setCenter(defaultCenter)
        mapRef.current.setZoom(10)
      }
    }
  }, [isLoaded, latitude, longitude])

  const onMapLoad = useCallback((mapInstance: google.maps.Map) => {
    mapRef.current = mapInstance
    setMap(mapInstance)
    
    // Set initial center
    if (latitude && longitude) {
      mapInstance.setCenter({ lat: latitude, lng: longitude })
      mapInstance.setZoom(15)
    } else {
      mapInstance.setCenter(defaultCenter)
      mapInstance.setZoom(10)
    }
  }, [latitude, longitude])

  const onMapUnmount = useCallback(() => {
    mapRef.current = null
    setMap(null)
  }, [])

  // Handle map click - PRIMARY METHOD TO SET LOCATION
  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (!readOnly && e.latLng) {
      const lat = e.latLng.lat()
      const lng = e.latLng.lng()
      const newPosition = { lat, lng }
      
      console.log('📍 Map clicked at:', lat, lng) // Debug log
      
      setPosition(newPosition)
      setError(null)
      
      // IMPORTANT: Call the callback to update parent
      onLocationChange(lat, lng)
      
      // Center map on clicked location
      if (mapRef.current) {
        mapRef.current.setCenter(newPosition)
        mapRef.current.setZoom(15)
      }
    }
  }, [readOnly, onLocationChange])

  // Handle marker drag end
  const handleMarkerDragEnd = useCallback((e: google.maps.MapMouseEvent) => {
    if (!readOnly && e.latLng) {
      const lat = e.latLng.lat()
      const lng = e.latLng.lng()
      const newPosition = { lat, lng }
      
      console.log('📍 Marker dragged to:', lat, lng) // Debug log
      
      setPosition(newPosition)
      setError(null)
      onLocationChange(lat, lng)
    }
  }, [readOnly, onLocationChange])

  // Handle "Use My Location" button - Automatically sets location
  const handleUseCurrentLocation = async () => {
    setIsLoadingLocation(true)
    setError(null)
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      setIsLoadingLocation(false)
      return
    }

    try {
      // Get current position first
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
          }
        )
      })

      const { latitude, longitude } = position.coords
      const newPosition = { lat: latitude, lng: longitude }
      
      console.log('📍 Current location detected:', latitude, longitude)
      
      // Immediately update position and center map
      setPosition(newPosition)
      
      // Center map on current location with smooth animation
      if (mapRef.current) {
        mapRef.current.setCenter(newPosition)
        mapRef.current.setZoom(16) // Zoom in closer for better accuracy
      }
      
      // Automatically call onLocationChange to set the coordinates
      onLocationChange(latitude, longitude)
      
      // Get address details and update parent if callback supports it
      try {
        const locationData = await getCurrentLocationWithAddress(latitude, longitude)
        if (locationData && locationData.area) {
          console.log('📍 Location with address:', locationData)
          // If we have address details, we could update the display
          // but coordinates are already set, so this is just for logging
        } else {
          console.warn('📍 Got coordinates but no address details. Reverse geocoding may have failed.')
        }
      } catch (addrError) {
        console.warn('Could not get address details, but coordinates are set:', addrError)
        // Coordinates are still set, so location selection works
      }
      
      setError(null)
    } catch (err: any) {
      console.error('Error getting location:', err)
      let errorMessage = 'Failed to get your location. Please select manually on the map.'
      
      if (err.code === err.PERMISSION_DENIED) {
        errorMessage = 'Location access denied. Please enable location permissions in your browser settings.'
      } else if (err.code === err.POSITION_UNAVAILABLE) {
        errorMessage = 'Location information unavailable. Please select manually on the map.'
      } else if (err.code === err.TIMEOUT) {
        errorMessage = 'Location request timed out. Please try again or select manually.'
      }
      
      setError(errorMessage)
    } finally {
      setIsLoadingLocation(false)
    }
  }

  // Show error if Google Maps fails to load
  if (loadError) {
    console.error('Google Maps load error:', loadError)
    const isBillingError = loadError.message?.includes('BillingNotEnabled') || loadError.message?.includes('billing')
    
    return (
      <div className={`relative ${className}`} style={{ height }}>
        <div className="w-full h-full flex items-center justify-center bg-red-50 border-2 border-red-200 rounded-lg">
          <div className="text-center p-4 max-w-md">
            <p className="text-red-700 font-medium mb-2">⚠️ Failed to load Google Maps</p>
            
            {isBillingError ? (
              <>
                <p className="text-red-600 font-semibold mb-2">🔴 Billing Not Enabled</p>
                <p className="text-red-600 text-sm mb-3">
                  You must enable billing for your Google Cloud project. <strong>Don't worry - Google Maps has a generous free tier ($200/month free credit) that covers most apps!</strong>
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-3 text-left">
                  <p className="text-xs font-semibold text-yellow-800 mb-1">Quick Fix:</p>
                  <ol className="text-xs text-yellow-700 space-y-1 list-decimal list-inside">
                    <li>Go to <a href="https://console.cloud.google.com/billing" target="_blank" rel="noopener noreferrer" className="underline font-medium">Google Cloud Billing</a></li>
                    <li>Link a billing account to your project</li>
                    <li>Wait 2-5 minutes, then refresh this page</li>
                  </ol>
                </div>
                <a
                  href="https://console.cloud.google.com/billing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  Enable Billing Now →
                </a>
                <p className="text-xs text-gray-600 mt-3">
                  See <code className="bg-gray-100 px-1 rounded">ENABLE_BILLING_GUIDE.md</code> for detailed instructions
                </p>
              </>
            ) : (
              <>
                <p className="text-red-600 text-sm mb-3">Common fixes:</p>
                <ul className="text-left text-xs text-red-600 space-y-1 mb-3">
                  <li>• Check API key in <code className="bg-red-100 px-1 rounded">.env</code> file</li>
                  <li>• Verify Maps JavaScript API is enabled in Google Cloud Console</li>
                  <li>• Check API key restrictions (allow <code className="bg-red-100 px-1 rounded">localhost:5173</code>)</li>
                  <li>• Ensure billing is enabled for your Google Cloud project</li>
                </ul>
                <p className="text-red-500 text-xs mt-2">Error: {loadError.message}</p>
              </>
            )}
            
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show loading state
  if (!isLoaded) {
    return (
      <div className={`relative ${className}`} style={{ height }}>
        <div className="w-full h-full flex items-center justify-center bg-gray-100 border-2 border-gray-300 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Google Maps...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <div className="w-full h-full rounded-lg overflow-hidden border-2 border-gray-300">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={position}
          zoom={position.lat === defaultCenter.lat && position.lng === defaultCenter.lng ? 10 : 15}
          onLoad={onMapLoad}
          onUnmount={onMapUnmount}
          onClick={handleMapClick}
          options={{
            disableDefaultUI: false,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
            clickableIcons: false,
            gestureHandling: 'greedy',
            draggable: true,
            scrollwheel: true,
          }}
        >
          {/* Marker - Always show when map is loaded */}
          {isLoaded && typeof google !== 'undefined' && google.maps && (
            <Marker
              position={position}
              draggable={!readOnly}
              onDragEnd={handleMarkerDragEnd}
              animation={google.maps.Animation.DROP}
              icon={getMarkerIcon(isLoaded)}
              visible={true}
              zIndex={1000}
              title="Property Location"
              clickable={true}
            />
          )}
        </GoogleMap>
      </div>

      {/* Instructions Overlay */}
      {!readOnly && (
        <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg text-xs text-gray-700 z-[1000] max-w-[220px]">
          <p className="font-medium mb-1 flex items-center gap-1">
            <MapPinIcon className="w-4 h-4 text-primary-600" />
            Click on map to set location
          </p>
        </div>
      )}

      {readOnly && (
        <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg text-xs text-gray-700 z-[1000]">
          <p className="font-medium">Property Location</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="absolute top-2 right-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg shadow-lg text-xs z-[1000] max-w-[250px]">
          <p className="font-medium">⚠️ {error}</p>
        </div>
      )}

    </div>
  )
}
