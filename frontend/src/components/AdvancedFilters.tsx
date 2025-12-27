import { useState } from 'react'
import LocationAutocomplete from './LocationAutocomplete'

interface Props {
  searchParams: URLSearchParams
  onFilterChange: (key: string, value: any) => void
}

export default function AdvancedFilters({ searchParams, onFilterChange }: Props) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['transaction', 'category'])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Filters</h2>

      {/* Transaction Type */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('transaction')}
          className="w-full flex justify-between items-center mb-3"
        >
          <span className="font-medium text-gray-900">Transaction Type</span>
          <span>{expandedSections.includes('transaction') ? '−' : '+'}</span>
        </button>
        {expandedSections.includes('transaction') && (
          <div className="space-y-2">
            {['SELL', 'RENT', 'LEASE', 'SUB_LEASE', 'FRACTIONAL'].map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  checked={searchParams.get('transactionType') === type}
                  onChange={(e) => onFilterChange('transactionType', e.target.checked ? type : null)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Property Category */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('category')}
          className="w-full flex justify-between items-center mb-3"
        >
          <span className="font-medium text-gray-900">Property Category</span>
          <span>{expandedSections.includes('category') ? '−' : '+'}</span>
        </button>
        {expandedSections.includes('category') && (
          <div className="space-y-2">
            {['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'LAND', 'SPECIAL'].map((category) => (
              <label key={category} className="flex items-center">
                <input
                  type="checkbox"
                  checked={searchParams.get('propertyCategory') === category}
                  onChange={(e) => onFilterChange('propertyCategory', e.target.checked ? category : null)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{category}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex justify-between items-center mb-3"
        >
          <span className="font-medium text-gray-900">Price Range</span>
          <span>{expandedSections.includes('price') ? '−' : '+'}</span>
        </button>
        {expandedSections.includes('price') && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Min Price</label>
              <input
                type="number"
                value={searchParams.get('minPrice') || ''}
                onChange={(e) => onFilterChange('minPrice', e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Max Price</label>
              <input
                type="number"
                value={searchParams.get('maxPrice') || ''}
                onChange={(e) => onFilterChange('maxPrice', e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="No limit"
              />
            </div>
          </div>
        )}
      </div>

      {/* Location */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('location')}
          className="w-full flex justify-between items-center mb-3"
        >
          <span className="font-medium text-gray-900">Location</span>
          <span>{expandedSections.includes('location') ? '−' : '+'}</span>
        </button>
        {expandedSections.includes('location') && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Search Location</label>
              <LocationAutocomplete
                value={searchParams.get('city') ? `${searchParams.get('city')}, ${searchParams.get('state') || ''}` : ''}
                onChange={(location) => {
                  if (location) {
                    onFilterChange('city', location.city)
                    onFilterChange('state', location.state)
                    if (location.area) {
                      onFilterChange('area', location.area)
                    }
                  } else {
                    onFilterChange('city', null)
                    onFilterChange('state', null)
                    onFilterChange('area', null)
                  }
                }}
                placeholder="Search city, area, or location..."
                className="w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">City</label>
                <input
                  type="text"
                  value={searchParams.get('city') || ''}
                  onChange={(e) => onFilterChange('city', e.target.value || null)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">State</label>
                <input
                  type="text"
                  value={searchParams.get('state') || ''}
                  onChange={(e) => onFilterChange('state', e.target.value || null)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="State"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Area / Locality</label>
              <input
                type="text"
                value={searchParams.get('area') || ''}
                onChange={(e) => onFilterChange('area', e.target.value || null)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Area or locality"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Pincode</label>
              <input
                type="text"
                value={searchParams.get('pincode') || ''}
                onChange={(e) => onFilterChange('pincode', e.target.value || null)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="6-digit pincode"
                maxLength={6}
              />
            </div>
          </div>
        )}
      </div>

      {/* Legal Status */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('legal')}
          className="w-full flex justify-between items-center mb-3"
        >
          <span className="font-medium text-gray-900">Legal Status</span>
          <span>{expandedSections.includes('legal') ? '−' : '+'}</span>
        </button>
        {expandedSections.includes('legal') && (
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">RERA Registered</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Title Clear</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Encumbrance Free</span>
            </label>
          </div>
        )}
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => {
          const keys = Array.from(searchParams.keys())
          keys.forEach((key) => onFilterChange(key, null))
        }}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
      >
        Clear All Filters
      </button>
    </div>
  )
}

