import { Link } from 'react-router-dom'
import { logos } from '@/assets'

interface LogoProps {
  className?: string
  showText?: boolean
  variant?: 'default' | 'white' | 'icon'
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Logo component for MyGround
 * 
 * Usage:
 * <Logo />
 * <Logo variant="white" />
 * <Logo showText={false} size="lg" />
 */
export default function Logo({ 
  className = '', 
  showText = false, 
  variant = 'default',
  size = 'md'
}: LogoProps) {
  const logoSrc = logos.main || logos.png
  
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <Link to="/" className={`flex items-center gap-1 sm:gap-2 ${className}`}>
      <img 
        src={logoSrc} 
        alt="MyGround Logo" 
        className={`${sizeClasses[size]} object-contain`}
        onError={(e) => {
          // Fallback to PNG if SVG fails
          const target = e.target as HTMLImageElement
          if (target.src !== logos.png) {
            target.src = logos.png
          }
        }}
      />
      {showText && (
        <div className="flex items-center">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-heading font-bold text-primary-600 dark:text-primary-400">MyGround</h1>
        </div>
      )}
    </Link>
  )
}

