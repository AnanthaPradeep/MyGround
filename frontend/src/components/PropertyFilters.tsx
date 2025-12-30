import { useState, useMemo } from 'react'
import { ChevronDownIcon, ChevronUpIcon, XMarkIcon } from '@heroicons/react/24/outline'
import LocationAutocomplete from './LocationAutocomplete'
import { useFilterOptions } from '../hooks/useFilterOptions'

interface Props {
  searchParams: URLSearchParams
  onFilterChange: (key: string, value: any) => void
}

export default function PropertyFilters({ searchParams, onFilterChange }: Props) {
  const { filterOptions, loading: loadingFilters } = useFilterOptions({ useSampleData: false })
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'transaction',
    'category',
    'location',
  ])

  const transactionType = searchParams.get('transactionType') || ''
  const propertyCategory = searchParams.get('propertyCategory') || ''

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    )
  }

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0
    const params = Array.from(searchParams.entries())
    params.forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        // Exclude common URL params that aren't filters
        if (!['page', 'limit', 'sort'].includes(key)) {
          count++
        }
      }
    })
    return count
  }, [searchParams])

  const clearAllFilters = () => {
    const keys = Array.from(searchParams.keys())
    keys.forEach((key) => {
      if (!['page', 'limit', 'sort'].includes(key)) {
        onFilterChange(key, null)
      }
    })
  }

  // Get available sub-types based on selected category
  const availableSubTypes = propertyCategory
    ? filterOptions.propertySubTypes[propertyCategory] || []
    : []

  // Check if rent filter should show (for RENT)
  const showRentFilter = transactionType === 'RENT' || transactionType === 'SUB_LEASE'
  // Check if lease filter should show (for LEASE)
  const showLeaseFilter = transactionType === 'LEASE'

  // Determine pricing field name based on transaction type
  const getPriceFieldName = () => {
    if (transactionType === 'RENT' || transactionType === 'SUB_LEASE') return 'rentAmount'
    if (transactionType === 'LEASE') return 'leaseValue'
    return 'expectedPrice'
  }

  const priceFieldName = getPriceFieldName()

  const FilterSection = ({
    id,
    title,
    children,
    defaultExpanded = false,
  }: {
    id: string
    title: string
    children: React.ReactNode
    defaultExpanded?: boolean
  }) => {
    const isExpanded = expandedSections.includes(id) || defaultExpanded

    return (
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex justify-between items-center mb-3 text-left"
        >
          <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{title}</span>
          {isExpanded ? (
            <ChevronUpIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          )}
        </button>
        {isExpanded && <div className="space-y-3">{children}</div>}
      </div>
    )
  }

  // Show loading state while filters are being fetched
  if (loadingFilters) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 sticky top-20">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 sticky top-20">
      {/* Header with active filter count */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Filters</h2>
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded-full">
              {activeFilterCount} active
            </span>
            <button
              onClick={clearAllFilters}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center gap-1"
            >
              <XMarkIcon className="w-4 h-4" />
              Clear all
            </button>
          </div>
        )}
      </div>

      <div className="space-y-1">
        {/* Transaction Type */}
        <FilterSection id="transaction" title="Transaction Type" defaultExpanded>
          <div className="space-y-2">
            <label className="flex items-center cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-2 -m-2">
              <input
                type="radio"
                name="transactionType"
                checked={!searchParams.get('transactionType')}
                onChange={() => onFilterChange('transactionType', null)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
              <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">All Types</span>
            </label>
            {filterOptions.transactionTypes.map((type) => (
              <label
                key={type.value}
                className="flex items-center cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-2 -m-2"
              >
                <input
                  type="radio"
                  name="transactionType"
                  checked={searchParams.get('transactionType') === type.value}
                  onChange={(e) =>
                    onFilterChange('transactionType', e.target.checked ? type.value : null)
                  }
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                />
                <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                  {type.label}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Property Category */}
        <FilterSection id="category" title="Property Category" defaultExpanded>
          <div className="space-y-2">
            <label className="flex items-center cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-2 -m-2">
              <input
                type="radio"
                name="propertyCategory"
                checked={!searchParams.get('propertyCategory')}
                onChange={() => onFilterChange('propertyCategory', null)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
              <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">All Categories</span>
            </label>
            {filterOptions.propertyCategories.map((category) => (
              <label
                key={category.value}
                className="flex items-center cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-2 -m-2"
              >
                <input
                  type="radio"
                  name="propertyCategory"
                  checked={searchParams.get('propertyCategory') === category.value}
                  onChange={(e) =>
                    onFilterChange('propertyCategory', e.target.checked ? category.value : null)
                  }
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                />
                <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                  {category.label}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Property Sub-Type */}
        {propertyCategory && availableSubTypes.length > 0 && (
          <FilterSection id="subType" title="Property Sub-Type">
            <select
              value={searchParams.get('propertySubType') || ''}
              onChange={(e) => onFilterChange('propertySubType', e.target.value || null)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">All Sub-Types</option>
              {availableSubTypes.map((subType) => (
                <option key={subType} value={subType}>
                  {subType}
                </option>
              ))}
            </select>
          </FilterSection>
        )}

        {/* Pricing Range */}
        <FilterSection id="pricing" title={showLeaseFilter ? 'Lease Value' : showRentFilter ? 'Rent Range' : 'Price Range'}>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">
                Min {showLeaseFilter ? 'Lease' : showRentFilter ? 'Rent' : 'Price'} (₹)
              </label>
              <input
                type="number"
                value={searchParams.get(`min${priceFieldName.charAt(0).toUpperCase() + priceFieldName.slice(1)}`) || searchParams.get('minPrice') || ''}
                onChange={(e) => {
                  const field = showLeaseFilter ? 'minLeaseValue' : showRentFilter ? 'minRentAmount' : 'minPrice'
                  onFilterChange(field, e.target.value || null)
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">
                Max {showLeaseFilter ? 'Lease' : showRentFilter ? 'Rent' : 'Price'} (₹)
              </label>
              <input
                type="number"
                value={searchParams.get(`max${priceFieldName.charAt(0).toUpperCase() + priceFieldName.slice(1)}`) || searchParams.get('maxPrice') || ''}
                onChange={(e) => {
                  const field = showLeaseFilter ? 'maxLeaseValue' : showRentFilter ? 'maxRentAmount' : 'maxPrice'
                  onFilterChange(field, e.target.value || null)
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="No limit"
                min="0"
              />
            </div>
          </div>
        </FilterSection>

        {/* Location */}
        <FilterSection id="location" title="Location" defaultExpanded>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">
                Search Location
              </label>
              <LocationAutocomplete
                value={
                  searchParams.get('city')
                    ? `${searchParams.get('city')}, ${searchParams.get('state') || ''}`
                    : ''
                }
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
                placeholder="Search city, area..."
                className="w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">City</label>
                <input
                  type="text"
                  value={searchParams.get('city') || ''}
                  onChange={(e) => onFilterChange('city', e.target.value || null)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">State</label>
                <input
                  type="text"
                  value={searchParams.get('state') || ''}
                  onChange={(e) => onFilterChange('state', e.target.value || null)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="State"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">
                Area / Locality
              </label>
              <input
                type="text"
                value={searchParams.get('area') || ''}
                onChange={(e) => onFilterChange('area', e.target.value || null)}
                className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Area or locality"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">Pincode</label>
              <input
                type="text"
                value={searchParams.get('pincode') || ''}
                onChange={(e) => onFilterChange('pincode', e.target.value || null)}
                className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="6-digit pincode"
                maxLength={6}
                pattern="[0-9]{6}"
              />
            </div>
          </div>
        </FilterSection>

        {/* Area Range - Dynamic based on category */}
        {propertyCategory && (
          <FilterSection
            id="area"
            title={
              propertyCategory === 'LAND'
                ? 'Plot Area'
                : propertyCategory === 'RESIDENTIAL'
                ? 'Built-up Area'
                : 'Area Range'
            }
          >
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">
                  Min Area (sq ft)
                </label>
                <input
                  type="number"
                  value={searchParams.get('minArea') || ''}
                  onChange={(e) => onFilterChange('minArea', e.target.value || null)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="0"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">
                  Max Area (sq ft)
                </label>
                <input
                  type="number"
                  value={searchParams.get('maxArea') || ''}
                  onChange={(e) => onFilterChange('maxArea', e.target.value || null)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="No limit"
                  min="0"
                />
              </div>
            </div>
          </FilterSection>
        )}

        {/* Residential Specific Filters */}
        {propertyCategory === 'RESIDENTIAL' && (
          <>
            <FilterSection id="residential" title="Residential Details">
              <div className="space-y-3">
                {/* BHK */}
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">BHK</label>
                  <select
                    value={searchParams.get('bhk') || ''}
                    onChange={(e) => onFilterChange('bhk', e.target.value || null)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">All</option>
                    {filterOptions.bhkOptions.slice(0, 6).map((bhk) => (
                      <option key={bhk} value={bhk}>
                        {bhk} BHK
                      </option>
                    ))}
                    {filterOptions.bhkOptions.length >= 7 && (
                      <option value="7+">7+ BHK</option>
                    )}
                  </select>
                </div>

                {/* Furnishing */}
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">
                    Furnishing
                  </label>
                  <select
                    value={searchParams.get('furnishing') || ''}
                    onChange={(e) => onFilterChange('furnishing', e.target.value || null)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">All</option>
                    {filterOptions.furnishingTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Parking */}
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">
                    Parking
                  </label>
                  <select
                    value={searchParams.get('parking') || ''}
                    onChange={(e) => onFilterChange('parking', e.target.value || null)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">All</option>
                    {filterOptions.parkingTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </FilterSection>
          </>
        )}

        {/* Ownership Type */}
        <FilterSection id="ownership" title="Ownership Type">
          <div className="space-y-2">
            <label className="flex items-center cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-2 -m-2">
              <input
                type="radio"
                name="ownershipType"
                checked={!searchParams.get('ownershipType')}
                onChange={() => onFilterChange('ownershipType', null)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
              <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">All</span>
            </label>
            {filterOptions.ownershipTypes.map((type) => (
              <label
                key={type.value}
                className="flex items-center cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-2 -m-2"
              >
                <input
                  type="radio"
                  name="ownershipType"
                  checked={searchParams.get('ownershipType') === type.value}
                  onChange={(e) =>
                    onFilterChange('ownershipType', e.target.checked ? type.value : null)
                  }
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                />
                <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                  {type.label}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Possession Status */}
        <FilterSection id="possession" title="Possession Status">
          <div className="space-y-2">
            <label className="flex items-center cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-2 -m-2">
              <input
                type="radio"
                name="possessionStatus"
                checked={!searchParams.get('possessionStatus')}
                onChange={() => onFilterChange('possessionStatus', null)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
              <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">All</span>
            </label>
            {filterOptions.possessionStatuses.map((status) => (
              <label
                key={status.value}
                className="flex items-center cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-2 -m-2"
              >
                <input
                  type="radio"
                  name="possessionStatus"
                  checked={searchParams.get('possessionStatus') === status.value}
                  onChange={(e) =>
                    onFilterChange('possessionStatus', e.target.checked ? status.value : null)
                  }
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                />
                <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                  {status.label}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Legal Status */}
        <FilterSection id="legal" title="Legal & Verification">
          <div className="space-y-2">
            <label className="flex items-center cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-2 -m-2">
              <input
                type="checkbox"
                checked={searchParams.get('reraRegistered') === 'true'}
                onChange={(e) => onFilterChange('reraRegistered', e.target.checked ? 'true' : null)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
              />
              <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">RERA Registered</span>
            </label>
            <label className="flex items-center cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-2 -m-2">
              <input
                type="checkbox"
                checked={searchParams.get('titleClear') === 'true'}
                onChange={(e) => onFilterChange('titleClear', e.target.checked ? 'true' : null)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
              />
              <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Title Clear</span>
            </label>
            <label className="flex items-center cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-2 -m-2">
              <input
                type="checkbox"
                checked={searchParams.get('encumbranceFree') === 'true'}
                onChange={(e) =>
                  onFilterChange('encumbranceFree', e.target.checked ? 'true' : null)
                }
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
              />
              <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                Encumbrance Free
              </span>
            </label>
            <label className="flex items-center cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-2 -m-2">
              <input
                type="checkbox"
                checked={searchParams.get('verified') === 'true'}
                onChange={(e) => onFilterChange('verified', e.target.checked ? 'true' : null)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
              />
              <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                Verified Properties Only
              </span>
            </label>
          </div>
        </FilterSection>

        {/* Property Age */}
        <FilterSection id="age" title="Property Age">
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5">
              Maximum Age (years)
            </label>
            <input
              type="number"
              value={searchParams.get('maxAge') || ''}
              onChange={(e) => onFilterChange('maxAge', e.target.value || null)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Any age"
              min="0"
              max="100"
            />
          </div>
        </FilterSection>
      </div>
    </div>
  )
}

