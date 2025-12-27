import { GOOGLE_MAPS_CONFIG } from '../config/googleMaps'

/**
 * Reverse Geocoding using Google Geocoding API
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
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_CONFIG.apiKey}`
    )
    
    const data = await response.json()
    
    console.log('📍 Reverse geocoding response:', data.status, data.results?.length || 0, 'results')
    
    if (data.status === 'OK' && data.results.length > 0) {
      const result = data.results[0]
      const addressComponents = result.address_components
      
      let city = ''
      let state = ''
      let country = 'India'
      let pincode = ''
      let area = ''
      let locality = ''
      
      addressComponents.forEach((component: any) => {
        const types = component.types
        
        // Priority order for area/locality
        if (types.includes('sublocality_level_1') || types.includes('sublocality_level_2') || types.includes('sublocality')) {
          if (!area) area = component.long_name
          if (!locality) locality = component.long_name
        }
        
        // City/Locality
        if (types.includes('locality')) {
          city = component.long_name
          if (!area) area = component.long_name // Use city as area if no sublocality
        }
        
        // Administrative area level 2 (district)
        if (types.includes('administrative_area_level_2')) {
          if (!city) city = component.long_name
        }
        
        // State
        if (types.includes('administrative_area_level_1')) {
          state = component.long_name
        }
        
        // Country
        if (types.includes('country')) {
          country = component.long_name
        }
        
        // Pincode
        if (types.includes('postal_code')) {
          pincode = component.long_name
        }
        
        // Neighborhood (can be used as area)
        if (types.includes('neighborhood') && !area) {
          area = component.long_name
        }
      })
      
      // Fallback: if no area found, use city or first available component
      if (!area && !locality) {
        const sublocality = addressComponents.find((c: any) => 
          c.types.some((t: string) => t.includes('sublocality') || t.includes('neighborhood'))
        )
        if (sublocality) {
          area = sublocality.long_name
          locality = sublocality.long_name
        } else if (city) {
          area = city
          locality = city
        } else {
          // Use first component as fallback
          const firstComponent = addressComponents[0]
          if (firstComponent) {
            area = firstComponent.long_name
            locality = firstComponent.long_name
          }
        }
      }
      
      const finalArea = area || locality || city
      const finalLocality = locality || area || city
      
      console.log('📍 Extracted address components:', {
        area: finalArea,
        locality: finalLocality,
        city,
        state,
        country,
        pincode: pincode || undefined,
        formatted_address: result.formatted_address
      })
      
      return {
        address: result.formatted_address,
        city: city || addressComponents.find((c: any) => c.types.includes('administrative_area_level_2'))?.long_name || '',
        state: state || '',
        country,
        pincode: pincode || undefined,
        area: finalArea || undefined,
        locality: finalLocality || undefined,
      }
    } else {
      console.warn('📍 Reverse geocoding failed:', data.status, data.error_message || 'No results')
      if (data.status === 'REQUEST_DENIED') {
        console.error('📍 Geocoding API request denied. Check API key and billing status.')
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

