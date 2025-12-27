import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  HomeIcon, 
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import LocationAutocomplete, { LocationSuggestion } from './LocationAutocomplete'
import CurrencySelector from './CurrencySelector'
import { PropertyCategory } from '../types/property'
import { usePropertyTypes } from '../hooks/usePropertyTypes'
import { useBudgetRanges } from '../hooks/useBudgetRanges'
import { useCurrencyStore } from '../store/currencyStore'

export default function SearchBar() {
  const [selectedLocation, setSelectedLocation] = useState<LocationSuggestion | null>(null)
  const [selectedPropertyType, setSelectedPropertyType] = useState<PropertyCategory | ''>('')
  const [minBudget, setMinBudget] = useState<string>('')
  const [maxBudget, setMaxBudget] = useState<string>('')
  const [isPropertyTypeOpen, setIsPropertyTypeOpen] = useState(false)
  const [isBudgetOpen, setIsBudgetOpen] = useState(false)
  const navigate = useNavigate()
  const propertyTypeRef = useRef<HTMLDivElement>(null)
  const budgetRef = useRef<HTMLDivElement>(null)

  // Fetch data from API (set useSampleData to false when backend is ready)
  const { propertyTypes } = usePropertyTypes({ useSampleData: true })
  const { selectedCurrency } = useCurrencyStore()
  const { budgetRanges, loading: loadingBudgetRanges } = useBudgetRanges({
    useSampleData: true,
    currencyCode: selectedCurrency?.code || 'INR',
  })

  const formatBudgetDisplay = () => {
    const currencySymbol = selectedCurrency?.symbol || '₹'
    
    // Helper function to format a number
    const formatNumber = (num: number): string => {
      if (isNaN(num) || num <= 0) return ''
      
      if (selectedCurrency?.code === 'INR') {
        if (num >= 10000000) {
          return `${(num / 10000000).toFixed(1)}Cr`
        } else if (num >= 100000) {
          return `${(num / 100000).toFixed(0)}L`
        } else {
          return num.toLocaleString('en-IN')
        }
      } else {
        if (num >= 1000000) {
          return `${(num / 1000000).toFixed(1)}M`
        } else if (num >= 1000) {
          return `${(num / 1000).toFixed(0)}K`
        } else {
          return num.toFixed(0)
        }
      }
    }
    
    const min = minBudget ? parseFloat(minBudget) : NaN
    const max = maxBudget ? parseFloat(maxBudget) : NaN
    
    const minFormatted = !isNaN(min) ? formatNumber(min) : ''
    const maxFormatted = !isNaN(max) ? formatNumber(max) : ''
    
    if (minFormatted && maxFormatted) {
      return `${currencySymbol}${minFormatted} - ${currencySymbol}${maxFormatted}`
    } else if (minFormatted) {
      return `Min: ${currencySymbol}${minFormatted}`
    } else if (maxFormatted) {
      return `Max: ${currencySymbol}${maxFormatted}`
    }
    
    return 'Budget'
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (propertyTypeRef.current && !propertyTypeRef.current.contains(event.target as Node)) {
        setIsPropertyTypeOpen(false)
      }
      if (budgetRef.current && !budgetRef.current.contains(event.target as Node)) {
        setIsBudgetOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    
    if (selectedLocation) {
      if (selectedLocation.city) params.set('city', selectedLocation.city)
      if (selectedLocation.state) params.set('state', selectedLocation.state)
      if (selectedLocation.area) params.set('area', selectedLocation.area)
    }
    
    if (selectedPropertyType) {
      params.set('propertyCategory', selectedPropertyType)
    }
    
    if (minBudget) {
      params.set('minPrice', minBudget)
    }
    if (maxBudget) {
      params.set('maxPrice', maxBudget)
    }
    
    navigate(`/properties?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="w-full max-w-5xl mx-auto px-2 sm:px-0 relative z-10" style={{ overflow: 'visible' }}>
      <div className="bg-white rounded-2xl sm:rounded-full border border-gray-300 shadow-lg flex flex-col sm:flex-row items-stretch" style={{ overflow: 'visible' }}>
        {/* Location Input */}
        <div className="flex-1 flex items-center px-3 sm:px-4 md:px-6 py-3 sm:py-3.5 md:py-4 border-b sm:border-b-0 sm:border-r border-gray-200 min-w-0">
          <MapPinIcon className="w-5 h-5 text-primary-600 flex-shrink-0 mr-2 sm:mr-3" />
          <div className="flex-1 min-w-0 relative search-bar-location">
            <LocationAutocomplete
              value={selectedLocation?.displayName || ''}
              onChange={setSelectedLocation}
              placeholder="Enter City, Locality, Project"
              className="[&>div>div>svg]:!hidden [&>div>input]:!border-0 [&>div>input]:!focus:ring-0 [&>div>input]:!p-0 [&>div>input]:!pl-0 [&>div>input]:!pr-8 [&>div>input]:text-sm [&>div>input]:sm:text-base [&>div>input]:text-gray-900 [&>div>input]:placeholder:text-gray-400 [&>div>input]:w-full [&>div>input]:bg-transparent"
            />
          </div>
        </div>

        {/* Property Type Dropdown */}
        <div className="relative flex-1 flex items-center px-3 sm:px-4 md:px-6 py-3 sm:py-3.5 md:py-4 border-b sm:border-b-0 sm:border-r border-gray-200 min-w-0 z-10" ref={propertyTypeRef}>
          <HomeIcon className="w-5 h-5 text-primary-600 flex-shrink-0 mr-2 sm:mr-3" />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsPropertyTypeOpen(!isPropertyTypeOpen)
              setIsBudgetOpen(false)
            }}
            className="flex-1 text-left flex items-center justify-between min-w-0 h-full"
          >
            <span className={`text-sm sm:text-base truncate ${
              selectedPropertyType ? 'text-gray-900' : 'text-gray-400'
            }`}>
              {selectedPropertyType 
                ? propertyTypes.find(t => t.value === selectedPropertyType)?.label || 'Select Type'
                : 'Select Property Type'}
            </span>
            <ChevronDownIcon className={`w-4 h-4 text-gray-400 flex-shrink-0 ml-2 transition-transform ${
              isPropertyTypeOpen ? 'rotate-180' : ''
            }`} />
          </button>

          {/* Property Type Dropdown Menu */}
          {isPropertyTypeOpen && (
            <div 
              className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-[100] max-h-60 overflow-y-auto scrollbar-hide min-w-[200px]"
              onClick={(e) => e.stopPropagation()}
            >
              {propertyTypes.map((type, index) => (
                <button
                  key={`${type.value}-${index}`}
                  type="button"
                  onClick={() => {
                    setSelectedPropertyType(type.value)
                    setIsPropertyTypeOpen(false)
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors text-sm sm:text-base border-b border-gray-100 last:border-b-0 ${
                    selectedPropertyType === type.value ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Budget Dropdown */}
        <div className="relative flex-1 flex items-center px-3 sm:px-4 md:px-6 py-3 sm:py-3.5 md:py-4 border-b sm:border-b-0 border-gray-200 min-w-0 z-10" ref={budgetRef}>
          <div className="flex-shrink-0 mr-2 sm:mr-3">
            <CurrencySelector compact={true} />
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsBudgetOpen(!isBudgetOpen)
              setIsPropertyTypeOpen(false)
            }}
            className="flex-1 text-left flex items-center justify-between min-w-0 h-full"
          >
            <span className={`text-sm sm:text-base truncate ${
              minBudget || maxBudget ? 'text-gray-900' : 'text-gray-400'
            }`}>
              {formatBudgetDisplay()}
            </span>
            <ChevronDownIcon className={`w-4 h-4 text-gray-400 flex-shrink-0 ml-2 transition-transform ${
              isBudgetOpen ? 'rotate-180' : ''
            }`} />
          </button>

          {/* Budget Dropdown Menu */}
          {isBudgetOpen && (
            <div 
              className="absolute top-full left-0 right-0 sm:left-auto sm:right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-[100] p-4 min-w-[280px] sm:min-w-[320px]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Min Budget ({selectedCurrency?.symbol || '₹'})
                    </label>
                    <input
                      type="number"
                      value={minBudget}
                      onChange={(e) => setMinBudget(e.target.value)}
                      placeholder="e.g., 5000000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Max Budget ({selectedCurrency?.symbol || '₹'})
                    </label>
                    <input
                      type="number"
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(e.target.value)}
                      placeholder="e.g., 10000000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs font-medium text-gray-700 mb-2">Quick Select:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {loadingBudgetRanges ? (
                      <div className="col-span-full text-center text-xs text-gray-500 py-2">Loading ranges...</div>
                    ) : (
                      budgetRanges.map((range, index) => {
                        // Replace currency symbol in label if it exists
                        const currencySymbol = selectedCurrency?.symbol || '₹'
                        const displayLabel = range.label.replace(/₹/g, currencySymbol)
                        
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              if (range.min) setMinBudget(range.min.toString())
                              else setMinBudget('')
                              if (range.max) setMaxBudget(range.max.toString())
                              else setMaxBudget('')
                            }}
                            className="px-3 py-2 text-xs text-left bg-primary-50 border border-primary-200 text-primary-700 rounded-lg hover:bg-primary-100 hover:border-primary-300 hover:text-primary-800 transition-colors whitespace-nowrap font-medium"
                          >
                            {displayLabel}
                          </button>
                        )
                      })
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMinBudget('')
                      setMaxBudget('')
                    }}
                    className="flex-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsBudgetOpen(false)}
                    className="flex-1 px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search Button */}
        <div className="flex items-center rounded-b-2xl sm:rounded-r-full sm:rounded-l-none overflow-hidden flex-shrink-0">
          <button
            type="submit"
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 flex items-center justify-center gap-2 font-semibold text-sm sm:text-base transition-colors whitespace-nowrap min-w-[100px] sm:min-w-[120px] w-full"
          >
            <MagnifyingGlassIcon className="w-5 h-5 flex-shrink-0" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>
      </div>
    </form>
  )
}
