import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function QuickFilters() {
  const navigate = useNavigate()
  const [selectedTransaction, setSelectedTransaction] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  const handleFilter = (type: string, value: string) => {
    if (type === 'transaction') {
      setSelectedTransaction(value)
      navigate(`/properties?transactionType=${value}`)
    } else if (type === 'category') {
      setSelectedCategory(value)
      navigate(`/properties?propertyCategory=${value}`)
    }
  }

  return (
    <div className="mt-8 space-y-4">
      {/* Transaction Type Pills */}
      <div>
        <p className="text-primary-100 text-sm mb-2">Transaction Type</p>
        <div className="flex flex-wrap gap-2">
          {['SELL', 'RENT', 'LEASE', 'LAND'].map((type) => (
            <button
              key={type}
              onClick={() => handleFilter('transaction', type)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedTransaction === type
                  ? 'bg-white text-primary-600'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Property Category Pills */}
      <div>
        <p className="text-primary-100 text-sm mb-2">Property Type</p>
        <div className="flex flex-wrap gap-2">
          {['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'LAND', 'SPECIAL'].map((category) => (
            <button
              key={category}
              onClick={() => handleFilter('category', category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-white text-primary-600'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-2 pt-2">
        <button className="px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium hover:bg-white/30">
          ✓ Verified Only
        </button>
        <button className="px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium hover:bg-white/30">
          🏠 Ready to Move
        </button>
        <button className="px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium hover:bg-white/30">
          🏗️ Under Construction
        </button>
      </div>
    </div>
  )
}

