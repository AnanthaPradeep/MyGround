import { useEffect, useMemo, useState } from 'react'
import { Bars3Icon, CreditCardIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { useAuthStore } from '../store/authStore'
import { useLocationStore } from '../store/locationStore'
import Logo from '../components/Logo'
import HeaderSearchDropdown from '../components/HeaderSearchDropdown'
import HeaderIcons from '../components/HeaderIcons'
import HeaderLocation from '../components/HeaderLocation'
import MobileMenu from '../components/MobileMenu'
import Footer from '../components/Footer'
import UserDropdown from '../components/UserDropdown'
import { Payment, PaymentMethod, PaymentRule, PaymentUseCase, PaymentStatus } from '../types/payment'
import { fetchPaymentMethods, fetchPaymentHistory, initiatePayment } from '../services/payments'
import PaymentDrawer from '../components/payments/PaymentDrawer'
import toast from 'react-hot-toast'

const useCaseOptions: { value: PaymentUseCase; label: string; description: string }[] = [
  { value: 'SUBSCRIPTION', label: 'Premium Subscription', description: 'Upgrade to premium access' },
  { value: 'FEATURED_LISTING', label: 'Featured Listing', description: 'Boost property visibility' },
  { value: 'AD_PROMOTION', label: 'Ad Promotion', description: 'Promote listings via ads' },
  { value: 'EMD', label: 'EMD (eAuction)', description: 'Earnest Money Deposit' },
  { value: 'BOOKING', label: 'Booking / Token', description: 'Reserve a property' },
  { value: 'SERVICE', label: 'Service Payment', description: 'Legal, valuation, documentation' },
  { value: 'INSTITUTION', label: 'Institutional Payment', description: 'Government / bank workflows' },
]

const statusStyles: Record<PaymentStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  SUCCESS: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  FAILED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  REFUNDED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
}

export default function Payments() {
  const { user } = useAuthStore()
  const { userLocation } = useLocationStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [useCase, setUseCase] = useState<PaymentUseCase>('SUBSCRIPTION')
  const [amount, setAmount] = useState(999)
  const [currency, setCurrency] = useState('INR')
  const [methods, setMethods] = useState<PaymentMethod[]>([])
  const [rule, setRule] = useState<PaymentRule | null>(null)
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [loadingMethods, setLoadingMethods] = useState(false)
  const [initiating, setInitiating] = useState(false)
  const [history, setHistory] = useState<Payment[]>([])

  const region = useMemo(() => userLocation?.country || 'IN', [userLocation])

  useEffect(() => {
    const load = async () => {
      setLoadingMethods(true)
      try {
        const data = await fetchPaymentMethods(useCase, region, amount, currency)
        setMethods(data.methods || [])
        setRule(data.rule)
        if (data.methods?.length) {
          setSelectedMethod(data.methods[0].methodId)
        } else {
          setSelectedMethod('')
        }
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Failed to load payment methods')
        setMethods([])
        setRule(null)
      } finally {
        setLoadingMethods(false)
      }
    }
    load()
  }, [useCase, region, amount, currency])

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await fetchPaymentHistory(1, 5)
        setHistory(data.payments || [])
      } catch {
        setHistory([])
      }
    }
    loadHistory()
  }, [])

  const handleInitiate = async (metadata: Record<string, any>) => {
    if (!selectedMethod) {
      toast.error('Select a payment method')
      return
    }

    setInitiating(true)
    try {
      const idempotencyKey = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `mg_${Date.now()}_${Math.random().toString(16).slice(2)}`
      const response = await initiatePayment({
        useCase,
        methodId: selectedMethod,
        amount,
        currency,
        metadata: {
          userType: user?.role,
          ...metadata,
        },
        idempotencyKey,
      })
      toast.success(`Payment initiated via ${response.gateway.provider}`)
      const updated = await fetchPaymentHistory(1, 5)
      setHistory(updated.payments || [])
      setIsDrawerOpen(false)
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to initiate payment')
    } finally {
      setInitiating(false)
    }
  }

  const selectedMethodData = methods.find((method) => method.methodId === selectedMethod) || null
  const userTypeLabel = user?.role === 'INSTITUTION' || ['ADMIN', 'BANK', 'NBFC', 'GOVT', 'COURT', 'INSTITUTION'].includes(user?.role || '')
    ? 'Institution'
    : user?.isPremium
    ? 'Premium'
    : 'Non-Premium'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
              aria-label="Open menu"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>

            <Logo showText={true} size="md" className="hidden lg:flex lg:flex-1" />

            <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
              <HeaderSearchDropdown />
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

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <CreditCardIcon className="w-7 h-7 text-primary-600 dark:text-primary-400" />
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Payments</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Backend-driven payments with premium eligibility, compliance checks, and audit-ready status tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Select Payment Use-Case</h2>
              <select
                value={useCase}
                onChange={(e) => setUseCase(e.target.value as PaymentUseCase)}
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                {useCaseOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {useCaseOptions.find((item) => item.value === useCase)?.description}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Payment Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Currency</label>
                  <input
                    type="text"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                    className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Payment Methods</h2>
                {loadingMethods && <span className="text-sm text-gray-500">Loading...</span>}
              </div>

              {methods.length === 0 && !loadingMethods ? (
                <div className="text-sm text-gray-500 dark:text-gray-400">No payment methods available for this use-case.</div>
              ) : (
                <div className="space-y-3">
                  {methods.map((method) => (
                    <button
                      key={method.methodId}
                      type="button"
                      onClick={() => {
                        setSelectedMethod(method.methodId)
                        setIsDrawerOpen(true)
                      }}
                      className={`w-full text-left flex items-center justify-between border rounded-lg p-4 transition-colors ${
                        selectedMethod === method.methodId
                          ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/30'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{method.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Limits: {method.minAmount.toLocaleString()} - {method.maxAmount.toLocaleString()} {currency}
                        </p>
                      </div>
                      <span className="inline-flex h-3 w-3 rounded-full border border-gray-400 items-center justify-center">
                        {selectedMethod === method.methodId && (
                          <span className="h-2 w-2 rounded-full bg-primary-600" />
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheckIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Compliance</h3>
              </div>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>Premium Required: <span className="font-medium">{rule?.requiresPremium ? 'Yes' : 'No'}</span></li>
                <li>KYC Required: <span className="font-medium">{rule?.requiresKYC ? 'Yes' : 'No'}</span></li>
                <li>Refundable: <span className="font-medium">{rule?.refundable ? 'Eligible' : 'No'}</span></li>
                <li>Region: <span className="font-medium">{region}</span></li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <button
                onClick={() => setIsDrawerOpen(true)}
                disabled={!selectedMethod}
                className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                Continue to pay
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Recent Payments</h3>
              {history.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No payments yet.</p>
              ) : (
                <div className="space-y-3">
                  {history.map((payment) => (
                    <div key={payment.paymentId} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{payment.useCase}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${statusStyles[payment.status as PaymentStatus]}`}>
                          {payment.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {payment.amount.toLocaleString()} {payment.currency} · {payment.methodId}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <PaymentDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        method={selectedMethodData}
        rule={rule}
        amount={amount}
        currency={currency}
        useCase={useCase}
        userTypeLabel={userTypeLabel}
        initiating={initiating}
        onConfirm={handleInitiate}
      />
    </div>
  )
}
