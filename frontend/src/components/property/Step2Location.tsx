import { UseFormReturn } from 'react-hook-form'
import { PropertyFormData } from '../../types/property'
import { useState } from 'react'
import { INDIAN_STATES } from '../../constants/propertyTypes'

interface Props {
  form: UseFormReturn<PropertyFormData>
}

export default function Step2Location({ form }: Props) {
  const { register, watch, setValue, formState: { errors } } = form
  const [mapLoaded, setMapLoaded] = useState(false)

  const coordinates = watch('location.coordinates.coordinates')

  const handleMapClick = (lat: number, lng: number) => {
    setValue('location.coordinates.coordinates', [lng, lat], { shouldValidate: true })
    setValue('location.coordinates.type', 'Point', { shouldValidate: true })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Location & Geo-Verification</h2>
        <p className="text-gray-600">Provide the exact location of your property</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('location.country', { required: 'Country is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          {errors.location?.country && (
            <p className="mt-1 text-sm text-red-600">{errors.location.country.message}</p>
          )}
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State <span className="text-red-500">*</span>
          </label>
          <select
            {...register('location.state', { required: 'State is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Select state</option>
            {INDIAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          {errors.location?.state && (
            <p className="mt-1 text-sm text-red-600">{errors.location.state.message}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('location.city', { required: 'City is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          {errors.location?.city && (
            <p className="mt-1 text-sm text-red-600">{errors.location.city.message}</p>
          )}
        </div>

        {/* Area */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Area / Locality <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('location.area', { required: 'Area is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          {errors.location?.area && (
            <p className="mt-1 text-sm text-red-600">{errors.location.area.message}</p>
          )}
        </div>

        {/* Locality */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Locality <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('location.locality', { required: 'Locality is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          {errors.location?.locality && (
            <p className="mt-1 text-sm text-red-600">{errors.location.locality.message}</p>
          )}
        </div>

        {/* Pincode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pincode / ZIP <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('location.pincode', {
              required: 'Pincode is required',
              pattern: {
                value: /^[0-9]{6}$/,
                message: 'Pincode must be 6 digits',
              },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          {errors.location?.pincode && (
            <p className="mt-1 text-sm text-red-600">{errors.location.pincode.message}</p>
          )}
        </div>
      </div>

      {/* Landmark */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Landmark (Optional)</label>
        <input
          type="text"
          {...register('location.landmark')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="e.g., Near Metro Station, Opposite Mall"
        />
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Complete Address <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('location.address', { required: 'Address is required' })}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Enter complete address"
        />
        {errors.location?.address && (
          <p className="mt-1 text-sm text-red-600">{errors.location.address.message}</p>
        )}
      </div>

      {/* Map Integration Placeholder */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Location on Map <span className="text-red-500">*</span>
        </label>
        <div className="w-full h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
          {coordinates && coordinates[0] !== 0 && coordinates[1] !== 0 ? (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Location Selected</p>
              <p className="text-xs text-gray-500">
                Lat: {coordinates[1].toFixed(6)}, Lng: {coordinates[0].toFixed(6)}
              </p>
              <button
                type="button"
                onClick={() => {
                  // In production, this would open a map picker
                  // For now, we'll use a simple prompt
                  const lat = prompt('Enter Latitude:')
                  const lng = prompt('Enter Longitude:')
                  if (lat && lng) {
                    handleMapClick(parseFloat(lat), parseFloat(lng))
                  }
                }}
                className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Change Location
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Click to select location on map</p>
              <button
                type="button"
                onClick={() => {
                  const lat = prompt('Enter Latitude:')
                  const lng = prompt('Enter Longitude:')
                  if (lat && lng) {
                    handleMapClick(parseFloat(lat), parseFloat(lng))
                  }
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Select Location
              </button>
            </div>
          )}
        </div>
        {errors.location?.coordinates && (
          <p className="mt-1 text-sm text-red-600">Location coordinates are required</p>
        )}
      </div>
    </div>
  )
}

