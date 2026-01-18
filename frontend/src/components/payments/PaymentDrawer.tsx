import { useEffect, useMemo, useRef, useState } from 'react'
import { XMarkIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { PaymentMethod, PaymentRule, PaymentUseCase } from '../../types/payment'
import QRCodeImage from './QRCodeImage'

interface PaymentDrawerProps {
  open: boolean
  onClose: () => void
  method: PaymentMethod | null
  rule: PaymentRule | null
  amount: number
  currency: string
  useCase: PaymentUseCase
  userTypeLabel: string
  initiating: boolean
  onConfirm: (metadata: Record<string, any>) => void
}

const fieldLabels: Record<string, string> = {
  cardNumber: 'Card Number',
  expiry: 'Expiry (MM/YY)',
  cvv: 'CVV',
  cardholderName: 'Cardholder Name',
  saveCard: 'Save card for faster checkout',
  upiApp: 'UPI App',
  upiId: 'UPI ID',
  walletProvider: 'Wallet Provider',
  accountName: 'Account Name',
  accountNumber: 'Account Number',
  ifsc: 'IFSC Code',
  bankName: 'Bank Name',
  referenceNumber: 'Reference Number',
  proofUpload: 'Upload Proof',
  bnplProvider: 'BNPL Provider',
  cryptoWallet: 'Crypto Wallet Address',
  offlineReference: 'Offline Reference',
}

const selectOptions: Record<string, string[]> = {
  upiApp: ['Google Pay', 'PhonePe', 'Paytm', 'BHIM'],
  walletProvider: ['Apple Pay', 'Google Pay', 'PayPal'],
  bnplProvider: ['Simpl', 'Lazypay', 'ZestMoney'],
}

export default function PaymentDrawer({
  open,
  onClose,
  method,
  rule,
  amount,
  currency,
  useCase,
  userTypeLabel,
  initiating,
  onConfirm,
}: PaymentDrawerProps) {
  const [formState, setFormState] = useState<Record<string, any>>({})
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const fields = useMemo(() => method?.fields || [], [method])
  const overMin = method ? amount >= method.minAmount : true
  const belowMax = method ? amount <= method.maxAmount : true
  const qrPayload = method?.qrPayload || (method?.upiVpa ? `upi://pay?pa=${encodeURIComponent(method.upiVpa)}&pn=MyGround&am=${amount.toFixed(2)}&cu=${currency}` : '')

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      setFormState({})
      setTimeout(() => closeButtonRef.current?.focus(), 0)
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [open, method?.methodId])

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    if (open) {
      window.addEventListener('keydown', handleKey)
    }
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open || !method) return null

  const handleChange = (field: string, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    onConfirm(formState)
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        aria-label="Close payment drawer"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div className="fixed right-4 bottom-4 left-4 sm:left-auto sm:w-[380px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col max-h-[85vh]">
        <div className="sticky top-0 bg-white dark:bg-gray-900 px-4 py-4 border-b border-gray-200 dark:border-gray-800 flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Payment Method</p>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{method.name}</h3>
            {method.providers?.length ? (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {method.providers.join(' · ')}
              </p>
            ) : null}
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 py-4 space-y-4 overflow-y-auto">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Payment For</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{useCase}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Amount</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {amount.toLocaleString()} {currency}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Limits</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {method.minAmount.toLocaleString()} - {method.maxAmount.toLocaleString()} {currency}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">User Type</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{userTypeLabel}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Refund</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {rule?.refundable ? 'Refundable' : 'Non-refundable'}
              </span>
            </div>
          </div>

          {method.type === 'UPI' && qrPayload ? (
            <div className="bg-white dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Scan & Pay</p>
              <QRCodeImage payload={qrPayload} />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Scan this QR with any UPI app to pay {amount.toLocaleString()} {currency}.
              </p>
            </div>
          ) : null}

          <div className="space-y-3">
            {fields.map((field) => {
              if (field === 'saveCard') {
                return (
                  <label key={field} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={Boolean(formState[field])}
                      onChange={(e) => handleChange(field, e.target.checked)}
                    />
                    {fieldLabels[field]}
                  </label>
                )
              }

              if (field === 'proofUpload') {
                return (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {fieldLabels[field]}
                    </label>
                    <input
                      type="file"
                      onChange={(e) => handleChange(field, e.target.files?.[0]?.name || '')}
                      className="w-full text-sm text-gray-600 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-600 file:text-white"
                    />
                  </div>
                )
              }

              if (selectOptions[field]) {
                return (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {fieldLabels[field]}
                    </label>
                    <select
                      value={formState[field] || ''}
                      onChange={(e) => handleChange(field, e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">Select</option>
                      {(method.providers?.length ? method.providers : selectOptions[field]).map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                )
              }

              const readOnlyValue =
                field === 'accountName'
                  ? method.bankDetails?.accountName
                  : field === 'accountNumber'
                  ? method.bankDetails?.accountNumber
                  : field === 'ifsc'
                  ? method.bankDetails?.ifsc
                  : field === 'bankName'
                  ? method.bankDetails?.bankName
                  : undefined

              return (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {fieldLabels[field]}
                  </label>
                  <input
                    type="text"
                    value={readOnlyValue ?? (formState[field] || '')}
                    onChange={(e) => handleChange(field, e.target.value)}
                    readOnly={readOnlyValue !== undefined}
                    className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
              )
            })}
          </div>

          <div className="space-y-2">
            {rule?.requiresKYC && (
              <div className="flex items-start gap-2 text-xs text-orange-600 dark:text-orange-400">
                <ExclamationTriangleIcon className="w-4 h-4 mt-0.5" />
                KYC verification required before payment.
              </div>
            )}
            {rule?.requiresPremium && (
              <div className="flex items-start gap-2 text-xs text-orange-600 dark:text-orange-400">
                <ExclamationTriangleIcon className="w-4 h-4 mt-0.5" />
                Premium subscription required for this payment.
              </div>
            )}
            {!overMin || !belowMax ? (
              <div className="flex items-start gap-2 text-xs text-red-600 dark:text-red-400">
                <ExclamationTriangleIcon className="w-4 h-4 mt-0.5" />
                Amount must be within the allowed limits for this method.
              </div>
            ) : null}
            {rule?.refundable && (
              <div className="flex items-start gap-2 text-xs text-green-600 dark:text-green-400">
                <CheckCircleIcon className="w-4 h-4 mt-0.5" />
                Refundable as per applicable terms.
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-gray-900 px-4 py-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
          <button
            onClick={handleSubmit}
            disabled={initiating || !overMin || !belowMax}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {initiating ? 'Processing...' : 'Confirm & Pay'}
          </button>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
