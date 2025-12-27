import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { ChevronDownIcon, UserIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'

export default function UserDropdown() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsOpen(false)
  }

  const handleMenuItemClick = () => {
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-semibold">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </span>
        </div>
        <span className="text-sm font-medium text-gray-700">{user?.firstName}</span>
        <ChevronDownIcon
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>

          <Link
            to="/profile"
            onClick={handleMenuItemClick}
            className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <UserIcon className="w-5 h-5 text-gray-500" />
            <span>Profile</span>
          </Link>

          <Link
            to="/settings"
            onClick={handleMenuItemClick}
            className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Cog6ToothIcon className="w-5 h-5 text-gray-500" />
            <span>Settings</span>
          </Link>

          <div className="border-t border-gray-200 my-1"></div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  )
}

