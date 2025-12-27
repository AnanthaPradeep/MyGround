import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

/**
 * Compact search bar for header/navigation
 */
export default function HeaderSearchBar() {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
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
          className="w-full px-4 py-2 pl-10 pr-12 sm:pr-20 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 sm:px-3 py-1 bg-primary-600 text-white text-xs sm:text-sm rounded-md hover:bg-primary-700 font-medium"
          aria-label="Search"
        >
          <span className="hidden sm:inline">Search</span>
          <MagnifyingGlassIcon className="sm:hidden h-4 w-4 text-white" />
        </button>
      </div>
    </form>
  )
}

