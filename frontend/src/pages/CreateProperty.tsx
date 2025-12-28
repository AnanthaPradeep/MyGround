import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { CheckIcon } from '@heroicons/react/24/solid'
import { Bars3Icon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import api from '../services/api'
import { PropertyFormData } from '../types/property'
import { useProperty } from '../hooks/useProperties'
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
  const isEditMode = !!id
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [propertyId, setPropertyId] = useState<string | null>(id || null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoadingProperty, setIsLoadingProperty] = useState(isEditMode)
  const navigate = useNavigate()

  // Fetch property data if in edit mode
  const { property, loading: propertyLoading } = useProperty(id || '', !isEditMode)

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
        residentialDetails: property.residentialDetails,
        commercialDetails: property.commercialDetails,
        industrialDetails: property.industrialDetails,
        landDetails: property.landDetails,
        specialDetails: property.specialDetails,
        islandDetails: property.islandDetails,
        media: property.media,
        legal: property.legal,
        availability: property.availability,
      })
    } else if (!isEditMode) {
      setIsLoadingProperty(false)
    }
  }, [isEditMode, property, propertyLoading, form])

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
      let response
      let finalPropertyId: string | null = null
      
      if (propertyId) {
        // Update existing property
        response = await api.put(`/properties/${propertyId}`, data)
        // Use the existing propertyId for updates
        finalPropertyId = propertyId
      } else {
        // Create new property
        response = await api.post('/properties', data)
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
          await api.post(`/properties/${finalPropertyId}/submit`)
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
      toast.error(
        error.response?.data?.error || 'Failed to submit property. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const CurrentStepComponent = STEPS[currentStep - 1].component

  // Show loader while fetching property data in edit mode
  if (isEditMode && (isLoadingProperty || propertyLoading)) {
    return <PageLoader text="Loading property details..." />
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
          <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-gray-100 mb-2">
            {isEditMode ? 'Edit Property' : 'List Your Property'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isEditMode 
              ? 'Update your property details below' 
              : 'Fill in the details to create your property listing'}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      currentStep > step.id
                        ? 'bg-primary-600 text-white'
                        : currentStep === step.id
                        ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckIcon className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium ${
                      currentStep >= step.id ? 'text-primary-600' : 'text-gray-500'
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 ${
                      currentStep > step.id ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <CurrentStepComponent form={form} />
          </div>

          {/* Navigation Buttons */}
          <div className="bg-white rounded-lg shadow-sm p-6 flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit for Review'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

