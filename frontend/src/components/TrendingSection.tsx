import { useState } from 'react'
import ProtectedLink from './ProtectedLink'
import {
  FireIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  MapPinIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  BoltIcon,
  StarIcon,
  BanknotesIcon,
  CursorArrowRaysIcon,
  TrophyIcon,
  CheckCircleIcon,
  BeakerIcon,
  ScaleIcon,
  BriefcaseIcon,
  HomeIcon,
  CubeIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline'
import { useTrendingData } from '../hooks/useTrendingData'

interface TrendingSectionProps {
  showLoginModal?: () => void
}

export default function TrendingSection({ showLoginModal }: TrendingSectionProps) {
  const { data } = useTrendingData({ useSampleData: true })
  const [activeTab, setActiveTab] = useState('trending')

  // Map icon names to components
  const iconMap: Record<string, any> = {
    FireIcon,
    ArrowTrendingDownIcon,
    ShieldCheckIcon,
    ChartBarIcon,
  }

  // Map badge icon names to Heroicons
  const badgeIconMap: Record<string, any> = {
    'FireIcon': FireIcon,
    'ArrowTrendingUpIcon': ArrowTrendingUpIcon,
    'BoltIcon': BoltIcon,
    'StarIcon': StarIcon,
    'CurrencyDollarIcon': CurrencyDollarIcon,
    'BanknotesIcon': BanknotesIcon,
    'TargetIcon': CursorArrowRaysIcon,
    'CursorArrowRaysIcon': CursorArrowRaysIcon,
    'TrophyIcon': TrophyIcon,
    'CheckCircleIcon': CheckCircleIcon,
    'BeakerIcon': BeakerIcon,
    'ScaleIcon': ScaleIcon,
    'MapPinIcon': MapPinIcon,
    'BriefcaseIcon': BriefcaseIcon,
    'HomeIcon': HomeIcon,
    'CubeIcon': CubeIcon,
    'ShoppingBagIcon': ShoppingBagIcon,
  }

  const trendingTabs = data.tabs.map((tab) => ({
    ...tab,
    icon: iconMap[tab.id === 'trending' ? 'FireIcon' : tab.id === 'drops' ? 'ArrowTrendingDownIcon' : tab.id === 'verified' ? 'ShieldCheckIcon' : 'ChartBarIcon'],
  }))

  const trendingLocalities = data.trendingLocalities
  const priceDrops = data.priceDrops
  const newlyVerified = data.newlyVerified
  const highYield = data.highYield

  const getDataForTab = () => {
    switch (activeTab) {
      case 'trending':
        return trendingLocalities
      case 'drops':
        return priceDrops
      case 'verified':
        return newlyVerified
      case 'yield':
        return highYield
      default:
        return trendingLocalities
    }
  }

  const getDescription = () => {
    return data.descriptions[activeTab] || ''
  }

  const tabData = getDataForTab()

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 dark:from-gray-900 via-white dark:via-gray-800 to-gray-50 dark:to-gray-900 relative overflow-hidden">
      {/* Animated Background Elements - Reduced opacity to prevent glowing */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-100 dark:bg-primary-900/20 rounded-full filter blur-3xl opacity-5 dark:opacity-10"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-100 dark:bg-blue-900/20 rounded-full filter blur-3xl opacity-5 dark:opacity-10"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-100 dark:bg-purple-900/20 rounded-full filter blur-3xl opacity-5 dark:opacity-10"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-gray-100 mb-2">Trending & Insights</h2>
            <p className="text-gray-600 dark:text-gray-400">{getDescription()}</p>
          </div>
          <ProtectedLink 
            to="/properties"
            showLoginModal={showLoginModal}
            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
          >
            View All →
          </ProtectedLink>
        </div>

        {/* Futuristic Tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-2 sm:p-3 mb-8 shadow-lg dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700">
          {trendingTabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-600 dark:from-primary-500 to-primary-700 dark:to-primary-600 text-white shadow-lg shadow-primary-200 dark:shadow-primary-900/50'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-primary-600 dark:text-primary-400'}`} />
                <span className="flex-shrink-0">{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0 ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                }`}>
                  {tab.count}
                </span>
                {isActive && (
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary-400 to-primary-600 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                )}
              </button>
            )
          })}
        </div>

        {/* Interactive Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {tabData.map((item, index) => (
            <div
              key={item.id}
              className="group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 shadow-md dark:shadow-gray-900/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Animated Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 dark:from-primary-900/20 via-transparent to-blue-50/50 dark:to-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Badge */}
              {item.badge && (
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-400 dark:to-primary-500 text-white rounded-full shadow-sm">
                    {item.badgeIcon && badgeIconMap[item.badgeIcon] ? (
                      <>
                        {(() => {
                          const BadgeIcon = badgeIconMap[item.badgeIcon]
                          return <BadgeIcon className="w-3 h-3" />
                        })()}
                        <span>{item.badgeText || item.badge.replace(/[^\w\s]/g, '').trim()}</span>
                      </>
                    ) : (
                      <span>{item.badgeText || item.badge.replace(/[^\w\s]/g, '').trim()}</span>
                    )}
                  </span>
                </div>
              )}

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate mb-1">
                      {item.name}
                    </h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {item.value}
                    </p>
                  </div>
                </div>

                {/* Change Indicator */}
                {item.change !== 0 && (
                  <div className={`flex items-center gap-1 mt-3 ${
                    item.changeType === 'up' ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                  }`}>
                    {item.changeType === 'up' ? (
                      <ArrowTrendingUpIcon className="w-4 h-4" />
                    ) : (
                      <ArrowTrendingDownIcon className="w-4 h-4" />
                    )}
                    <span className="text-sm font-semibold">
                      {item.changeType === 'up' ? '+' : ''}{item.change}%
                    </span>
                  </div>
                )}

                {/* Progress Bar for Verified/Yield */}
                {(activeTab === 'verified' || activeTab === 'yield') && (
                  <div className="mt-3">
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          activeTab === 'verified' 
                            ? 'bg-gradient-to-r from-green-400 to-green-600 dark:from-green-500 dark:to-green-600' 
                            : 'bg-gradient-to-r from-primary-400 to-primary-600 dark:from-primary-500 dark:to-primary-600'
                        }`}
                        style={{ width: `${parseFloat(String(item.value).replace('%', ''))}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Hover Effect Glow */}
              <div className="absolute inset-0 rounded-xl bg-primary-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* AI Insights Card */}
        <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-blue-700 rounded-2xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')]"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <BoltIcon className="w-6 h-6 text-yellow-300" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-heading font-bold mb-2 flex items-center gap-2">
                  <BoltIcon className="w-5 h-5 text-yellow-300" />
                  AI-Powered Market Insights
                </h3>
                <p className="text-primary-100 text-sm sm:text-base leading-relaxed">
                  Our advanced analytics engine processes millions of data points to provide you with real-time market trends, 
                  price predictions, and investment opportunities. Get ahead with data-driven decisions.
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <div className="text-2xl font-bold mb-1">12K+</div>
                <div className="text-xs text-primary-100">Properties Analyzed</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <div className="text-2xl font-bold mb-1">98%</div>
                <div className="text-xs text-primary-100">Accuracy Rate</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <div className="text-2xl font-bold mb-1">24/7</div>
                <div className="text-xs text-primary-100">Real-time Updates</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <div className="text-2xl font-bold mb-1">AI</div>
                <div className="text-xs text-primary-100">Powered</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Link */}
        <div className="mt-6 text-center">
          <ProtectedLink
            to={`/properties?filter=${activeTab}`}
            showLoginModal={showLoginModal}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border-2 border-primary-300 dark:border-primary-600 text-primary-700 dark:text-primary-300 font-semibold rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:border-primary-400 dark:hover:border-primary-500 transition-all duration-300 shadow-md dark:shadow-gray-900/50 hover:shadow-lg transform hover:scale-105"
          >
            <MapPinIcon className="w-5 h-5" />
            <span>Explore {trendingTabs.find(t => t.id === activeTab)?.label}</span>
            <ArrowTrendingUpIcon className="w-5 h-5" />
          </ProtectedLink>
        </div>
      </div>
    </section>
  )
}
