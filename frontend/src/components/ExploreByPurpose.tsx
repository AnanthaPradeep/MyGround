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
  const { purposes: purposesData } = useExplorePurposes({ useSampleData: true })

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

  const purposes = purposesData.map((purpose) => ({
    ...purpose,
    icon: iconMap[purpose.icon] || HomeIcon,
  }))

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Explore by Purpose</h2>
          <p className="text-gray-600">Find properties that match your needs</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {purposes.map((purpose, index) => {
            const Icon = purpose.icon
            return (
              <Link
                key={index}
                to={purpose.link}
                className={`bg-gradient-to-br ${purpose.color} rounded-xl p-6 text-white hover:shadow-lg transition-shadow`}
              >
                <Icon className="w-12 h-12 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{purpose.title}</h3>
                <p className="text-white/90 text-sm">{purpose.description}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

