import { useState } from 'react'
import { PhotoIcon } from '@heroicons/react/24/outline'

interface ImageWithFallbackProps {
  src: string
  alt: string
  fallbackSrc?: string
  className?: string
  placeholder?: React.ReactNode
  onError?: () => void
}

/**
 * Image Component with Fallback Support
 * Automatically falls back to placeholder or alternative image on error
 */
export default function ImageWithFallback({
  src,
  alt,
  fallbackSrc,
  className = '',
  placeholder,
  onError,
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleError = () => {
    if (!hasError && fallbackSrc && imgSrc !== fallbackSrc) {
      // Try fallback image
      setImgSrc(fallbackSrc)
      setHasError(false) // Reset to try fallback
    } else {
      // Both original and fallback failed
      setHasError(true)
      setIsLoading(false)
      if (onError) {
        onError()
      }
    }
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  if (hasError) {
    // Show placeholder if image fails to load
    if (placeholder) {
      return <>{placeholder}</>
    }

    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <PhotoIcon className="w-12 h-12 text-gray-400" />
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <PhotoIcon className="w-8 h-8 text-gray-400" />
        </div>
      )}
      <img
        src={imgSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}




