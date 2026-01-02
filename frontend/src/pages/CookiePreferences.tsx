/**
 * Cookie Preferences Page
 * Allows users to manage their cookie consent preferences
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CheckIcon } from '@heroicons/react/24/outline'
import Logo from '../components/Logo'
import Footer from '../components/Footer'
import { getConsentPreferences, setConsentPreferences, acceptAllConsent, acceptEssentialOnly, ConsentPreferences } from '../utils/consentManager'
import toast from 'react-hot-toast'

export default function CookiePreferences() {
  const [preferences, setPreferences] = useState<ConsentPreferences | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const current = getConsentPreferences()
    setPreferences(current)
  }, [])

  const handlePreferenceChange = (category: keyof Omit<ConsentPreferences, 'timestamp'>, value: boolean) => {
    if (!preferences) return
    if (category === 'essential') return // Essential cannot be disabled
    
    setPreferences({
      ...preferences,
      [category]: value,
    })
    setSaved(false)
  }

  const handleSave = () => {
    if (!preferences) return
    
    setConsentPreferences(preferences)
    setSaved(true)
    toast.success('Cookie preferences saved successfully')
    
    // Scroll to top to show success message
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAcceptAll = () => {
    acceptAllConsent()
    const updated = getConsentPreferences()
    setPreferences(updated)
    setSaved(true)
    toast.success('All cookies enabled')
  }

  const handleAcceptEssential = () => {
    acceptEssentialOnly()
    const updated = getConsentPreferences()
    setPreferences(updated)
    setSaved(true)
    toast.success('Essential cookies only enabled')
  }

  if (!preferences) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/" className="flex items-center">
            <Logo showText={true} size="md" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sm:p-8">
          {/* Success Message */}
          {saved && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
              <CheckIcon className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <p className="text-sm text-green-800 dark:text-green-200">
                Your cookie preferences have been saved successfully.
              </p>
            </div>
          )}

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-gray-100 mb-2">
              Cookie Preferences
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your cookie preferences. You can enable or disable different types of cookies below.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="mb-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAcceptAll}
              className="flex-1 px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors font-medium"
            >
              Accept All Cookies
            </button>
            <button
              onClick={handleAcceptEssential}
              className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              Essential Only
            </button>
          </div>

          {/* Cookie Categories */}
          <div className="space-y-6">
            {/* Essential Cookies */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Essential Cookies
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    These cookies are necessary for the website to function and cannot be disabled. They include authentication, security, and basic site functionality.
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                    <CheckIcon className="w-4 h-4" />
                    Always Active
                  </div>
                </div>
              </div>
            </div>

            {/* Functional Cookies */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Functional Cookies
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    These cookies enable enhanced functionality and personalization, such as remembering your language preference, theme settings, and location.
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.functional}
                      onChange={(e) => handlePreferenceChange('functional', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Analytics Cookies */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Analytics Cookies
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our services.
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => handlePreferenceChange('analytics', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Marketing Cookies */}
            <div className="pb-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Marketing Cookies
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    These cookies are used to deliver advertisements and track campaign performance. They may be set by our advertising partners to build a profile of your interests.
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => handlePreferenceChange('marketing', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-end">
            <Link
              to="/"
              className="px-6 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-center font-medium"
            >
              Cancel
            </Link>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors font-medium"
            >
              Save Preferences
            </button>
          </div>

          {/* Additional Information */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              For more information about how we use cookies and handle your data, please read our{' '}
              <Link to="/privacy" className="text-primary-600 dark:text-primary-400 hover:underline">
                Privacy Policy
              </Link>
              {' '}and{' '}
              <Link to="/terms" className="text-primary-600 dark:text-primary-400 hover:underline">
                Terms & Conditions
              </Link>
              .
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

