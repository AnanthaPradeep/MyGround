/**
 * Consent Manager for MyGround
 * Manages user cookie consent preferences with GDPR compliance
 */

import { getConsentCookie, setConsentCookie, ConsentPreferences, hasConsent } from './cookies'

// Re-export ConsentPreferences type for convenience
export type { ConsentPreferences }

/**
 * Default consent preferences (only essential cookies)
 */
const DEFAULT_CONSENT: ConsentPreferences = {
  essential: true,
  analytics: false,
  marketing: false,
  functional: false,
  timestamp: new Date().toISOString(),
}

/**
 * Get current consent preferences or return defaults
 */
export const getConsentPreferences = (): ConsentPreferences => {
  const consent = getConsentCookie()
  return consent || DEFAULT_CONSENT
}

/**
 * Set consent preferences
 */
export const setConsentPreferences = (preferences: Partial<ConsentPreferences>): void => {
  const current = getConsentPreferences()
  const updated: ConsentPreferences = {
    ...current,
    ...preferences,
    timestamp: new Date().toISOString(),
    essential: true, // Essential cookies cannot be disabled
  }
  setConsentCookie(updated)
}

/**
 * Accept all consent preferences
 */
export const acceptAllConsent = (): void => {
  setConsentPreferences({
    essential: true,
    analytics: true,
    marketing: true,
    functional: true,
  })
}

/**
 * Accept only essential cookies
 */
export const acceptEssentialOnly = (): void => {
  setConsentPreferences({
    essential: true,
    analytics: false,
    marketing: false,
    functional: false,
  })
}

/**
 * Check if analytics can be used (requires consent)
 */
export const canUseAnalytics = (): boolean => {
  return hasConsent('analytics')
}

/**
 * Check if marketing cookies can be used (requires consent)
 */
export const canUseMarketing = (): boolean => {
  return hasConsent('marketing')
}

/**
 * Check if functional cookies can be used (requires consent)
 */
export const canUseFunctional = (): boolean => {
  return hasConsent('functional')
}

/**
 * Check if user has given any consent (including just essential)
 */
export const hasAnyConsent = (): boolean => {
  const consent = getConsentCookie()
  return consent !== null
}

/**
 * Initialize analytics if consent is given
 * This should be called after consent is set
 */
export const initializeAnalyticsIfConsented = (): void => {
  if (canUseAnalytics()) {
    // Initialize analytics services here (e.g., Google Analytics)
    // Example:
    // if (typeof window !== 'undefined' && window.gtag) {
    //   window.gtag('consent', 'update', {
    //     analytics_storage: 'granted',
    //   })
    // }
  }
}

