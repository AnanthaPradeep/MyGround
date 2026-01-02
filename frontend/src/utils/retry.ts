/**
 * Retry utility for API calls
 * Automatically retries failed requests with exponential backoff
 */

interface RetryOptions {
  maxRetries?: number
  initialDelay?: number
  maxDelay?: number
  backoffFactor?: number
  retryCondition?: (error: any) => boolean
}

const defaultOptions: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffFactor: 2,
  retryCondition: (error) => {
    // Retry on network errors or 5xx server errors
    if (!error.response) return true // Network error
    const status = error.response.status
    return status >= 500 && status < 600 // Server error
  },
}

/**
 * Sleep utility
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Retry a function with exponential backoff
 * 
 * @param fn - Function to retry (should return a Promise)
 * @param options - Retry configuration options
 * @returns Promise that resolves with the function result
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const config = { ...defaultOptions, ...options }
  let lastError: any

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error: any) {
      lastError = error

      // Don't retry if condition says not to
      if (!config.retryCondition(error)) {
        throw error
      }

      // Don't retry on last attempt
      if (attempt === config.maxRetries) {
        break
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        config.initialDelay * Math.pow(config.backoffFactor, attempt),
        config.maxDelay
      )

      // Wait before retrying
      await sleep(delay)
    }
  }

  throw lastError
}

/**
 * Create a retry wrapper for axios requests
 */
export function withRetry<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options?: RetryOptions
): T {
  return ((...args: Parameters<T>) => {
    return retry(() => fn(...args), options)
  }) as T
}




