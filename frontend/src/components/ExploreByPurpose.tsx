import { Link } from 'react-router-dom'
import { 
  HomeIcon, 
  BriefcaseIcon, 
  MapIcon, 
  BuildingOfficeIcon,
  KeyIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  ShoppingBagIcon,
  Cog6ToothIcon,
  TruckIcon,
  BuildingLibraryIcon
} from '@heroicons/react/24/outline'
import { useExplorePurposes } from '../hooks/useExplorePurposes'

export default function ExploreByPurpose() {
  const { purposes: purposesData, loading } = useExplorePurposes({ useSampleData: true })

  // Map icon names to components
  const iconMap: Record<string, any> = {
    HomeIcon,
    BriefcaseIcon,
    MapIcon,
    BuildingOfficeIcon,
    KeyIcon,
    CurrencyDollarIcon,
    GlobeAltIcon,
    ShoppingBagIcon,
    Cog6ToothIcon,
    TruckIcon,
    BuildingLibraryIcon,
  }

  // Color mapping to ensure Tailwind includes these classes
  const colorClassMap: Record<string, string> = {
    'from-blue-500 to-blue-600': 'from-blue-500 to-blue-600',
    'from-green-500 to-green-600': 'from-green-500 to-green-600',
    'from-orange-500 to-orange-600': 'from-orange-500 to-orange-600',
    'from-purple-500 to-purple-600': 'from-purple-500 to-purple-600',
    'from-indigo-500 to-indigo-600': 'from-indigo-500 to-indigo-600',
    'from-yellow-500 to-yellow-600': 'from-yellow-500 to-yellow-600',
    'from-cyan-500 to-cyan-600': 'from-cyan-500 to-cyan-600',
    'from-teal-500 to-teal-600': 'from-teal-500 to-teal-600',
    'from-gray-600 to-gray-700': 'from-gray-600 to-gray-700',
    'from-emerald-500 to-emerald-600': 'from-emerald-500 to-emerald-600',
    'from-pink-500 to-pink-600': 'from-pink-500 to-pink-600',
    'from-violet-500 to-violet-600': 'from-violet-500 to-violet-600',
  }

  const purposes = purposesData.map((purpose) => ({
    ...purpose,
    icon: iconMap[purpose.icon] || HomeIcon,
    colorClass: colorClassMap[purpose.color] || 'from-blue-500 to-blue-600',
  }))

  if (loading) {
    return (
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-gray-100 mb-2">Explore by Purpose</h2>
            <p className="text-gray-600 dark:text-gray-400">Find properties that match your needs</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-xl p-6 animate-pulse h-40" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!purposes || purposes.length === 0) {
    return null
  }

  return (
    <section className="py-12 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Explore by Purpose</h2>
          <p className="text-gray-600 dark:text-gray-400">Find properties that match your needs</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {purposes.map((purpose, index) => {
            const Icon = purpose.icon
            return (
              <Link
                key={`${purpose.title}-${index}`}
                to={purpose.link}
                className={`bg-gradient-to-br ${purpose.colorClass} rounded-xl p-6 text-white hover:shadow-xl transition-all duration-200 hover:scale-105`}
              >
                <Icon className="w-12 h-12 mb-4 text-white" />
                <h3 className="text-xl font-semibold mb-2 text-white">{purpose.title}</h3>
                <p className="text-white/90 text-sm">{purpose.description}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

