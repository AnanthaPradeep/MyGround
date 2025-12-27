import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { CheckIcon } from '@heroicons/react/24/solid'
import { Bars3Icon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import api from '../services/api'
import { PropertyFormData } from '../types/property'
import Step1Category from '../components/property/Step1Category'
import Step2Location from '../components/property/Step2Location'
import Step3Details from '../components/property/Step3Details'
import Step4Pricing from '../components/property/Step4Pricing'
import Step5Media from '../components/property/Step5Media'
import Step6Legal from '../components/property/Step6Legal'
import Step7Review from '../components/property/Step7Review'
import UserDropdown from '../components/UserDropdown'
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
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [propertyId, setPropertyId] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

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
      
      if (propertyId) {
        // Update existing property
        response = await api.put(`/properties/${propertyId}`, data)
      } else {
        // Create new property
        response = await api.post('/properties', data)
        setPropertyId(response.data.property.id)
      }

      // Submit property (auto-approved, no admin review needed)
      if (response.data.property.status === 'DRAFT') {
        await api.post(`/properties/${response.data.property.id}/submit`)
      }

      toast.success('Property created successfully! It is now live on MyGround.', {
        duration: 5000,
      })
      navigate('/')
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

  return (
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">List Your Property</h1>
          <p className="text-gray-600">Fill in the details to create your property listing</p>
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

