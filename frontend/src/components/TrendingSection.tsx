import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function TrendingSection() {
  const trendingTabs = [
    { id: 'trending', label: '🔥 Trending Localities', count: 12 },
    { id: 'drops', label: '📉 Price Drops', count: 8 },
    { id: 'verified', label: '✅ Newly Verified', count: 15 },
    { id: 'yield', label: '💰 High Yield', count: 10 },
  ]

  const [activeTab, setActiveTab] = useState('trending')

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Trending & Insights</h2>
          <Link to="/properties" className="text-primary-600 hover:text-primary-700 font-medium">
            View All →
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 mb-6">
          {trendingTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        <div className="bg-white rounded-lg p-6">
          <p className="text-gray-600 text-center py-8">
            {activeTab === 'trending' && '🔥 Top searched areas in major cities'}
            {activeTab === 'drops' && '📉 Properties with recent price reductions'}
            {activeTab === 'verified' && '✅ Recently verified properties with complete Asset DNA'}
            {activeTab === 'yield' && '💰 High rental yield investment opportunities'}
          </p>
          <Link
            to={`/properties?filter=${activeTab}`}
            className="block text-center text-primary-600 hover:text-primary-700 font-medium"
          >
            Explore {trendingTabs.find(t => t.id === activeTab)?.label} →
          </Link>
        </div>
      </div>
    </section>
  )
}

