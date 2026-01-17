import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Bars3Icon, BanknotesIcon, MapPinIcon, ShieldCheckIcon} from '@heroicons/react/24/outline'
import api from '../services/api'
import Logo from '../components/Logo'
import HeaderSearchDropdown from '../components/HeaderSearchDropdown'
import HeaderIcons from '../components/HeaderIcons'
import HeaderLocation from '../components/HeaderLocation'
import UserDropdown from '../components/UserDropdown'
import MobileMenu from '../components/MobileMenu'
import Footer from '../components/Footer'
import { EAuctionProperty } from '../types/eauction'

export default function EAuctionList() {
  const [auctions, setAuctions] = useState<EAuctionProperty[]>([])
  const [grouped, setGrouped] = useState<Record<string, Record<string, EAuctionProperty[]>>>({})
  const [loading, setLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const [keyword, setKeyword] = useState(searchParams.get('q') || '')
  const [filterOptions, setFilterOptions] = useState<{
    institutionTypes: string[]
    statuses: string[]
    categories: string[]
    institutionNames: string[]
    states: string[]
    cities: string[]
  } | null>(null)

  const filters = useMemo(() => {
    const params = Object.fromEntries(searchParams.entries())
    return params
  }, [searchParams])

  useEffect(() => {
    const fetchAuctions = async () => {
      setLoading(true)
      try {
        if (Object.keys(filters).length > 0) {
          const response = await api.get('/eauctions', { params: filters })
          const apiAuctions = response.data.auctions || []
          setAuctions(apiAuctions)
          setGrouped({})
        } else {
          const response = await api.get('/eauctions/grouped')
          const apiGrouped = response.data.grouped || {}
          setGrouped(apiGrouped)
          setAuctions([])
        }
      } catch (error) {
        console.error('Failed to load auctions', error)
        setAuctions([])
        setGrouped({})
      } finally {
        setLoading(false)
      }
    }

    fetchAuctions()
  }, [filters])

  useEffect(() => {
    setKeyword(searchParams.get('q') || '')
  }, [searchParams])

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await api.get('/eauctions/filters')
        setFilterOptions(response.data.data)
      } catch (error) {
        console.error('Failed to load auction filters', error)
        setFilterOptions(null)
      }
    }

    fetchFilters()
  }, [])

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    setSearchParams(params)
  }

  const applyKeywordSearch = () => {
    updateFilter('q', keyword.trim())
  }

  const clearFilters = () => {
    setSearchParams({})
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
              aria-label="Open menu"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>

            <Logo showText={true} size="md" className="hidden lg:flex lg:flex-1" />

            <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
              <HeaderSearchDropdown />
              <HeaderLocation />
              <HeaderIcons />
              <UserDropdown />
            </div>

            <div className="lg:hidden flex items-center">
              <UserDropdown />
            </div>
          </div>
        </div>
      </nav>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-gray-100 mb-2">
            Verified Bank & Institutional Property Auctions
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Only auctions published by verified banks, financial institutions, and government authorities.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-700">
              <ShieldCheckIcon className="w-4 h-4" /> Institution Verified
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-700">
              ⚖️ As-is-where-is basis
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="top-20 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="lg:col-span-2">
              <label className="text-xs text-gray-500">Search</label>
              <div className="mt-1 flex gap-2">
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Search auctions, institutions, locations"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-100 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={applyKeywordSearch}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700"
                >
                  Search
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500">Institution Type</label>
              <div className="relative">
                <select
                  value={searchParams.get('institutionType') || ''}
                  onChange={(e) => updateFilter('institutionType', e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-100"
                >
                  <option value="">All</option>
                  {(filterOptions?.institutionTypes || ['BANK', 'NBFC', 'GOVT', 'COURT', 'INSTITUTION']).map((type) => (
                    <option key={type} value={type}>
                      {type === 'NBFC' ? 'NBFC / Financial' : type === 'GOVT' ? 'Government' : type === 'COURT' ? 'Court / Legal' : type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500">Institution Name</label>
              <select
                value={searchParams.get('institutionName') || ''}
                onChange={(e) => updateFilter('institutionName', e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-100"
              >
                <option value="">All</option>
                {(filterOptions?.institutionNames || []).map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500">Status</label>
              <select
                value={searchParams.get('status') || ''}
                onChange={(e) => updateFilter('status', e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-100"
              >
                <option value="">All</option>
                {(filterOptions?.statuses || ['UPCOMING', 'LIVE', 'CLOSED']).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500">Category</label>
              <select
                value={searchParams.get('propertyCategory') || ''}
                onChange={(e) => updateFilter('propertyCategory', e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-100"
              >
                <option value="">All</option>
                {(filterOptions?.categories || ['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'LAND', 'SPECIAL', 'ISLAND']).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500">State</label>
              <select
                value={searchParams.get('state') || ''}
                onChange={(e) => updateFilter('state', e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-100"
              >
                <option value="">All</option>
                {(filterOptions?.states || []).map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500">City</label>
              <select
                value={searchParams.get('city') || ''}
                onChange={(e) => updateFilter('city', e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-100"
              >
                <option value="">All</option>
                {(filterOptions?.cities || []).map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500">Reserve Price</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <input
                  value={searchParams.get('minPrice') || ''}
                  onChange={(e) => updateFilter('minPrice', e.target.value)}
                  placeholder="Min"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-100 placeholder:text-gray-400"
                />
                <input
                  value={searchParams.get('maxPrice') || ''}
                  onChange={(e) => updateFilter('maxPrice', e.target.value)}
                  placeholder="Max"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-100 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500">Sort By</label>
              <select
                value={searchParams.get('sortBy') || ''}
                onChange={(e) => updateFilter('sortBy', e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-100"
              >
                <option value="endingSoon">Auction Ending Soon</option>
                <option value="lowestReserve">Lowest Reserve Price</option>
                <option value="latest">Latest Added</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={clearFilters}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">Loading auctions...</div>
        ) : Object.keys(grouped).length === 0 && auctions.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">No auctions found for the selected filters. Try changing the institution or date range.</p>
          </div>
        ) : auctions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctions.map((auction) => (
              <Link
                key={auction._id}
                to={`/eauction/${auction._id}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-40 bg-gray-100 dark:bg-gray-700">
                  {auction.media?.images?.[0] ? (
                    <img
                      src={auction.media.images[0]}
                      alt={auction.title}
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wide text-primary-600 dark:text-primary-400">
                      {auction.status}
                    </span>
                    <span className="text-xs text-gray-500">{auction.institution?.name || auction.authorityName}</span>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {auction.title}
                  </h2>
                  <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4" />
                    <span>{auction.location?.city || 'Location TBA'}</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <BanknotesIcon className="w-4 h-4" />
                    <span>Reserve: ₹{auction.reservePrice.toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          Object.entries(grouped).map(([type, institutions]) => (
            <div key={type} className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{type} Auctions</h2>
              </div>
              {Object.entries(institutions).map(([name, list]) => (
                <div key={name} className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">{name}</div>
                    <Link
                      to={`/eauction?institutionType=${type}&institutionName=${encodeURIComponent(name)}`}
                      className="text-xs text-primary-600 hover:text-primary-700"
                    >
                      View All
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {list.slice(0, 6).map((auction) => (
                      <Link
                        key={auction._id}
                        to={`/eauction/${auction._id}`}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="h-40 bg-gray-100 dark:bg-gray-700">
                          {auction.media?.images?.[0] ? (
                            <img
                              src={auction.media.images[0]}
                              alt={auction.title}
                              className="w-full h-full object-cover"
                            />
                          ) : null}
                        </div>
                        <div className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs uppercase tracking-wide text-primary-600 dark:text-primary-400">
                              {auction.status}
                            </span>
                            <span className="text-xs text-gray-500">{auction.institution?.name || auction.authorityName}</span>
                          </div>
                          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {auction.title}
                          </h2>
                          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                            <MapPinIcon className="w-4 h-4" />
                            <span>{auction.location?.city || 'Location TBA'}</span>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                            <BanknotesIcon className="w-4 h-4" />
                            <span>Reserve: ₹{auction.reservePrice.toLocaleString()}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      <Footer />
    </div>
  )
}
