import { useEffect, useState, useRef, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, ZoomControl } from 'react-leaflet'
import { Icon, LatLngExpression } from 'leaflet'
import type { Marker as LeafletMarker } from 'leaflet'
import { MapPinIcon } from '@heroicons/react/24/outline'
// Import Leaflet CSS - Vite will code-split this into map-vendor chunk
// The CSS loads asynchronously when this component is used (lazy-loaded routes)
// The HTML script will apply media trick to make it non-blocking
import 'leaflet/dist/leaflet.css'

// Fix for default marker icon in Leaflet with Vite
import L from 'leaflet'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png'

// Fix default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
})

// Custom marker icon with primary color
const createCustomIcon = (color: string = '#0259bb') => {
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
        <path fill="${color}" d="M16 0C7.163 0 0 7.163 0 16c0 11 16 24 16 24s16-13 16-24C32 7.163 24.837 0 16 0z"/>
        <circle fill="#ffffff" cx="16" cy="16" r="8"/>
      </svg>
    `)}`,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  })
}

interface MapPickerProps {
  latitude: number
  longitude: number
  onLocationChange: (lat: number, lng: number) => void
  className?: string
  height?: string
  readOnly?: boolean
  onConfirm?: (lat: number, lng: number) => void
  showConfirmButton?: boolean
}

const defaultCenter: [number, number] = [19.0760, 72.8777] // Mumbai

// Component to handle map click events
function MapClickHandler({ 
  onLocationChange, 
  readOnly 
}: { 
  onLocationChange: (lat: number, lng: number, isAuto: boolean) => void
  readOnly: boolean 
}) {
  useMapEvents({
    click: (e) => {
      if (!readOnly) {
        const { lat, lng } = e.latlng
        onLocationChange(lat, lng, false)
      }
    },
  })
  return null
}

// Component to update map center when props change and store map reference
function MapCenterUpdater({ 
  center, 
  zoom,
  onMapReady
}: { 
  center: LatLngExpression
  zoom: number
  onMapReady?: (map: L.Map) => void
}) {
  const map = useMap()
  
  useEffect(() => {
    if (onMapReady) {
      onMapReady(map)
    }
  }, [map, onMapReady])
  
  useEffect(() => {
    if (Array.isArray(center) && center.length === 2) {
      map.setView(center, zoom)
    }
  }, [map, center, zoom])
  
  return null
}

