import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Language } from '../types/language'
import { getLanguageCookie, setLanguageCookie } from '../utils/cookies'

interface LanguageState {
  selectedLanguage: Language | null
  setLanguage: (language: Language) => void
  clearLanguage: () => void
}

const defaultLanguage: Language = {
  languageCode: 'en',
  languageNameEnglish: 'English',
  languageNameNative: 'English',
  country: 'IN',
  direction: 'ltr',
  isDefault: true,
}

// Get initial language from cookie or default
const getInitialLanguage = (): Language | null => {
  if (typeof window === 'undefined') return defaultLanguage
  
  // Check cookie first
  const cookieLangCode = getLanguageCookie()
  if (cookieLangCode) {
    // Try to get full language object from localStorage (backup)
    try {
      const saved = localStorage.getItem('myground-language-storage')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed?.state?.selectedLanguage) {
          return parsed.state.selectedLanguage
        }
      }
    } catch {
      // Fallback to default if cookie code doesn't match stored language
    }
  }
  
  return defaultLanguage
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      selectedLanguage: getInitialLanguage(),
      setLanguage: (language) => {
        // Save to cookie (primary) and Zustand persist (backup)
        setLanguageCookie(language.languageCode)
        set({ selectedLanguage: language })
      },
      clearLanguage: () => {
        setLanguageCookie(defaultLanguage.languageCode)
        set({ selectedLanguage: defaultLanguage })
      },
    }),
    {
      name: 'myground-language-storage',
    }
  )
)


