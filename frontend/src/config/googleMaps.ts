/**
 * Google Maps API Configuration
 * 
 * API Keys can be set via environment variables:
 * - VITE_GOOGLE_MAPS_API_KEY: For Google Maps JavaScript API
 * - VITE_GOOGLE_GEOLOCATION_API_KEY: For Google Geolocation API (optional)
 * 
 * To update API keys:
 * 1. Create a .env file in the frontend directory
 * 2. Add: VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
 * 3. Restart the development server
 */
export const GOOGLE_MAPS_API_KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || ''
export const GOOGLE_GEOLOCATION_API_KEY = (import.meta.env.VITE_GOOGLE_GEOLOCATION_API_KEY as string) || ''

export const GOOGLE_MAPS_CONFIG = {
  apiKey: GOOGLE_MAPS_API_KEY,
  geolocationApiKey: GOOGLE_GEOLOCATION_API_KEY,
  libraries: ['places', 'geometry'] as const,
  version: 'weekly',
}

// Validate API key is set
if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === '') {
  console.warn('⚠️ Google Maps API key is not set. Please set VITE_GOOGLE_MAPS_API_KEY in your .env file')
}

