import { UseFormReturn } from 'react-hook-form'
import { PropertyFormData } from '../../types/property'
import { PROPERTY_SUBTYPES, TRANSACTION_TYPES, PROPERTY_CATEGORIES } from '../../constants/propertyTypes'

interface Props {
  form: UseFormReturn<PropertyFormData>
}

export default function Step1Category({ form }: Props) {
  const { register, watch, setValue, formState: { errors } } = form
  const transactionType = watch('transactionType')
  const propertyCategory = watch('propertyCategory')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-gray-100 mb-2">Property Category & Purpose</h2>
        <p className="text-gray-600 dark:text-gray-400">Select the type of transaction and property category</p>
      </div>

      {/* Transaction Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Transaction Type <span className="text-red-500 dark:text-red-400">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {TRANSACTION_TYPES.map((type) => (
            <label
              key={type}
              className={`cursor-pointer p-4 border-2 rounded-lg text-center transition-colors ${
                transactionType === type
                  ? 'border-primary-600 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <input
                type="radio"
                value={type}
                {...register('transactionType', { required: 'Transaction type is required' })}
                className="sr-only"
              />
              <span className="font-medium">{type}</span>
            </label>
          ))}
        </div>
        {errors.transactionType && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.transactionType.message}</p>
        )}
      </div>

      {/* Property Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Property Category <span className="text-red-500 dark:text-red-400">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {PROPERTY_CATEGORIES.map((category) => (
            <label
              key={category}
              className={`cursor-pointer p-4 border-2 rounded-lg text-center transition-colors ${
                propertyCategory === category
                  ? 'border-primary-600 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <input
                type="radio"
                value={category}
                {...register('propertyCategory', { required: 'Property category is required' })}
                className="sr-only"
                onChange={(e) => {
                  setValue('propertyCategory', e.target.value as any)
                  setValue('propertySubType', '') // Reset sub-type when category changes
                }}
              />
              <span className="font-medium">{category}</span>
            </label>
          ))}
        </div>
        {errors.propertyCategory && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.propertyCategory.message}</p>
        )}
      </div>

      {/* Property Sub-Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Property Sub-Type <span className="text-red-500 dark:text-red-400">*</span>
        </label>
        <select
          {...register('propertySubType', { required: 'Property sub-type is required' })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
        >
          <option value="">Select sub-type</option>
          {PROPERTY_SUBTYPES[propertyCategory]?.map((subType) => (
            <option key={subType} value={subType}>
              {subType}
            </option>
          ))}
        </select>
        {errors.propertySubType && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.propertySubType.message}</p>
        )}
      </div>
    </div>
  )
}