/**
 * Map Picker Component using Leaflet
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
  onConfirm,
  showConfirmButton = false,
}: MapPickerProps) {
  const getInitialPosition = (): [number, number] => {
    if (latitude && latitude !== 0 && longitude && longitude !== 0) {
      return [latitude, longitude]
    }
    return [defaultCenter[0], defaultCenter[1]]
  }

  const [position, setPosition] = useState<[number, number]>(getInitialPosition())
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLocationChanged, setIsLocationChanged] = useState(false)
  const [pendingLocation, setPendingLocation] = useState<[number, number] | null>(null)
  const markerRef = useRef<LeafletMarker>(null)
  const mapRef = useRef<L.Map | null>(null)

  // Update position when props change
  useEffect(() => {
    if (latitude && longitude && latitude !== 0 && longitude !== 0) {
      const newPosition: [number, number] = [latitude, longitude]
      setPosition(newPosition)
      setError(null)
      setIsLocationChanged(false)
      setPendingLocation(null)
    }
  }, [latitude, longitude])

  // Handle location change
  const handleLocationChange = useCallback((lat: number, lng: number, isAuto = false) => {
    const newPosition: [number, number] = [lat, lng]
    setPosition(newPosition)
    setError(null)
    
    // If auto-location (from current location button), confirm immediately
    if (isAuto) {
      onLocationChange(lat, lng)
      setIsLocationChanged(false)
      setPendingLocation(null)
      if (onConfirm) {
        onConfirm(lat, lng)
      }
    } else {
      // Manual location change - set as pending
      setPendingLocation(newPosition)
      setIsLocationChanged(true)
    }
    
    // Update marker position
    if (markerRef.current) {
      markerRef.current.setLatLng(newPosition)
    }
  }, [onLocationChange, onConfirm])
  
  // Confirm location manually set
  const handleConfirmLocation = useCallback(() => {
    if (pendingLocation) {
      onLocationChange(pendingLocation[0], pendingLocation[1])
      setIsLocationChanged(false)
      setPendingLocation(null)
      if (onConfirm) {
        onConfirm(pendingLocation[0], pendingLocation[1])
      }
    }
  }, [pendingLocation, onLocationChange, onConfirm])

  // Get current location with high accuracy
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }

    setIsLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords
        
        // Update position immediately and auto-confirm (isAuto = true)
        handleLocationChange(lat, lng, true)
        
        // Center and zoom to current location (zoom level 18 for street-level view)
        if (mapRef.current) {
          mapRef.current.setView([lat, lng], 18, { animate: true, duration: 0.5 })
        }
        
        setIsLoading(false)
      },
      (error) => {
        console.error('Geolocation error:', error)
        let errorMessage = 'Unable to get your location'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions in your browser settings.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable. Please try again.'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.'
            break
        }
        
        setError(errorMessage)
        setIsLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    )
  }, [handleLocationChange])
  
  // Store map reference when ready
  const handleMapReady = useCallback((map: L.Map) => {
    mapRef.current = map
  }, [])

  // Handle marker drag end - immediately update location and trigger reverse geocoding
  const handleMarkerDragEnd = useCallback((e: any) => {
    if (!readOnly && e.target) {
      const marker = e.target as LeafletMarker
      const latlng = marker.getLatLng()
      const lat = latlng.lat
      const lng = latlng.lng
      
      // Update position immediately
      setPosition([lat, lng])
      setError(null)
      
      // Immediately call onLocationChange to update parent and trigger reverse geocoding
      // This ensures coordinates and address fields are updated when dragging
      onLocationChange(lat, lng)
      
      // Also set as pending if showConfirmButton is enabled
      if (showConfirmButton) {
        setPendingLocation([lat, lng])
        setIsLocationChanged(true)
      } else {
        // If no confirm button, auto-confirm
        setIsLocationChanged(false)
        setPendingLocation(null)
        if (onConfirm) {
          onConfirm(lat, lng)
        }
      }
    }
  }, [readOnly, onLocationChange, onConfirm, showConfirmButton])

  const center: LatLngExpression = position
  const zoom = position[0] === defaultCenter[0] && position[1] === defaultCenter[1] ? 10 : 15

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <div className="w-full h-full rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600">
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
          className="z-0"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Custom Zoom Controls - Bottom Right */}
          <ZoomControl position="bottomright" />
          
          {/* Update map center when position changes and store map reference */}
          <MapCenterUpdater center={center} zoom={zoom} onMapReady={handleMapReady} />
          
          {/* Handle map clicks */}
          {!readOnly && (
            <MapClickHandler 
              onLocationChange={handleLocationChange}
              readOnly={readOnly}
            />
          )}

          {/* Marker */}
          <Marker
            position={position}
            draggable={!readOnly}
            ref={markerRef}
            icon={createCustomIcon('#0259bb')}
            eventHandlers={{
              dragend: handleMarkerDragEnd,
            } as any}
          >
            <Popup>
              <div className="text-center">
                <p className="font-medium text-gray-900 dark:text-gray-100">Property Location</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {position[0].toFixed(6)}, {position[1].toFixed(6)}
                </p>
                {!readOnly && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Drag marker to adjust location
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Instructions Overlay */}
      {!readOnly && (
        <div className="absolute top-2 left-2 bg-white dark:bg-gray-800/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg text-xs text-gray-700 dark:text-gray-300 z-[1000] max-w-[220px] border border-gray-200 dark:border-gray-700">
          <p className="font-medium mb-1 flex items-center gap-1">
            <MapPinIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            Click on map or use current location
          </p>
        </div>
      )}

      {/* Current Location Button - Top Right Corner */}
      {!readOnly && (
        <button
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="absolute top-2 right-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 w-10 h-10 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-[1000] flex items-center justify-center transition-all hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          title="Use my current location"
          aria-label="Get current location"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-600 border-t-transparent"></div>
          ) : (
            <svg
              className="w-5 h-5 text-primary-600 dark:text-primary-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          )}
        </button>
      )}

      {/* Confirm Location Button - Shows when location is manually changed */}
      {!readOnly && showConfirmButton && isLocationChanged && pendingLocation && (
        <button
          onClick={handleConfirmLocation}
          className="absolute bottom-2 right-2 bg-primary-600 dark:bg-primary-500 hover:bg-primary-700 dark:hover:bg-primary-600 text-white px-4 py-2 rounded-lg shadow-lg border border-primary-700 dark:border-primary-600 z-[1000] flex items-center gap-2 text-sm font-medium transition-all hover:shadow-xl"
          title="Confirm this location"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Confirm Location
        </button>
      )}

      {readOnly && (
        <div className="absolute top-2 left-2 bg-white dark:bg-gray-800/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg text-xs text-gray-700 dark:text-gray-300 z-[1000] border border-gray-200 dark:border-gray-700">
          <p className="font-medium">Property Location</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="absolute top-2 right-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-3 py-2 rounded-lg shadow-lg text-xs z-[1000] max-w-[250px]">
          <p className="font-medium">⚠️ {error}</p>
        </div>
      )}

      {/* Coordinates Display */}
      {position[0] !== defaultCenter[0] || position[1] !== defaultCenter[1] ? (
        <div className="absolute bottom-2 left-2 bg-white dark:bg-gray-800/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg text-xs text-gray-700 dark:text-gray-300 z-[1000] border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-green-600 dark:text-green-400 mb-1">✅ Location Set</p>
          <p className="text-xs font-mono">
            {position[0].toFixed(6)}, {position[1].toFixed(6)}
          </p>
        </div>
      ) : null}
    </div>
  )
}
