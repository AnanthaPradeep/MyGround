import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useProperties } from '../hooks/useProperties'
import { useDrafts } from '../hooks/useDrafts'
import { HomeIcon, MagnifyingGlassIcon, UserIcon, EyeIcon, HeartIcon, ChatBubbleLeftIcon, TrashIcon, PauseIcon, PlayIcon, Bars3Icon, DocumentTextIcon, PencilIcon, CheckCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline'
import UserDropdown from '../components/UserDropdown'
import Logo from '../components/Logo'
import HeaderSearchDropdown from '../components/HeaderSearchDropdown'
import HeaderIcons from '../components/HeaderIcons'
import HeaderLocation from '../components/HeaderLocation'
import MobileMenu from '../components/MobileMenu'
import Footer from '../components/Footer'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { properties, loading, refetch } = useProperties({ 
    useSampleData: false, // Fetch from API to get user's own properties
    filters: { listedBy: user?.id } // Filter to show only user's properties
  })
  const { drafts, loading: draftsLoading, refetch: refetchDrafts, deleteDraft, submitDraft, getDraftCount } = useDrafts({ userId: user?.id })
  const [draftCount, setDraftCount] = useState(0)
  
  // Get initial tab from URL params, default to 'properties'
  const tabFromUrl = searchParams.get('tab') as 'properties' | 'drafts' | 'saved' | 'profile' | null
  const [activeTab, setActiveTab] = useState<'properties' | 'drafts' | 'saved' | 'profile'>(
    (tabFromUrl && ['properties', 'drafts', 'saved', 'profile'].includes(tabFromUrl)) ? tabFromUrl : 'properties'
  )

  // Update tab when URL param changes
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && ['properties', 'drafts', 'saved', 'profile'].includes(tab)) {
      setActiveTab(tab as 'properties' | 'drafts' | 'saved' | 'profile')
    }
  }, [searchParams])

  // Update URL when tab changes
  const handleTabChange = (tab: 'properties' | 'drafts' | 'saved' | 'profile') => {
    setActiveTab(tab)
    setSearchParams({ tab })
  }
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [pausingId, setPausingId] = useState<string | null>(null)
  const [submittingDraftId, setSubmittingDraftId] = useState<string | null>(null)
  const [deletingDraftId, setDeletingDraftId] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Fetch draft count
  useEffect(() => {
    const fetchDraftCount = async () => {
      if (user?.id) {
        const count = await getDraftCount()
        setDraftCount(count)
      }
    }
    fetchDraftCount()
  }, [user?.id, getDraftCount, drafts.length])

  // Listen for draft saved events
  useEffect(() => {
    const handleDraftSaved = () => {
      refetchDrafts()
      getDraftCount().then(setDraftCount)
    }
    window.addEventListener('draftSaved', handleDraftSaved)
    return () => {
      window.removeEventListener('draftSaved', handleDraftSaved)
    }
  }, [refetchDrafts, getDraftCount])

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

  const handleEditDraft = (draftId: string) => {
    navigate(`/properties/create?draftId=${draftId}`)
  }

  const handleSubmitDraft = async (draftId: string) => {
    if (!window.confirm('Are you sure you want to submit this draft? It will become a published property.')) {
      return
    }

    setSubmittingDraftId(draftId)
    try {
      await submitDraft(draftId)
      toast.success('Draft submitted successfully! Your property is now live.')
      refetchDrafts()
      refetch() // Refresh properties list
      getDraftCount().then(setDraftCount)
    } catch (error: any) {
      toast.error(error.response?.data?.error || error.message || 'Failed to submit draft')
    } finally {
      setSubmittingDraftId(null)
    }
  }

  const handleDeleteDraft = async (draftId: string) => {
    if (!window.confirm('Are you sure you want to delete this draft? This action cannot be undone.')) {
      return
    }

    setDeletingDraftId(draftId)
    try {
      await deleteDraft(draftId)
      toast.success('Draft deleted successfully')
      getDraftCount().then(setDraftCount)
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete draft')
    } finally {
      setDeletingDraftId(null)
    }
  }

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    return `${days} day${days > 1 ? 's' : ''} ago`
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Navigation */}
        <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
            <div className="flex justify-between items-center h-14 sm:h-16">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                aria-label="Open menu"
              >
                <Bars3Icon className="w-6 h-6" />
              </button>

              {/* Logo - Hidden on mobile (shown in menu), visible on desktop */}
              <Logo showText={true} size="md" className="hidden lg:flex lg:flex-1" />
              
              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
                <HeaderSearchDropdown />
                <HeaderLocation />
                <HeaderIcons />
                <UserDropdown />
              </div>
              
              {/* Mobile: Show only User Dropdown */}
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-gray-100 mb-2">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your properties, saved searches, and profile</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                {properties.length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Total Properties</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {properties.filter(p => p.status === 'APPROVED').length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Active Listings</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border-l-4 border-orange-500 dark:border-orange-600">
              <div className="flex items-center gap-2 mb-2">
                <DocumentTextIcon className="w-8 h-8 text-orange-500 dark:text-orange-400" />
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {draftCount}
                </div>
              </div>
              <div className="text-gray-600 dark:text-gray-400">Draft Properties</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {properties.reduce((sum, p) => sum + (p.inquiries || 0), 0)}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Total Inquiries</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex -mb-px">
                {[
                  { id: 'properties', label: 'My Properties', icon: HomeIcon },
                  { id: 'drafts', label: 'Draft Properties', icon: DocumentTextIcon, badge: draftCount },
                  { id: 'saved', label: 'Saved Searches', icon: MagnifyingGlassIcon },
                  { id: 'profile', label: 'Profile', icon: UserIcon },
                ].map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id as any)}
                      className={`px-6 py-4 text-sm font-medium border-b-2 flex items-center relative ${
                        activeTab === tab.id
                          ? 'border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400'
                          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-2" />
                      {tab.label}
                      {tab.badge && tab.badge > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-orange-500 dark:bg-orange-600 text-white text-xs font-bold rounded-full">
                          {tab.badge > 9 ? '9+' : tab.badge}
                        </span>
                      )}
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'drafts' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Draft Properties</h2>
                    <Link
                      to="/properties/create"
                      className="flex items-center gap-2 px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600"
                    >
                      <PlusCircleIcon className="w-5 h-5" />
                      <span>Create New Draft</span>
                    </Link>
                  </div>

                  {draftsLoading ? (
                    <div className="text-center py-12 text-gray-600 dark:text-gray-400">Loading drafts...</div>
                  ) : drafts.length === 0 ? (
                    <div className="text-center py-12">
                      <DocumentTextIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                      <p className="text-gray-600 dark:text-gray-400 mb-4">You don't have any draft properties yet</p>
                      <Link
                        to="/properties/create"
                        className="inline-block px-6 py-3 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600"
                      >
                        Create Your First Draft
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {drafts.map((draft) => (
                        <div
                          key={draft.draftId}
                          className="border border-orange-300 dark:border-orange-700 rounded-lg p-4 hover:shadow-md dark:hover:shadow-gray-900/50 transition-shadow bg-orange-50 dark:bg-orange-900/20"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <DocumentTextIcon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                  {draft.propertyData?.title || 'Untitled Draft'}
                                </h3>
                                <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-xs font-medium">
                                  Draft
                                </span>
                              </div>
                              <p className="text-sm text-orange-600 dark:text-orange-400 mb-2">
                                Draft - Not visible to public
                              </p>
                              {draft.propertyData?.location?.city && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                  Location: {draft.propertyData.location.area || draft.propertyData.location.locality}, {draft.propertyData.location.city}
                                </p>
                              )}
                              {draft.propertyData?.pricing && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                  {draft.propertyData.pricing.expectedPrice 
                                    ? `Price: ₹${(draft.propertyData.pricing.expectedPrice / 100000).toFixed(1)}L`
                                    : draft.propertyData.pricing.rentAmount 
                                    ? `Rent: ₹${(draft.propertyData.pricing.rentAmount / 1000).toFixed(0)}K/mo`
                                    : 'Price not set'}
                                </p>
                              )}
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 flex items-center gap-2">
                                <span>Last updated: {formatTimeAgo(draft.updatedAt)}</span>
                                <span className="text-gray-400 dark:text-gray-600">•</span>
                                <span>Step {draft.currentStep} of 7</span>
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEditDraft(draft.draftId)}
                                className="px-3 py-1 text-sm bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 flex items-center gap-1"
                                title="Continue editing this draft"
                              >
                                <PencilIcon className="w-4 h-4" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleSubmitDraft(draft.draftId)}
                                disabled={submittingDraftId === draft.draftId}
                                className="px-3 py-1 text-sm bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 disabled:opacity-50 flex items-center gap-1"
                                title="Submit draft as published property"
                              >
                                <CheckCircleIcon className="w-4 h-4" />
                                Submit
                              </button>
                              <button
                                onClick={() => handleDeleteDraft(draft.draftId)}
                                disabled={deletingDraftId === draft.draftId}
                                className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 disabled:opacity-50 flex items-center gap-1"
                                title="Delete this draft permanently"
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

              {activeTab === 'properties' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">My Properties</h2>
                    <Link
                      to="/properties/create"
                      className="flex items-center gap-2 px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600"
                    >
                      <PlusCircleIcon className="w-5 h-5" />
                      <span>Add New Property</span>
                    </Link>
                  </div>

                  {loading ? (
                    <div className="text-center py-12 text-gray-600 dark:text-gray-400">Loading...</div>
                  ) : properties.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-600 dark:text-gray-400 mb-4">You haven't listed any properties yet</p>
                      <Link
                        to="/properties/create"
                        className="inline-block px-6 py-3 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600"
                      >
                        List Your First Property
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {properties.map((property) => (
                        <div
                          key={property._id}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md dark:hover:shadow-gray-900/50 transition-shadow bg-white dark:bg-gray-700/50"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <Link
                                to={`/properties/${property._id}`}
                                className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400"
                              >
                                {property.title}
                              </Link>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
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
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                    : property.status === 'PENDING'
                                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                    : property.status === 'DRAFT'
                                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    : property.status === 'PAUSED'
                                    ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                }`}
                              >
                                {property.status}
                              </span>
                              <Link
                                to={`/properties/${property._id}`}
                                className="px-3 py-1 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                              >
                                View
                              </Link>
                              {property.status === 'PAUSED' ? (
                                <button
                                  onClick={() => handleResume(property._id)}
                                  disabled={pausingId === property._id}
                                  className="px-3 py-1 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 disabled:opacity-50 flex items-center gap-1"
                                  title="Resume property (make it public)"
                                >
                                  <PlayIcon className="w-4 h-4" />
                                  Resume
                                </button>
                              ) : (
                                <button
                                  onClick={() => handlePause(property._id)}
                                  disabled={pausingId === property._id}
                                  className="px-3 py-1 text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 disabled:opacity-50 flex items-center gap-1"
                                  title="Pause property (make it private)"
                                >
                                  <PauseIcon className="w-4 h-4" />
                                  Pause
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(property._id, property.title)}
                                disabled={deletingId === property._id}
                                className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 disabled:opacity-50 flex items-center gap-1"
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
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Saved Searches</h2>
                  <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">No saved searches yet</p>
                    <Link
                      to="/properties"
                      className="inline-block px-6 py-3 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600"
                    >
                      Browse Properties
                    </Link>
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Profile Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.firstName}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
        
      {/* Footer */}
      <Footer />
    </div>
  )
}

