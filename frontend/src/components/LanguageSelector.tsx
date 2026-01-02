import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline'
import { useLanguages } from '../hooks/useLanguages'
import { useLanguageStore } from '../store/languageStore'
import { changeLanguage } from '../config/i18n'
import { Language } from '../types/language'

interface LanguageSelectorProps {
  className?: string
  variant?: 'dropdown' | 'full' // 'dropdown' for header, 'full' for settings page
}

export default function LanguageSelector({ className = '', variant = 'dropdown' }: LanguageSelectorProps) {
  const { t } = useTranslation()
  const { languages, loading } = useLanguages({ useSampleData: false })
  const { selectedLanguage, setLanguage } = useLanguageStore()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleLanguageSelect = async (language: Language) => {
    try {
      // Change language in i18next
      await changeLanguage(language)
      
      // Update store
      setLanguage(language)
      
      // Language preference is saved in localStorage via the store
      // Backend user preferences can be added later if needed
      
      setIsOpen(false)
      
      // Trigger page reload for full language change (optional, can be removed for instant change)
      // window.location.reload()
    } catch (error) {
      console.error('Error changing language:', error)
    }
  }

  // Group languages by country
  const languagesByCountry = languages.languagesByCountry || {}
  const countryNames: Record<string, string> = {
    IN: 'India',
    AE: 'United Arab Emirates',
    CN: 'China',
    ES: 'Spain',
    FR: 'France',
    DE: 'Germany',
    JP: 'Japan',
    KR: 'South Korea',
    PT: 'Portugal',
    RU: 'Russia',
    TH: 'Thailand',
    US: 'United States',
  }

  if (loading && variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <div className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 animate-pulse">
          {t('common.loading', 'Loading...')}
        </div>
      </div>
    )
  }

  const currentLang = selectedLanguage || languages.defaultLanguage || languages.languages[0]

  if (variant === 'full') {
    // Full selector for settings page
    return (
      <div className={className}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Language Preference
        </label>
        <div className="space-y-6">
          {Object.entries(languagesByCountry).map(([countryCode, countryLanguages]) => (
            <div key={countryCode}>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                {countryNames[countryCode] || countryCode}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {countryLanguages.map((language) => (
                  <button
                    key={language.languageCode}
                    onClick={() => handleLanguageSelect(language)}
                    className={`flex items-center justify-between p-4 border-2 rounded-lg text-left transition-colors ${
                      currentLang?.languageCode === language.languageCode
                        ? 'border-primary-600 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="font-medium text-base">{language.languageNameNative}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {language.languageNameEnglish}
                      </div>
                    </div>
                    {currentLang?.languageCode === language.languageCode && (
                      <CheckIcon className="w-5 h-5 text-primary-600 dark:text-primary-400 ml-2 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Dropdown selector for header
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        aria-label="Select language"
      >
        <span className="font-medium">{currentLang?.languageNameNative || currentLang?.languageNameEnglish || 'EN'}</span>
        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Overlay for mobile */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown - Fixed positioning on mobile, absolute on desktop */}
          <div className="fixed lg:absolute left-2 right-2 lg:left-auto lg:right-0 top-1/2 lg:top-auto lg:translate-y-0 -translate-y-1/2 w-[calc(100vw-2rem)] lg:w-72 max-w-[340px] lg:max-w-[18rem] mt-0 lg:mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-[85vh] lg:max-h-[32rem] overflow-y-auto scrollbar-hide">
            <div className="p-4">
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Select Language
              </div>
              <div className="space-y-4">
                {Object.entries(languagesByCountry).map(([countryCode, countryLanguages]) => (
                  <div key={countryCode}>
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                      {countryNames[countryCode] || countryCode}
                    </h3>
                    <div className="space-y-1">
                      {countryLanguages.map((language) => (
                        <button
                          key={language.languageCode}
                          onClick={() => handleLanguageSelect(language)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                            currentLang?.languageCode === language.languageCode
                              ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <div>
                            <div className="font-medium text-sm">{language.languageNameNative}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {language.languageNameEnglish}
                            </div>
                          </div>
                          {currentLang?.languageCode === language.languageCode && (
                            <CheckIcon className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

