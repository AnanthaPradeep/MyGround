/**
 * Cookie Utilities for MyGround
 * Professional cookie management with security best practices
 */

import Cookies from 'js-cookie'

/**
 * Default cookie options for secure, production-ready cookies
 */
export const COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
}

/**
 * Language Cookie Management
 */
export const LANGUAGE_COOKIE_KEY = 'mg_language'

export const getLanguageCookie = (): string | undefined => {
  return Cookies.get(LANGUAGE_COOKIE_KEY)
}

export const setLanguageCookie = (language: string): void => {
  Cookies.set(LANGUAGE_COOKIE_KEY, language, {
    ...COOKIE_OPTIONS,
    expires: 365, // 1 year
  })
}

export const removeLanguageCookie = (): void => {
  Cookies.remove(LANGUAGE_COOKIE_KEY, { path: '/' })
}

/**
 * Theme Cookie Management
 */
export const THEME_COOKIE_KEY = 'mg_theme'

export const getThemeCookie = (): 'light' | 'dark' | undefined => {
  return Cookies.get(THEME_COOKIE_KEY) as 'light' | 'dark' | undefined
}

export const setThemeCookie = (theme: 'light' | 'dark'): void => {
  Cookies.set(THEME_COOKIE_KEY, theme, {
    ...COOKIE_OPTIONS,
    expires: 365, // 1 year
  })
}

export const removeThemeCookie = (): void => {
  Cookies.remove(THEME_COOKIE_KEY, { path: '/' })
}

/**
 * Consent Preferences Interface
 */
export interface ConsentPreferences {
  essential: boolean
  analytics: boolean
  marketing: boolean
  functional: boolean
  timestamp: string
}

/**
 * Consent Cookie Management
 */
export const CONSENT_COOKIE_KEY = 'mg_consent'

export const getConsentCookie = (): ConsentPreferences | null => {
  const consent = Cookies.get(CONSENT_COOKIE_KEY)
  if (!consent) return null
  try {
    return JSON.parse(consent) as ConsentPreferences
  } catch {
    return null
  }
}

export const setConsentCookie = (preferences: ConsentPreferences): void => {
  Cookies.set(CONSENT_COOKIE_KEY, JSON.stringify(preferences), {
    ...COOKIE_OPTIONS,
    expires: 365, // 1 year
  })
}

export const removeConsentCookie = (): void => {
  Cookies.remove(CONSENT_COOKIE_KEY, { path: '/' })
}

/**
 * Check if user has given consent for a specific category
 */
export const hasConsent = (category: keyof Omit<ConsentPreferences, 'timestamp'>): boolean => {
  const consent = getConsentCookie()
  if (!consent) return category === 'essential' // Essential cookies are always allowed
  return consent[category] || false
}

/**
 * Check if user has given any consent
 */
export const hasAnyConsent = (): boolean => {
  const consent = getConsentCookie()
  return consent !== null
}

