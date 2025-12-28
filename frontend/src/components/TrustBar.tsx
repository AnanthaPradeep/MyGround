import { CheckBadgeIcon, ShieldCheckIcon, MapPinIcon, LockClosedIcon } from '@heroicons/react/24/solid'

export default function TrustBar() {
  const trustFeatures = [
    { icon: CheckBadgeIcon, text: 'RERA Verified' },
    { icon: ShieldCheckIcon, text: 'Asset DNA Powered' },
    { icon: MapPinIcon, text: 'Geo-Verified' },
    { icon: LockClosedIcon, text: 'Secure Payments' },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap justify-center items-center gap-8">
          {trustFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="flex items-center space-x-2">
                <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{feature.text}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

