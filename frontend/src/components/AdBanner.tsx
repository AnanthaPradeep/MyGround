import { useEffect, useRef, useState } from 'react'

export type AdPlacement = 'homepage' | 'search' | 'property'
export type AdVariant = 'horizontal' | 'sidebar' | 'native' | 'vertical'

interface AdBannerProps {
  placement: AdPlacement
  variant: AdVariant
  imageUrl: string
  title: string
  description?: string
  ctaText: string
  ctaLink: string
}

const variantClasses: Record<AdVariant, string> = {
  horizontal: 'flex flex-col sm:flex-row gap-4 items-center',
  sidebar: 'flex flex-col gap-4',
  native: 'flex flex-col gap-4',
  vertical: 'flex flex-col gap-4',
}

const containerClasses: Record<AdVariant, string> = {
  horizontal: 'min-h-[140px] sm:min-h-[120px]',
  sidebar: 'min-h-[240px]',
  native: 'min-h-[240px]',
  vertical: 'min-h-[520px]',
}

const imageClasses: Record<AdVariant, string> = {
  horizontal: 'w-full sm:w-64 h-32 sm:h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700',
  sidebar: 'w-full h-40 object-cover rounded-lg border border-gray-200 dark:border-gray-700',
  native: 'w-full h-40 object-cover rounded-lg border border-gray-200 dark:border-gray-700',
  vertical: 'w-full h-[360px] object-cover rounded-lg border border-gray-200 dark:border-gray-700',
}

const imageDimensions: Record<AdVariant, { width: number; height: number }> = {
  horizontal: { width: 970, height: 180 },
  sidebar: { width: 600, height: 600 },
  native: { width: 600, height: 600 },
  vertical: { width: 300, height: 600 },
}

export default function AdBanner({
  placement,
  variant,
  imageUrl,
  title,
  description,
  ctaText,
  ctaLink,
}: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!containerRef.current || isVisible) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '120px' }
    )

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [isVisible])

  return (
    <div ref={containerRef} className="w-full" aria-label="Sponsored advertisement">
      <div
        className={`relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-5 ${
          variantClasses[variant]
        } ${containerClasses[variant]}`}
        data-placement={placement}
      >
        <div className="absolute right-3 top-3">
          <span className="text-[10px] uppercase tracking-wide text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
            Sponsored
          </span>
        </div>

        {isVisible ? (
          <img
            src={imageUrl}
            alt={`${title} sponsored ad`}
            loading="lazy"
            className={imageClasses[variant]}
            width={imageDimensions[variant].width}
            height={imageDimensions[variant].height}
          />
        ) : (
          <div
            className={`${imageClasses[variant]} bg-gray-100 dark:bg-gray-700 animate-pulse`}
            aria-hidden="true"
          />
        )}

        <div className="flex-1">
          <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {title}
          </p>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {description}
            </p>
          )}
          <a
            href={ctaLink}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg border border-primary-600 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            aria-label={`${ctaText} (opens in a new tab)`}
          >
            {ctaText}
          </a>
        </div>
      </div>
    </div>
  )
}
