import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import type { Language } from '../types/language'
import api from '../services/api'

// Default namespace
const defaultNamespace = 'common'

// Fallback translation resources (minimal English)
const fallbackResources = {
  en: {
    common: {
      welcome: 'Welcome',
      loading: 'Loading...',
      error: 'An error occurred',
      retry: 'Retry',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      close: 'Close',
      next: 'Next',
      previous: 'Previous',
      submit: 'Submit',
      back: 'Back',
      home: 'Home',
      settings: 'Settings',
      profile: 'Profile',
      logout: 'Logout',
      login: 'Login',
      register: 'Register',
      language: 'Language',
      selectLanguage: 'Select Language',
    },
  },
}

// Get saved language from localStorage (from our custom store)
const getSavedLanguageCode = (): string => {
  try {
    const saved = localStorage.getItem('myground-language-storage')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed?.state?.selectedLanguage?.languageCode) {
        return parsed.state.selectedLanguage.languageCode
      }
    }
  } catch (error) {
    console.warn('Failed to parse saved language:', error)
  }
  return 'en'
}

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    resources: fallbackResources,
    lng: getSavedLanguageCode(), // Use saved language or default to 'en'
    fallbackLng: 'en',
    defaultNS: defaultNamespace,
    ns: [defaultNamespace],
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false, // Disable suspense for better UX
    },
    debug: false,
  })

// Function to load translations from backend
const loadTranslationsFromBackend = async (languageCode: string): Promise<Record<string, Record<string, string>> | null> => {
  try {
    const response = await api.get(`/languages/${languageCode}/translations`)
    if (response.data.success && response.data.data?.resources) {
      return response.data.data.resources
    }
    return null
  } catch (error) {
    console.warn(`Failed to load translations for ${languageCode} from backend, using fallback`, error)
    return null
  }
}

// Function to change language and apply RTL
export const changeLanguage = async (language: Language) => {
  try {
    // Load translations from backend
    const translations = await loadTranslationsFromBackend(language.languageCode)
    
    if (translations) {
      // Add translations to i18n resources (merge = true, deep = true to update existing)
      Object.keys(translations).forEach((namespace) => {
        i18n.addResourceBundle(language.languageCode, namespace, translations[namespace], true, true)
      })
    }
    
    // Change language in i18next - this will trigger re-renders in all components using useTranslation
    await i18n.changeLanguage(language.languageCode)
    
    // Apply RTL/LTR direction to HTML element
    const html = document.documentElement
    html.setAttribute('dir', language.direction)
    html.setAttribute('lang', language.languageCode)
    
    return true
  } catch (error) {
    console.error('Error changing language:', error)
    // Fallback: still change language code even if translations fail
    try {
      await i18n.changeLanguage(language.languageCode)
      const html = document.documentElement
      html.setAttribute('dir', language.direction)
      html.setAttribute('lang', language.languageCode)
    } catch (fallbackError) {
      console.error('Fallback language change also failed:', fallbackError)
    }
    return false
  }
}

// Initialize language on module load
export const initializeLanguage = async () => {
  try {
    const saved = localStorage.getItem('myground-language-storage')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed?.state?.selectedLanguage) {
        const language: Language = parsed.state.selectedLanguage
        await changeLanguage(language)
      }
    } else {
      // Use default English
      const defaultLanguage: Language = {
        languageCode: 'en',
        languageNameEnglish: 'English',
        languageNameNative: 'English',
        country: 'IN',
        direction: 'ltr',
        isDefault: true,
      }
      await changeLanguage(defaultLanguage)
    }
  } catch (error) {
    console.error('Error initializing language:', error)
    // Ensure HTML attributes are set even if language change fails
    const html = document.documentElement
    html.setAttribute('dir', 'ltr')
    html.setAttribute('lang', 'en')
  }
}

// Function to get current language direction
export const getCurrentDirection = (): 'ltr' | 'rtl' => {
  const html = document.documentElement
  return (html.getAttribute('dir') as 'ltr' | 'rtl') || 'ltr'
}

export default i18n

