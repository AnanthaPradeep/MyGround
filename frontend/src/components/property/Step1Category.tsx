import { UseFormReturn } from 'react-hook-form'
import { PropertyFormData } from '../../types/property'

interface Props {
  form: UseFormReturn<PropertyFormData>
}

const PROPERTY_SUBTYPES = {
  RESIDENTIAL: [
    'Apartment / Flat',
    'Builder Floor',
    'Independent House / Villa',
    'Studio Apartment',
    'Penthouse',
    'Duplex / Triplex',
    'Co-living',
    'Serviced Apartment',
  ],
  COMMERCIAL: [
    'Office (IT)',
    'Office (Non-IT)',
    'Co-working Space',
    'Retail Shop',
    'Showroom',
    'Mall Space',
    'Hotel / Hospitality',
    'Business Center',
  ],
  INDUSTRIAL: [
    'Warehouse',
    'Factory / Manufacturing Unit',
    'Logistics Park',
    'Cold Storage',
    'Industrial Shed',
  ],
  LAND: [
    'Residential Plot',
    'Commercial Plot',
    'Agricultural Land',
    'Farm Land',
    'Industrial Land',
    'SEZ Land',
    'Institutional Land',
  ],
  SPECIAL: [
    'Island',
    'Resort',
    'Heritage Property',
    'School / Hospital Property',
    'Data Center',
    'Airport / Port Asset',
  ],
}

export default function Step1Category({ form }: Props) {
  const { register, watch, setValue, formState: { errors } } = form
  const transactionType = watch('transactionType')
  const propertyCategory = watch('propertyCategory')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Category & Purpose</h2>
        <p className="text-gray-600">Select the type of transaction and property category</p>
      </div>

      {/* Transaction Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Transaction Type <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {['SELL', 'RENT', 'LEASE', 'SUB_LEASE', 'FRACTIONAL'].map((type) => (
            <label
              key={type}
              className={`cursor-pointer p-4 border-2 rounded-lg text-center transition-colors ${
                transactionType === type
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
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
          <p className="mt-1 text-sm text-red-600">{errors.transactionType.message}</p>
        )}
      </div>

      {/* Property Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Category <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'LAND', 'SPECIAL'].map((category) => (
            <label
              key={category}
              className={`cursor-pointer p-4 border-2 rounded-lg text-center transition-colors ${
                propertyCategory === category
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
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
          <p className="mt-1 text-sm text-red-600">{errors.propertyCategory.message}</p>
        )}
      </div>

      {/* Property Sub-Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Sub-Type <span className="text-red-500">*</span>
        </label>
        <select
          {...register('propertySubType', { required: 'Property sub-type is required' })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Select sub-type</option>
          {PROPERTY_SUBTYPES[propertyCategory]?.map((subType) => (
            <option key={subType} value={subType}>
              {subType}
            </option>
          ))}
        </select>
        {errors.propertySubType && (
          <p className="mt-1 text-sm text-red-600">{errors.propertySubType.message}</p>
        )}
      </div>
    </div>
  )
}

