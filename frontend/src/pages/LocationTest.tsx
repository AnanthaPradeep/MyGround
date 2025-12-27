import { useState } from 'react'
import { useLocationStore } from '../store/locationStore'
import MapPicker from '../components/MapPicker'
import LocationAutocomplete from '../components/LocationAutocomplete'
import { LocationSuggestion } from '../components/LocationAutocomplete'

/**
 * Location Test Page
 * Use this page to test and debug location functionality
 * Access at: /location-test
 */
export default function LocationTest() {
  const { userLocation, setLocation, clearLocation, isLocationSet } = useLocationStore()
  const [testLat, setTestLat] = useState(19.0760)
  const [testLng, setTestLng] = useState(72.8777)
  const [selectedLocation, setSelectedLocation] = useState<LocationSuggestion | null>(null)

  const handleMapChange = (lat: number, lng: number) => {
    console.log('📍 TEST: Map location changed to', lat, lng)
    setTestLat(lat)
    setTestLng(lng)
  }

  const handleLocationSelect = (location: LocationSuggestion | null) => {
    console.log('📍 TEST: Location selected', location)
    setSelectedLocation(location)
    if (location?.coordinates) {
      setTestLat(location.coordinates.lat)
      setTestLng(location.coordinates.lng)
    }
  }

  const handleSaveLocation = () => {
    if (selectedLocation || (testLat && testLng)) {
      const userLocation = {
        city: selectedLocation?.city || 'Test City',
        state: selectedLocation?.state || 'Test State',
        country: selectedLocation?.country || 'India',
        area: selectedLocation?.area,
        locality: selectedLocation?.area || selectedLocation?.city || 'Test Locality',
        pincode: selectedLocation?.pincode,
        coordinates: {
          lat: testLat,
          lng: testLng,
        },
        displayName: selectedLocation?.displayName || `${testLat.toFixed(4)}, ${testLng.toFixed(4)}`,
      }
      setLocation(userLocation)
      alert('Location saved! Check header to see it.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Location Setup Test Page</h1>
          <p className="text-gray-600 mb-4">
            Use this page to test location functionality. Check browser console (F12) for debug logs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Current Stored Location</h3>
              {isLocationSet && userLocation ? (
                <div className="text-sm">
                  <p><strong>City:</strong> {userLocation.city}</p>
                  <p><strong>State:</strong> {userLocation.state}</p>
                  <p><strong>Coordinates:</strong> {userLocation.coordinates?.lat.toFixed(6)}, {userLocation.coordinates?.lng.toFixed(6)}</p>
                  <p><strong>Display:</strong> {userLocation.displayName}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-600">No location set</p>
              )}
              <button
                onClick={clearLocation}
                className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Clear Location
              </button>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Test Coordinates</h3>
              <div className="text-sm space-y-1">
                <p><strong>Latitude:</strong> {testLat.toFixed(6)}</p>
                <p><strong>Longitude:</strong> {testLng.toFixed(6)}</p>
                {selectedLocation && (
                  <>
                    <p><strong>Selected:</strong> {selectedLocation.displayName}</p>
                    <p><strong>City:</strong> {selectedLocation.city}, {selectedLocation.state}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Location Search
              </label>
              <LocationAutocomplete
                value={selectedLocation?.displayName || ''}
                onChange={handleLocationSelect}
                placeholder="Search for a location..."
                onCoordinatesChange={handleMapChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Map Click (Click anywhere on map)
              </label>
              <div className="border-2 border-primary-300 rounded-lg overflow-hidden">
                <MapPicker
                  latitude={testLat}
                  longitude={testLng}
                  onLocationChange={handleMapChange}
                  height="500px"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleSaveLocation}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
              >
                Save Test Location
              </button>
              <button
                onClick={() => {
                  console.log('📍 Current test state:', { testLat, testLng, selectedLocation, userLocation })
                }}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
              >
                Log State to Console
              </button>
            </div>
          </div>

          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-2">Debug Instructions</h3>
            <ol className="list-decimal list-inside text-sm text-yellow-800 space-y-1">
              <li>Open browser console (F12)</li>
              <li>Click on the map - you should see "📍 TEST: Map location changed"</li>
              <li>Search for a location - you should see "📍 TEST: Location selected"</li>
              <li>Check if coordinates update in real-time</li>
              <li>Click "Save Test Location" and check header</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

