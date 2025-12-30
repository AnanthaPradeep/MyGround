/**
 * Reverse Geocoding using OpenStreetMap Nominatim API
 * Converts coordinates to address
 */
export const reverseGeocode = async (lat: number, lng: number): Promise<{
  address: string
  city: string
  state: string
  country: string
  pincode?: string
  area?: string
  locality?: string
} | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?` +
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
    
    if (data && data.address) {
      const address = data.address
      
      return {
        address: data.display_name || '',
        city: address.city || address.town || address.village || address.county || '',
        state: address.state || '',
        country: address.country || 'India',
        pincode: address.postcode || undefined,
        area: address.suburb || address.neighbourhood || address.locality || undefined,
        locality: address.locality || address.suburb || undefined,
      }
    }
    
    return null
  } catch (error) {
    console.error('📍 Reverse geocoding error:', error)
    return null
  }
}

/**
 * Get current location using browser Geolocation API
 * Then reverse geocode to get address details
 * 
 * @param initialLat - Optional: If provided, uses these coordinates instead of getting current position
 * @param initialLng - Optional: If provided, uses these coordinates instead of getting current position
 */
export const getCurrentLocationWithAddress = async (
  initialLat?: number,
  initialLng?: number
): Promise<{
  lat: number
  lng: number
  address?: string
  city?: string
  state?: string
  country?: string
  pincode?: string
  area?: string
  locality?: string
} | null> => {
  // If coordinates are provided, just reverse geocode them
  if (initialLat !== undefined && initialLng !== undefined) {
    try {
      const addressData = await reverseGeocode(initialLat, initialLng)
      return {
        lat: initialLat,
        lng: initialLng,
        ...addressData,
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error)
      return {
        lat: initialLat,
        lng: initialLng,
      }
    }
  }
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'))
      return
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          
          // Reverse geocode to get address
          const addressData = await reverseGeocode(latitude, longitude)
          
          resolve({
            lat: latitude,
            lng: longitude,
            ...addressData,
          })
        } catch (error) {
          // Even if reverse geocoding fails, return coordinates
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        }
      },
      (error) => {
        let errorMessage = 'Unable to get your location'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.'
            break
        }
        
        reject(new Error(errorMessage))
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    )
  })
}
