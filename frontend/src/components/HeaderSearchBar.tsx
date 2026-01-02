import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useAuthStore } from '../store/authStore'

interface HeaderSearchBarProps {
  showLoginModal?: () => void
}

/**
 * Compact search bar for header/navigation
 */
export default function HeaderSearchBar({ showLoginModal }: HeaderSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      if (showLoginModal) {
        showLoginModal()
      } else {
        navigate('/login')
      }
      return
    }
    
    if (searchQuery.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchQuery)}`)
    } else {
      navigate('/properties')
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-2 sm:mx-4 min-w-0">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search properties..."
          className="w-full px-5 py-2.5 pl-11 pr-14 sm:pr-24 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
        />
        <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 sm:px-3 py-1 bg-primary-600 dark:bg-primary-500 text-white text-xs sm:text-sm rounded-md hover:bg-primary-700 dark:hover:bg-primary-600 font-medium"
          aria-label="Search"
        >
          <span className="hidden sm:inline">Search</span>
          <MagnifyingGlassIcon className="sm:hidden h-4 w-4 text-white" />
        </button>
      </div>
    </form>
  )
}

