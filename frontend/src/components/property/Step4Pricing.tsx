import { UseFormReturn } from 'react-hook-form'
import { PropertyFormData } from '../../types/property'

interface Props {
  form: UseFormReturn<PropertyFormData>
}

export default function Step4Pricing({ form }: Props) {
  const { register, watch, formState: { errors } } = form
  const transactionType = watch('transactionType')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Pricing & Transaction Details</h2>
        <p className="text-gray-600">Set the price and financial terms for your property</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Price based on transaction type */}
        {transactionType === 'SELL' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Price <span className="text-red-500">*</span>
            </label>
            <div className="flex">
              <select
                {...register('pricing.currency')}
                className="px-4 py-2 border border-gray-300 rounded-l-lg bg-gray-50 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="INR">₹ INR</option>
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
                <option value="GBP">£ GBP</option>
              </select>
              <input
                type="number"
                {...register('pricing.expectedPrice', {
                  required: transactionType === 'SELL' ? 'Price is required' : false,
                  min: { value: 0, message: 'Price cannot be negative' },
                })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., 5000000"
              />
            </div>
            {errors.pricing?.expectedPrice && (
              <p className="mt-1 text-sm text-red-600">{errors.pricing.expectedPrice.message}</p>
            )}
          </div>
        )}

        {transactionType === 'RENT' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Rent <span className="text-red-500">*</span>
            </label>
            <div className="flex">
              <select
                {...register('pricing.currency')}
                className="px-4 py-2 border border-gray-300 rounded-l-lg bg-gray-50 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="INR">₹ INR</option>
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
                <option value="GBP">£ GBP</option>
              </select>
              <input
                type="number"
                {...register('pricing.rentAmount', {
                  required: transactionType === 'RENT' ? 'Rent amount is required' : false,
                  min: { value: 0, message: 'Rent cannot be negative' },
                })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., 50000"
              />
            </div>
            {errors.pricing?.rentAmount && (
              <p className="mt-1 text-sm text-red-600">{errors.pricing.rentAmount.message}</p>
            )}
          </div>
        )}

        {transactionType === 'LEASE' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lease Value <span className="text-red-500">*</span>
            </label>
            <div className="flex">
              <select
                {...register('pricing.currency')}
                className="px-4 py-2 border border-gray-300 rounded-l-lg bg-gray-50 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="INR">₹ INR</option>
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
                <option value="GBP">£ GBP</option>
              </select>
              <input
                type="number"
                {...register('pricing.leaseValue', {
                  required: transactionType === 'LEASE' ? 'Lease value is required' : false,
                  min: { value: 0, message: 'Lease value cannot be negative' },
                })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., 1000000"
              />
            </div>
            {errors.pricing?.leaseValue && (
              <p className="mt-1 text-sm text-red-600">{errors.pricing.leaseValue.message}</p>
            )}
          </div>
        )}

        {/* Security Deposit */}
        {(transactionType === 'RENT' || transactionType === 'LEASE') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Security Deposit
            </label>
            <input
              type="number"
              {...register('pricing.securityDeposit', {
                min: { value: 0, message: 'Deposit cannot be negative' },
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., 100000"
            />
            {errors.pricing?.securityDeposit && (
              <p className="mt-1 text-sm text-red-600">{errors.pricing.securityDeposit.message}</p>
            )}
          </div>
        )}

        {/* Booking Amount */}
        {transactionType === 'SELL' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Booking Amount
            </label>
            <input
              type="number"
              {...register('pricing.bookingAmount', {
                min: { value: 0, message: 'Booking amount cannot be negative' },
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., 500000"
            />
            {errors.pricing?.bookingAmount && (
              <p className="mt-1 text-sm text-red-600">{errors.pricing.bookingAmount.message}</p>
            )}
          </div>
        )}

        {/* Maintenance Charges */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maintenance Charges (Monthly)
          </label>
          <input
            type="number"
            {...register('pricing.maintenanceCharges', {
              min: { value: 0, message: 'Charges cannot be negative' },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="e.g., 5000"
          />
          {errors.pricing?.maintenanceCharges && (
            <p className="mt-1 text-sm text-red-600">{errors.pricing.maintenanceCharges.message}</p>
          )}
        </div>
      </div>

      {/* Price Negotiable */}
      <div className="flex items-center">
        <input
          type="checkbox"
          {...register('pricing.priceNegotiable')}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-700">
          Price is Negotiable
        </label>
      </div>

      {/* Price Insights (Placeholder for MG Asset DNA) */}
      {transactionType === 'SELL' && watch('pricing.expectedPrice') && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 <strong>Price Insight:</strong> This will be calculated based on local market data after submission.
          </p>
        </div>
      )}
    </div>
  )
}

