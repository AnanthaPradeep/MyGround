import { Language } from '../types/language'

/**
 * Format number according to locale
 */
export const formatNumber = (value: number, locale: string = 'en-IN'): string => {
  try {
    return new Intl.NumberFormat(locale).format(value)
  } catch (error) {
    return value.toString()
  }
}

/**
 * Format currency according to locale and currency code
 */
export const formatCurrency = (
  value: number,
  currencyCode: string = 'INR',
  locale: string = 'en-IN'
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
    }).format(value)
  } catch (error) {
    return `${currencyCode} ${value}`
  }
}

/**
 * Format date according to locale
 */
export const formatDate = (date: Date | string, locale: string = 'en-IN', options?: Intl.DateTimeFormatOptions): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return new Intl.DateTimeFormat(locale, options || defaultOptions).format(dateObj)
  } catch (error) {
    return date.toString()
  }
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: Date | string, locale: string = 'en-IN'): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
    const seconds = Math.floor((dateObj.getTime() - Date.now()) / 1000)
    
    if (Math.abs(seconds) < 60) return rtf.format(seconds, 'second')
    const minutes = Math.floor(seconds / 60)
    if (Math.abs(minutes) < 60) return rtf.format(minutes, 'minute')
    const hours = Math.floor(minutes / 60)
    if (Math.abs(hours) < 24) return rtf.format(hours, 'hour')
    const days = Math.floor(hours / 24)
    if (Math.abs(days) < 30) return rtf.format(days, 'day')
    const months = Math.floor(days / 30)
    if (Math.abs(months) < 12) return rtf.format(months, 'month')
    const years = Math.floor(months / 12)
    return rtf.format(years, 'year')
  } catch (error) {
    return date.toString()
  }
}

/**
 * Get locale string from language code
 */
export const getLocaleString = (language: Language | null): string => {
  if (!language) return 'en-IN'
  
  // Map language codes to locale strings
  const localeMap: Record<string, string> = {
    en: 'en-IN',
    hi: 'hi-IN',
    bn: 'bn-IN',
    te: 'te-IN',
    mr: 'mr-IN',
    ta: 'ta-IN',
    ur: 'ur-IN',
    gu: 'gu-IN',
    kn: 'kn-IN',
    or: 'or-IN',
    pa: 'pa-IN',
    as: 'as-IN',
    ml: 'ml-IN',
    ar: 'ar-AE',
    zh: 'zh-CN',
    es: 'es-ES',
    fr: 'fr-FR',
    de: 'de-DE',
    ja: 'ja-JP',
    ko: 'ko-KR',
    pt: 'pt-PT',
    ru: 'ru-RU',
    th: 'th-TH',
  }
  
  return localeMap[language.languageCode] || `${language.languageCode}-${language.country}`
}

