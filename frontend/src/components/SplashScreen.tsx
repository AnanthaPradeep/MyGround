import { useEffect, useState } from 'react'
import { logos } from '@/assets'

interface SplashScreenProps {
  onComplete?: () => void
  minDisplayTime?: number // Minimum time to show splash in ms
}

/**
 * Splash Screen Component with Logo and Loader Animation
 * Shows during initial page load and reload
 */
export default function SplashScreen({ onComplete, minDisplayTime = 1500 }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Ensure splash screen shows for minimum time
    const timer = setTimeout(() => {
      setIsVisible(false)
      if (onComplete) {
        // Small delay before calling onComplete for smooth transition
        setTimeout(onComplete, 300)
      }
    }, minDisplayTime)

    return () => clearTimeout(timer)
  }, [onComplete, minDisplayTime])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center transition-opacity duration-300">
      <div className="flex flex-col items-center justify-center space-y-8">
        {/* Logo */}
        <div className="animate-pulse">
          <img 
            src={logos.main || logos.png} 
            alt="MyGround Logo" 
            className="h-24 w-24 md:h-32 md:w-32 object-contain"
            onError={(e) => {
              // Fallback to PNG if SVG fails
              const target = e.target as HTMLImageElement
              if (target.src !== logos.png) {
                target.src = logos.png
              }
            }}
          />
        </div>

        {/* Loader Animation */}
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '-0.32s' }}></div>
          <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '-0.16s' }}></div>
          <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce"></div>
        </div>

        {/* Loading Text */}
        <p className="text-gray-600 text-sm md:text-base font-medium animate-pulse">
          Loading MyGround...
        </p>
      </div>
    </div>
  )
}

