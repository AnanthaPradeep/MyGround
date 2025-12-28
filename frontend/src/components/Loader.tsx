import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton'
  text?: string
  fullScreen?: boolean
  className?: string
}

/**
 * Reusable Loader Component
 * Can be used throughout the application for consistent loading states
 */
export default function Loader({
  size = 'md',
  variant = 'spinner',
  text,
  fullScreen = false,
  className = '',
}: LoaderProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return (
          <div className={`${sizeClasses[size]} border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin`} />
        )
      
      case 'dots':
        return (
          <div className="flex items-center justify-center space-x-2">
            <div className={`${sizeClasses.sm} bg-primary-600 rounded-full animate-bounce`} style={{ animationDelay: '-0.32s' }}></div>
            <div className={`${sizeClasses.sm} bg-primary-600 rounded-full animate-bounce`} style={{ animationDelay: '-0.16s' }}></div>
            <div className={`${sizeClasses.sm} bg-primary-600 rounded-full animate-bounce`}></div>
          </div>
        )
      
      case 'pulse':
        return (
          <div className={`${sizeClasses[size]} bg-primary-600 rounded-full animate-pulse`} />
        )
      
      case 'skeleton':
        return (
          <div className="animate-pulse space-y-3 w-full">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        )
      
      default:
        return (
          <div className={`${sizeClasses[size]} border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin`} />
        )
    }
  }

  if (fullScreen) {
    return (
      <div className={`fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center ${className}`}>
        <div className="flex flex-col items-center justify-center space-y-4">
          {renderLoader()}
          {text && (
            <p className={`${textSizeClasses[size]} text-gray-600 font-medium`}>{text}</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      {renderLoader()}
      {text && (
        <p className={`${textSizeClasses[size]} text-gray-600 font-medium`}>{text}</p>
      )}
    </div>
  )
}

/**
 * Inline Loader - For buttons and small spaces
 */
export function InlineLoader({ size = 'sm', className = '' }: { size?: 'sm' | 'md'; className?: string }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
  }

  return (
    <div className={`${sizeClasses[size]} border-2 border-white border-t-transparent rounded-full animate-spin ${className}`} />
  )
}

/**
 * Page Loader - For full page loading states
 */
export function PageLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader size="lg" variant="spinner" text={text} />
      </div>
    </div>
  )
}

/**
 * Card Skeleton Loader - For property cards and list items
 */
export function CardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm animate-pulse">
          <div className="h-48 bg-gray-200 rounded-t-lg"></div>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </>
  )
}


