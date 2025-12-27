import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useProperties } from '../hooks/useProperties'
import { Property } from '../types/property'
import { HomeIcon, MagnifyingGlassIcon, UserIcon, EyeIcon, HeartIcon, ChatBubbleLeftIcon, TrashIcon, PauseIcon, PlayIcon, Bars3Icon } from '@heroicons/react/24/outline'
import ProtectedRoute from '../components/ProtectedRoute'
import UserDropdown from '../components/UserDropdown'
import Logo from '../components/Logo'
import HeaderSearchBar from '../components/HeaderSearchBar'
import HeaderIcons from '../components/HeaderIcons'
import HeaderLocation from '../components/HeaderLocation'
import MobileMenu from '../components/MobileMenu'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const { properties, loading, refetch } = useProperties({ 
    useSampleData: false, // Fetch from API to get user's own properties
    filters: { listedBy: user?.id } // Filter to show only user's properties
  })
  const [activeTab, setActiveTab] = useState<'properties' | 'saved' | 'profile'>('properties')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [pausingId, setPausingId] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleDelete = async (propertyId: string, propertyTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${propertyTitle}"? This action cannot be undone.`)) {
      return
    }

    setDeletingId(propertyId)
    try {
      await api.delete(`/properties/${propertyId}`)
      toast.success('Property deleted successfully')
      refetch() // Refresh the list
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete property')
    } finally {
      setDeletingId(null)
    }
  }

  const handlePause = async (propertyId: string) => {
    setPausingId(propertyId)
    try {
      await api.put(`/properties/${propertyId}/pause`)
      toast.success('Property paused. It is now hidden from public view.')
      refetch() // Refresh the list
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to pause property')
    } finally {
      setPausingId(null)
    }
  }

  const handleResume = async (propertyId: string) => {
    setPausingId(propertyId)
    try {
      await api.put(`/properties/${propertyId}/resume`)
      toast.success('Property resumed. It is now visible to the public.')
      refetch() // Refresh the list
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to resume property')
    } finally {
      setPausingId(null)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
            <div className="flex justify-between items-center h-14 sm:h-16">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
                aria-label="Open menu"
              >
                <Bars3Icon className="w-6 h-6" />
              </button>

              {/* Logo - Hidden on mobile (shown in menu), visible on desktop */}
              <Logo showText={true} size="md" className="hidden lg:flex lg:flex-1" />
              
              <div className="hidden sm:block flex-1 min-w-0 lg:flex-none lg:max-w-md">
                <HeaderSearchBar />
              </div>
              <div className="hidden lg:flex items-center gap-2 xl:gap-4">
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

        {/* Mobile Menu */}
        <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-gray-600">Manage your properties, saved searches, and profile</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {properties.length}
              </div>
              <div className="text-gray-600">Total Properties</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {properties.filter(p => p.status === 'APPROVED').length}
              </div>
              <div className="text-gray-600">Active Listings</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {properties.reduce((sum, p) => sum + p.views, 0)}
              </div>
              <div className="text-gray-600">Total Views</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {properties.reduce((sum, p) => sum + p.inquiries, 0)}
              </div>
              <div className="text-gray-600">Total Inquiries</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                {[
                  { id: 'properties', label: 'My Properties', icon: HomeIcon },
                  { id: 'saved', label: 'Saved Searches', icon: MagnifyingGlassIcon },
                  { id: 'profile', label: 'Profile', icon: UserIcon },
                ].map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-6 py-4 text-sm font-medium border-b-2 flex items-center ${
                        activeTab === tab.id
                          ? 'border-primary-600 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-2" />
                      {tab.label}
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'properties' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">My Properties</h2>
                    <Link
                      to="/properties/create"
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      + Add New Property
                    </Link>
                  </div>

                  {loading ? (
                    <div className="text-center py-12">Loading...</div>
                  ) : properties.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-600 mb-4">You haven't listed any properties yet</p>
                      <Link
                        to="/properties/create"
                        className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                      >
                        List Your First Property
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {properties.map((property) => (
                        <div
                          key={property._id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <Link
                                to={`/properties/${property._id}`}
                                className="text-lg font-semibold text-gray-900 hover:text-primary-600"
                              >
                                {property.title}
                              </Link>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                                <span className="flex items-center space-x-1">
                                  <EyeIcon className="w-4 h-4" />
                                  <span>{property.views} views</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <HeartIcon className="w-4 h-4" />
                                  <span>{property.saves} saves</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <ChatBubbleLeftIcon className="w-4 h-4" />
                                  <span>{property.inquiries} inquiries</span>
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  property.status === 'APPROVED'
                                    ? 'bg-green-100 text-green-700'
                                    : property.status === 'PENDING'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : property.status === 'DRAFT'
                                    ? 'bg-gray-100 text-gray-700'
                                    : property.status === 'PAUSED'
                                    ? 'bg-orange-100 text-orange-700'
                                    : 'bg-red-100 text-red-700'
                                }`}
                              >
                                {property.status}
                              </span>
                              <Link
                                to={`/properties/${property._id}`}
                                className="px-3 py-1 text-sm text-primary-600 hover:text-primary-700"
                              >
                                View
                              </Link>
                              {property.status === 'PAUSED' ? (
                                <button
                                  onClick={() => handleResume(property._id)}
                                  disabled={pausingId === property._id}
                                  className="px-3 py-1 text-sm text-green-600 hover:text-green-700 disabled:opacity-50 flex items-center gap-1"
                                  title="Resume property (make it public)"
                                >
                                  <PlayIcon className="w-4 h-4" />
                                  Resume
                                </button>
                              ) : (
                                <button
                                  onClick={() => handlePause(property._id)}
                                  disabled={pausingId === property._id}
                                  className="px-3 py-1 text-sm text-orange-600 hover:text-orange-700 disabled:opacity-50 flex items-center gap-1"
                                  title="Pause property (make it private)"
                                >
                                  <PauseIcon className="w-4 h-4" />
                                  Pause
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(property._id, property.title)}
                                disabled={deletingId === property._id}
                                className="px-3 py-1 text-sm text-red-600 hover:text-red-700 disabled:opacity-50 flex items-center gap-1"
                                title="Delete property permanently"
                              >
                                <TrashIcon className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'saved' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Saved Searches</h2>
                  <div className="text-center py-12">
                    <p className="text-gray-600 mb-4">No saved searches yet</p>
                    <Link
                      to="/properties"
                      className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      Browse Properties
                    </Link>
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.firstName}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.lastName}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue={user?.email}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.role}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trust Score
                      </label>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary-600"
                            style={{ width: `${user?.trustScore || 0}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {user?.trustScore || 0}/100
                        </span>
                      </div>
                    </div>
                    <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

