import { CURRENCIES } from '../constants/propertyTypes'

/**
 * Format price with currency symbol
 */
export const formatPrice = (amount?: number, currency: string = 'INR'): string => {
  if (!amount) return 'Price on request'
  
  const currencyInfo = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0]
  return `${currencyInfo.symbol} ${amount.toLocaleString('en-IN')}`
}

/**
 * Format currency code to symbol
 */
export const getCurrencySymbol = (currency: string = 'INR'): string => {
  const currencyInfo = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0]
  return currencyInfo.symbol
}

/**
 * Format date to readable string
 */
export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Format date to relative time (e.g., "2 days ago")
 */
export const formatRelativeTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`
  return `${Math.floor(diffInSeconds / 31536000)} years ago`
}

/**
 * Format number with commas
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString('en-IN')
}

/**
 * Format area with unit
 */
export const formatArea = (area: number, unit: string): string => {
  return `${formatNumber(area)} ${unit.toLowerCase()}`
}



