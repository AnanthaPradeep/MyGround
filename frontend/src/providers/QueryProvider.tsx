/**
 * React Query Provider
 * Professional API caching and state management for MyGround
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

// Conditionally import devtools only in development
let ReactQueryDevtools: any = null
if (process.env.NODE_ENV === 'development') {
  try {
    const devtools = require('@tanstack/react-query-devtools')
    ReactQueryDevtools = devtools.ReactQueryDevtools
  } catch {
    // Devtools not installed, that's okay - will be handled gracefully
  }
}

// Create a singleton QueryClient instance
// This ensures the same client is used throughout the app
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Default stale time: 5 minutes
      // Data is considered fresh for 5 minutes, no refetch needed
      staleTime: 5 * 60 * 1000,
      
      // Default garbage collection time: 10 minutes
      // Data stays in cache for 10 minutes after last use
      gcTime: 10 * 60 * 1000,
      
      // Don't refetch on window focus (reduces unnecessary requests)
      refetchOnWindowFocus: false,
      
      // Refetch on reconnect (good for offline scenarios)
      refetchOnReconnect: true,
      
      // Retry failed requests once with 1 second delay
      retry: 1,
      retryDelay: 1000,
      
      // Don't refetch on mount if data exists (use cache first)
      refetchOnMount: false,
    },
    mutations: {
      // Don't retry mutations (they're usually not idempotent)
      retry: false,
    },
  },
})

interface QueryProviderProps {
  children: ReactNode
}

/**
 * QueryProvider Component
 * Wraps the app with React Query for intelligent API caching
 */
export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Show React Query DevTools in development (if installed) */}
      {process.env.NODE_ENV === 'development' && ReactQueryDevtools && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      )}
    </QueryClientProvider>
  )
}

// Export the queryClient for manual cache operations
export { queryClient }

