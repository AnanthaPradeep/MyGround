import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by location, property type, or keywords..."
          className="w-full px-6 py-4 pl-14 pr-32 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white shadow-lg"
        />
        <MagnifyingGlassIcon className="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
        >
          Search
        </button>
      </div>
    </form>
  )
}

