import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Language } from '../types/language'

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

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      selectedLanguage: defaultLanguage,
      setLanguage: (language) => set({ selectedLanguage: language }),
      clearLanguage: () => set({ selectedLanguage: defaultLanguage }),
    }),
    {
      name: 'myground-language-storage',
    }
  )
)

