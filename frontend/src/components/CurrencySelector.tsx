import { useState, useRef, useEffect } from 'react'
import { BanknotesIcon, ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useCurrencyStore, Currency } from '../store/currencyStore'
import { useCurrencies } from '../hooks/useCurrencies'

interface CurrencySelectorProps {
  className?: string
  showLabel?: boolean
  compact?: boolean
}

/**
 * Currency Selector Component
 * Allows users to select their preferred currency
 */
export default function CurrencySelector({
  className = '',
  showLabel = false,
  compact = false,
}: CurrencySelectorProps) {
  const { selectedCurrency, setCurrency } = useCurrencyStore()
  const { currencies, loading } = useCurrencies()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filter currencies based on search query
  const filteredCurrencies = currencies.filter((currency) =>
    currency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    currency.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    currency.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectCurrency = (currency: Currency) => {
    setCurrency(currency)
    setIsOpen(false)
    setSearchQuery('')
  }

  if (compact) {
    return (
      <div className={`relative ${className}`} ref={containerRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <span className="text-primary-600 font-bold">{selectedCurrency?.symbol || '₹'}</span>
          <span className="text-xs">{selectedCurrency?.code || 'INR'}</span>
          <ChevronDownIcon className={`w-3 h-3 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-[100] min-w-[280px] max-h-80 overflow-hidden">
            <div className="p-3 border-b border-gray-200">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search currency..."
                  className="w-full px-3 py-2 pl-8 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <BanknotesIcon className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto scrollbar-hide">
              {loading ? (
                <div className="p-4 text-center text-sm text-gray-500">Loading currencies...</div>
              ) : filteredCurrencies.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">No currencies found</div>
              ) : (
                filteredCurrencies.map((currency) => (
                  <button
                    key={currency.code}
                    type="button"
                    onClick={() => handleSelectCurrency(currency)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors text-sm border-b border-gray-100 last:border-b-0 ${
                      selectedCurrency?.code === currency.code
                        ? 'bg-primary-50 text-primary-600 font-medium'
                        : 'text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-primary-600">{currency.symbol}</span>
                        <div>
                          <div className="font-medium">{currency.name}</div>
                          <div className="text-xs text-gray-500">{currency.code}</div>
                        </div>
                      </div>
                      {selectedCurrency?.code === currency.code && (
                        <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
      >
        <BanknotesIcon className="w-5 h-5 text-primary-600" />
        {showLabel && <span className="text-xs text-gray-600">Currency:</span>}
        <span className="text-primary-600 font-bold text-base">{selectedCurrency?.symbol || '₹'}</span>
        <span className="text-xs text-gray-600">{selectedCurrency?.code || 'INR'}</span>
        <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-[100] min-w-[320px] max-h-80 overflow-hidden">
          <div className="p-3 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 text-sm">Select Currency</h3>
            <button
              onClick={() => {
                setIsOpen(false)
                setSearchQuery('')
              }}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search currency..."
                className="w-full px-3 py-2 pl-8 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <CurrencyIcon className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto scrollbar-hide">
            {loading ? (
              <div className="p-4 text-center text-sm text-gray-500">Loading currencies...</div>
            ) : filteredCurrencies.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">No currencies found</div>
            ) : (
              filteredCurrencies.map((currency) => (
                <button
                  key={currency.code}
                  type="button"
                  onClick={() => handleSelectCurrency(currency)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors text-sm border-b border-gray-100 last:border-b-0 ${
                    selectedCurrency?.code === currency.code
                      ? 'bg-primary-50 text-primary-600 font-medium'
                      : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-primary-600">{currency.symbol}</span>
                      <div>
                        <div className="font-medium">{currency.name}</div>
                        <div className="text-xs text-gray-500">{currency.code}</div>
                      </div>
                    </div>
                    {selectedCurrency?.code === currency.code && (
                      <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

