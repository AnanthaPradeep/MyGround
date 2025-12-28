import { useState, useEffect } from 'react'
import { WifiIcon, ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface NetworkErrorProps {
  onRetry?: () => void
  message?: string
  showRetry?: boolean
}

/**
 * Network Error Component
 * Displays when network requests fail or user is offline
 */
export default function NetworkError({ 
  onRetry, 
  message = 'Unable to connect to the server. Please check your internet connection.',
  showRetry = true 
}: NetworkErrorProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <WifiIcon className="w-6 h-6 text-red-600" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-red-800 mb-1">Network Error</h3>
          <p className="text-sm text-red-700 mb-3">{message}</p>
          {showRetry && onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              <ArrowPathIcon className="w-4 h-4" />
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Offline Indicator Component
 * Shows when user is offline
 */
export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white px-4 py-2 text-center text-sm font-medium z-50">
      <div className="flex items-center justify-center gap-2">
        <ExclamationTriangleIcon className="w-4 h-4" />
        <span>You're currently offline. Some features may not work.</span>
      </div>
    </div>
  )
}

