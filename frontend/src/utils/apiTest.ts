/// <reference types="vite/client" />

/**
 * API Test Utility
 * This file can be used for testing API endpoints
 */

// The types are now properly defined in vite-env.d.ts
// import.meta.env should work without errors

export const testApiUrl = () => {
  // Access environment variables with proper typing
  const apiUrl = import.meta.env.VITE_API_URL
  const isProd = import.meta.env.PROD
  const mode = import.meta.env.MODE
  
  return {
    apiUrl,
    isProd,
    mode,
  }
}
