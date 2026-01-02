import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useTransactionTypes } from '../hooks/useTransactionTypes'
import { usePropertyTypes } from '../hooks/usePropertyTypes'
import { useAuthStore } from '../store/authStore'

interface QuickFiltersProps {
  showLoginModal?: () => void
}

export default function QuickFilters({ showLoginModal }: QuickFiltersProps) {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [selectedTransaction, setSelectedTransaction] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const transactionScrollRef = useRef<HTMLDivElement>(null)
  const categoryScrollRef = useRef<HTMLDivElement>(null)
  const [transactionOverflows, setTransactionOverflows] = useState(false)
  const [categoryOverflows, setCategoryOverflows] = useState(false)

  // Fetch data from API/JSON
  const { transactionTypes } = useTransactionTypes({ useSampleData: true })
  const { propertyTypes } = usePropertyTypes({ useSampleData: true })

  // Filter to show only main transaction types in quick filters
  const mainTransactionTypes = transactionTypes.filter((t) => ['SELL', 'RENT', 'LEASE'].includes(t.value))
  const mainPropertyCategories = propertyTypes.filter((p) => ['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'LAND', 'SPECIAL', 'ISLAND'].includes(p.value))

  const checkOverflow = (ref: React.RefObject<HTMLDivElement>, setOverflow: (value: boolean) => void) => {
    if (ref.current) {
      const hasOverflow = ref.current.scrollWidth > ref.current.clientWidth
      setOverflow(hasOverflow)
    }
  }

  useEffect(() => {
    checkOverflow(transactionScrollRef, setTransactionOverflows)
    checkOverflow(categoryScrollRef, setCategoryOverflows)

    const handleResize = () => {
      checkOverflow(transactionScrollRef, setTransactionOverflows)
      checkOverflow(categoryScrollRef, setCategoryOverflows)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleFilter = (type: string, value: string) => {
    if (!isAuthenticated) {
      if (showLoginModal) {
        showLoginModal()
      }
      return
    }

    if (type === 'transaction') {
      setSelectedTransaction(value)
      navigate(`/properties?transactionType=${value}`)
    } else if (type === 'category') {
      setSelectedCategory(value)
      navigate(`/properties?propertyCategory=${value}`)
    }
  }

  const handleQuickAction = (filter: string) => {
    if (!isAuthenticated) {
      if (showLoginModal) {
        showLoginModal()
      }
      return
    }
    // Navigate with the quick action filter
    navigate(`/properties?${filter}=true`)
  }

  const scroll = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = 200
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div className="mt-8 space-y-4">
      {/* Transaction Type Pills */}
      <div>
        <p className="text-primary-100 text-sm mb-2">Transaction Type</p>
        <div className="relative">
          {transactionOverflows && (
            <button
              onClick={() => scroll(transactionScrollRef, 'left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm"
              aria-label="Scroll left"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
          )}
          <div
            ref={transactionScrollRef}
            className={`flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth ${
              transactionOverflows ? 'px-8' : 'px-0'
            }`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {mainTransactionTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => handleFilter('transaction', type.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                  selectedTransaction === type.value
                    ? 'bg-white text-primary-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
          {transactionOverflows && (
            <button
              onClick={() => scroll(transactionScrollRef, 'right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm"
              aria-label="Scroll right"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Property Category Pills */}
      <div>
        <p className="text-primary-100 text-sm mb-2">Property Type</p>
        <div className="relative">
          {categoryOverflows && (
            <button
              onClick={() => scroll(categoryScrollRef, 'left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm"
              aria-label="Scroll left"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
          )}
          <div
            ref={categoryScrollRef}
            className={`flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth ${
              categoryOverflows ? 'px-8' : 'px-0'
            }`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {mainPropertyCategories.map((category) => (
              <button
                key={category.value}
                onClick={() => handleFilter('category', category.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                  selectedCategory === category.value
                    ? 'bg-white text-primary-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
          {categoryOverflows && (
            <button
              onClick={() => scroll(categoryScrollRef, 'right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm"
              aria-label="Scroll right"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-2 pt-2">
        <button 
          onClick={() => handleQuickAction('verified')}
          className="px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium hover:bg-white/30"
        >
          Verified Only
        </button>
        <button 
          onClick={() => handleQuickAction('readyToMove')}
          className="px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium hover:bg-white/30"
        >
          Ready to Move
        </button>
        <button 
          onClick={() => handleQuickAction('underConstruction')}
          className="px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium hover:bg-white/30"
        >
          Under Construction
        </button>
      </div>
    </div>
  )
}

