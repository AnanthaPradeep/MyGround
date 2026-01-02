/**
 * Cookie Consent Banner Component
 * GDPR and India IT Act compliant cookie consent management
 */

import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { hasAnyConsent, acceptAllConsent, acceptEssentialOnly, initializeAnalyticsIfConsented } from '../utils/consentManager'

interface CookieBannerProps {
  className?: string
}

export default function CookieBanner({ className = '' }: CookieBannerProps) {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Show banner if consent not given
    if (!hasAnyConsent()) {
      setShowBanner(true)
    }
  }, [])

  const handleAcceptAll = () => {
    acceptAllConsent()
    initializeAnalyticsIfConsented()
    setShowBanner(false)
  }

  const handleAcceptEssential = () => {
    acceptEssentialOnly()
    setShowBanner(false)
  }

  const handleClose = () => {
    // Allow closing without accepting (but show again on next visit)
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-2xl z-[10000] p-4 sm:p-6 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  We use cookies
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  We use cookies to enhance your browsing experience, serve personalized content, analyze our traffic, and improve our services. 
                  By clicking "Accept All", you consent to our use of cookies.{' '}
                  <a 
                    href="/cookie-preferences" 
                    className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                  >
                    Manage preferences
                  </a>
                  {' or read our '}
                  <a 
                    href="/privacy" 
                    className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                  >
                    Privacy Policy
                  </a>
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-400 mt-2">
                  <span>Essential cookies: Always active</span>
                  <span>•</span>
                  <span>Analytics: Optional</span>
                  <span>•</span>
                  <span>Marketing: Optional</span>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close banner"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={handleAcceptEssential}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors whitespace-nowrap"
            >
              Essential Only
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 dark:bg-primary-500 rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors whitespace-nowrap"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

