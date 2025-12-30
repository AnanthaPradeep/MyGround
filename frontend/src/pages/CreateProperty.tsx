import { useState, useEffect, useRef, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { CheckIcon } from '@heroicons/react/24/solid'
import { Bars3Icon, DocumentTextIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import api from '../services/api'
import { PropertyFormData } from '../types/property'
import { useProperty } from '../hooks/useProperties'
import { useDrafts } from '../hooks/useDrafts'
import { useAuthStore } from '../store/authStore'
import Step1Category from '../components/property/Step1Category'
import Step2Location from '../components/property/Step2Location'
import Step3Details from '../components/property/Step3Details'
import Step4Pricing from '../components/property/Step4Pricing'
import Step5Media from '../components/property/Step5Media'
import Step6Legal from '../components/property/Step6Legal'
import Step7Review from '../components/property/Step7Review'
import UserDropdown from '../components/UserDropdown'
import { PageLoader } from '../components/Loader'
import Logo from '../components/Logo'
import HeaderSearchBar from '../components/HeaderSearchBar'
import HeaderIcons from '../components/HeaderIcons'
import HeaderLocation from '../components/HeaderLocation'
import MobileMenu from '../components/MobileMenu'
import Footer from '../components/Footer'

const STEPS = [
  { id: 1, name: 'Category', component: Step1Category },
  { id: 2, name: 'Location', component: Step2Location },
  { id: 3, name: 'Details', component: Step3Details },
  { id: 4, name: 'Pricing', component: Step4Pricing },
  { id: 5, name: 'Media', component: Step5Media },
  { id: 6, name: 'Legal', component: Step6Legal },
  { id: 7, name: 'Review', component: Step7Review },
]

export default function CreateProperty() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const draftIdFromUrl = searchParams.get('draftId')
  const isEditMode = !!id
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [propertyId, setPropertyId] = useState<string | null>(id || null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoadingProperty, setIsLoadingProperty] = useState(isEditMode)
  const [draftId, setDraftId] = useState<string | null>(draftIdFromUrl)
  const [isDraftMode, setIsDraftMode] = useState(!!draftIdFromUrl)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const draftLoadedRef = useRef(false) // Track if draft has been loaded to prevent duplicate toasts
  const navigate = useNavigate()
  const { user } = useAuthStore()

  // Fetch property data if in edit mode
  const { property, loading: propertyLoading } = useProperty(id || '', !isEditMode)
  
  // Fetch draft if draftId is present
  const { getDraft, saveDraft } = useDrafts({ userId: user?.id })

  const form = useForm<PropertyFormData>({
    defaultValues: {
      transactionType: 'SELL',
      propertyCategory: 'RESIDENTIAL',
      propertySubType: '',
      location: {
        country: 'India',
        state: '',
        city: '',
        area: '',
        locality: '',
        pincode: '',
        coordinates: {
          type: 'Point',
          coordinates: [0, 0],
        },
        address: '',
      },
      title: '',
      description: '',
      ownershipType: 'FREEHOLD',
      possessionStatus: 'READY',
      pricing: {
        priceNegotiable: true,
        currency: 'INR',
      },
      media: {
        images: [],
      },
      legal: {
        titleClear: false,
        encumbranceFree: false,
        litigationStatus: 'NONE',
      },
    },
    mode: 'onChange',
  })

  // Load draft data on mount if draftId is present
  useEffect(() => {
    const loadDraft = async () => {
      // Prevent duplicate loading and duplicate toast messages
      if (draftLoadedRef.current) return
      
      if (draftId && !isEditMode) {
        draftLoadedRef.current = true // Mark as loaded
        setIsLoadingProperty(true)
        try {
          const draft = await getDraft(draftId)
          if (draft) {
            setIsDraftMode(true)
            setCurrentStep(draft.currentStep || 1)
            setLastSaved(new Date(draft.lastSaved))
            
            // Populate form with draft data
            if (draft.propertyData) {
              form.reset({
                ...draft.propertyData,
                // Ensure all required fields have defaults
                location: draft.propertyData.location || form.getValues().location,
                pricing: draft.propertyData.pricing || form.getValues().pricing,
                media: draft.propertyData.media || form.getValues().media,
                legal: draft.propertyData.legal || form.getValues().legal,
              })
            }
            
            // Show toast only once
            toast.success('Your property details were saved as a draft and have been restored.', {
              duration: 5000,
            })
          }
        } catch (error: any) {
          console.error('Error loading draft:', error)
          draftLoadedRef.current = false // Reset on error so it can retry
        } finally {
          setIsLoadingProperty(false)
        }
      } else if (!isEditMode) {
        setIsLoadingProperty(false)
      }
    }
    
    loadDraft()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftId, isEditMode])

  // Load property data into form when in edit mode
  useEffect(() => {
    if (isEditMode && property && !propertyLoading) {
      setIsLoadingProperty(false)
      // Populate form with existing property data
      form.reset({
        transactionType: property.transactionType,
        propertyCategory: property.propertyCategory,
        propertySubType: property.propertySubType || '',
        location: property.location,
        title: property.title,
        description: property.description || '',
        ownershipType: property.ownershipType,
        possessionStatus: property.possessionStatus,
        pricing: property.pricing,
        residential: property.residential,
        commercial: property.commercial,
        land: property.land,
        media: property.media,
        legal: property.legal,
      })
    }
  }, [isEditMode, property, propertyLoading, form])

  // Auto-save draft functionality
  const autoSaveDraft = useCallback(async (showToast = false) => {
    if (!user?.id || isEditMode) return // Don't auto-save in edit mode
    
    const formData = form.getValues()
    
    // Check if there's meaningful data to save
    const hasData = 
      formData.title || 
      formData.location?.city || 
      formData.pricing?.expectedPrice || 
      formData.pricing?.rentAmount || 
      formData.description
    
    if (!hasData && !draftId) return // Don't save empty drafts
    
    setIsSavingDraft(true)
    
    try {
      const savedDraft = await saveDraft(draftId, formData, currentStep)
      
      if (savedDraft) {
        if (!draftId) {
          setDraftId(savedDraft.draftId)
          setIsDraftMode(true)
          // Update URL without navigation
          const newUrl = `/properties/create?draftId=${savedDraft.draftId}`
          window.history.replaceState({}, '', newUrl)
        }
        
        setLastSaved(new Date(savedDraft.lastSaved))
        
        // Trigger custom event to update draft count in other components
        window.dispatchEvent(new CustomEvent('draftSaved', { 
          detail: { draftId: savedDraft.draftId } 
        }))
        
        if (showToast) {
          toast.success('Draft saved successfully!')
        }
      }
    } catch (error: any) {
      if (showToast) {
        toast.error('Failed to save draft. Your data is safe in browser storage.')
      }
    } finally {
      setIsSavingDraft(false)
    }
  }, [user?.id, isEditMode, form, draftId, currentStep, saveDraft])

  // Debounced auto-save on form changes
  useEffect(() => {
    if (!user?.id || isEditMode) return
    
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    
    // Set new timeout for auto-save (10-15 seconds as per spec)
    saveTimeoutRef.current = setTimeout(() => {
      autoSaveDraft(false)
    }, 12000) // 12 seconds
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [form.watch(), currentStep, user?.id, isEditMode, autoSaveDraft])

  // Auto-save on step change
  useEffect(() => {
    if (!user?.id || isEditMode || currentStep === 1) return
    autoSaveDraft(false)
  }, [currentStep, user?.id, isEditMode, autoSaveDraft])

  // Auto-save before page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!user?.id || isEditMode) return
      // Use sendBeacon for reliable save on page unload
      const formData = form.getValues()
      const hasData = 
        formData.title || 
        formData.location?.city || 
        formData.pricing?.expectedPrice || 
        formData.pricing?.rentAmount || 
        formData.description
      
      if (hasData) {
        // Save synchronously before unload
        autoSaveDraft(false)
      }
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [user?.id, isEditMode, form, autoSaveDraft])

  const nextStep = async () => {
    const isValid = await form.trigger()
    if (isValid && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const onSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true)
    try {
      // Validate required fields before submission
      if (!data.title || data.title.trim().length < 10) {
        toast.error('Title must be at least 10 characters long')
        setIsSubmitting(false)
        return
      }

      if (!data.description || data.description.trim().length < 50) {
        toast.error('Description must be at least 50 characters long')
        setIsSubmitting(false)
        return
      }

      if (!data.location?.city || !data.location?.state || !data.location?.area || !data.location?.pincode) {
        toast.error('Please complete all location fields (city, state, area, pincode)')
        setIsSubmitting(false)
        return
      }

      if (!data.location?.coordinates?.coordinates || 
          !Array.isArray(data.location.coordinates.coordinates) || 
          data.location.coordinates.coordinates.length !== 2 ||
          data.location.coordinates.coordinates[0] === 0 && data.location.coordinates.coordinates[1] === 0) {
        toast.error('Please select a location on the map')
        setIsSubmitting(false)
        return
      }

      if (!data.media?.images || data.media.images.length < 3) {
        toast.error('Please upload at least 3 images')
        setIsSubmitting(false)
        return
      }

      // Ensure coordinates are properly formatted
      const formattedData = {
        ...data,
        location: {
          ...data.location,
          coordinates: {
            type: 'Point',
            coordinates: Array.isArray(data.location.coordinates?.coordinates) 
              ? data.location.coordinates.coordinates 
              : [data.location.coordinates?.coordinates?.[0] || 0, data.location.coordinates?.coordinates?.[1] || 0]
          }
        }
      }

      let response
      let finalPropertyId: string | null = null
      
      if (propertyId) {
        // Update existing property
        response = await api.put(`/properties/${propertyId}`, formattedData)
        // Use the existing propertyId for updates
        finalPropertyId = propertyId
      } else {
        // Create new property
        response = await api.post('/properties', formattedData)
        // Get property ID from response (could be id or _id)
        finalPropertyId = response.data.property?.id || response.data.property?._id
        if (finalPropertyId) {
          setPropertyId(finalPropertyId)
        }
      }

      // Submit property (auto-approved, no admin review needed)
      // Only submit if status is DRAFT and we have a valid property ID
      // For updates, check if property needs submission (might already be APPROVED)
      const propertyStatus = response.data.property?.status
      if (propertyStatus === 'DRAFT' && finalPropertyId && finalPropertyId !== 'undefined') {
        try {
          // Submit property (changes status from DRAFT to APPROVED)
          await api.post(`/properties/${finalPropertyId}/submit`, {
            draftId: draftId || null, // Pass draftId if exists to delete it
          })
          
          // Delete draft from Draft collection if it was created from a draft
          // This is handled in the backend submit endpoint, but we also try here as a fallback
          if (draftId) {
            try {
              await api.delete(`/drafts/${draftId}`)
              // Trigger custom event to update draft count
              window.dispatchEvent(new CustomEvent('draftSaved'))
            } catch (draftError: any) {
              // Log but don't fail - draft might already be deleted by backend
              console.warn('Failed to delete draft after submission:', draftError.response?.data?.error || draftError.message)
            }
          }
        } catch (submitError: any) {
          // If submit fails, log but don't fail the whole operation
          console.warn('Failed to auto-submit property:', submitError.response?.data?.error || submitError.message)
          // Property is still created/updated, just not auto-submitted
        }
      }

      toast.success(
        isEditMode 
          ? 'Property updated successfully! Changes are now live on MyGround.' 
          : 'Property created successfully! It is now live on MyGround.',
        {
          duration: 5000,
        }
      )
      // Navigate to property detail page if editing, otherwise to home
      const navPropertyId = finalPropertyId || propertyId
      if (isEditMode && navPropertyId) {
        navigate(`/properties/${navPropertyId}`)
      } else if (navPropertyId) {
        navigate(`/properties/${navPropertyId}`)
      } else {
        navigate('/')
      }
    } catch (error: any) {
      console.error('Error submitting property:', error)
      
      // Show detailed validation errors if available
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const errorMessages = error.response.data.errors.map((err: any) => err.msg || err.message).join(', ')
        toast.error(`Validation errors: ${errorMessages}`)
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error)
      } else {
        toast.error('Failed to submit property. Please check all required fields and try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Format time ago helper
  const formatTimeAgo = (date: Date): string => {
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

  const CurrentStepComponent = STEPS[currentStep - 1].component

  // Show loader while fetching property data in edit mode or loading draft
  if ((isEditMode && (isLoadingProperty || propertyLoading)) || (!isEditMode && isLoadingProperty && draftId)) {
    return <PageLoader text={draftId ? "Loading draft..." : "Loading property details..."} />
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-gray-100">
                  {isEditMode ? 'Edit Property' : 'List Your Property'}
                </h1>
                {isDraftMode && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-sm font-medium">
                    <DocumentTextIcon className="w-4 h-4" />
                    Draft
                  </span>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {isEditMode 
                  ? 'Update your property details below' 
                  : 'Fill in the details to create your property listing'}
              </p>
              {isDraftMode && (
                <div className="mt-3 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <CheckCircleIcon className="w-4 h-4" />
                  <span>Saved as Draft</span>
                  {lastSaved && (
                    <>
                      <span className="text-gray-400 dark:text-gray-600">•</span>
                      <span className="text-gray-500 dark:text-gray-400">
                        Last saved {formatTimeAgo(lastSaved)}
                      </span>
                    </>
                  )}
                </div>
              )}
              {isSavingDraft && (
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Saving draft...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex items-center">
            {STEPS.map((step, index) => (
              <div key={step.id} className={`flex items-center ${index < STEPS.length - 1 ? 'flex-1 min-w-0' : 'flex-shrink-0'}`}>
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base ${
                      currentStep > step.id
                        ? 'bg-primary-600 dark:bg-primary-500 text-white'
                        : currentStep === step.id
                        ? 'bg-primary-600 dark:bg-primary-500 text-white ring-4 ring-primary-100 dark:ring-primary-900/50'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span
                    className={`mt-1.5 sm:mt-2 text-[10px] sm:text-xs font-medium text-center whitespace-nowrap ${
                      currentStep >= step.id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-1 sm:mx-2 min-w-[8px] sm:min-w-[12px] ${
                      currentStep > step.id ? 'bg-primary-600 dark:bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
            <CurrentStepComponent form={form} />
          </div>

          {/* Navigation Buttons */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit for Review'}
              </button>
            )}
          </div>
        </form>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

