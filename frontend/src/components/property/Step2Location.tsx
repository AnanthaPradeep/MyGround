import { UseFormReturn } from 'react-hook-form'
import { PropertyFormData } from '../../types/property'
import { INDIAN_STATES } from '../../constants/propertyTypes'
import LocationAutocomplete from '../LocationAutocomplete'
import MapPicker from '../MapPicker'

interface Props {
  form: UseFormReturn<PropertyFormData>
}

export default function Step2Location({ form }: Props) {
  const { register, watch, setValue, formState: { errors } } = form

  const coordinates = watch('location.coordinates.coordinates')
  const latitude = coordinates?.[1] || 19.0760 // Default to Mumbai
  const longitude = coordinates?.[0] || 72.8777

  const handleMapClick = (lat: number, lng: number) => {
    setValue('location.coordinates.coordinates', [lng, lat], { shouldValidate: true })
    setValue('location.coordinates.type', 'Point', { shouldValidate: true })
  }

  const handleLocationSelect = (location: any) => {
    if (location) {
      setValue('location.city', location.city, { shouldValidate: true })
      setValue('location.state', location.state, { shouldValidate: true })
      setValue('location.country', location.country, { shouldValidate: true })
      if (location.area) {
        setValue('location.area', location.area, { shouldValidate: true })
      }
      if (location.pincode) {
        setValue('location.pincode', location.pincode, { shouldValidate: true })
      }
      if (location.coordinates) {
        handleMapClick(location.coordinates.lat, location.coordinates.lng)
      }
    }
  }

  return (
      <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-gray-100 mb-2">Location & Geo-Verification</h2>
        <p className="text-gray-600 dark:text-gray-400">Provide the exact location of your property (All fields are optional temporarily)</p>
      </div>

      {/* Location Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Search Location <span className="text-gray-400 dark:text-gray-500 text-xs">(Optional - temporarily)</span>
        </label>
        <LocationAutocomplete
          value={watch('location.city') ? `${watch('location.city')}, ${watch('location.state')}` : ''}
          onChange={handleLocationSelect}
          placeholder="Search city, area, or landmark..."
          required={false}
          error={errors.location?.city?.message}
          onCoordinatesChange={handleMapClick}
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Start typing to search for locations. This will auto-fill the location details below. (Optional temporarily)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Country <span className="text-gray-400 dark:text-gray-500 text-xs">(Optional)</span>
          </label>
          <input
            type="text"
            {...register('location.country')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
            placeholder="e.g., India"
          />
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            State <span className="text-gray-400 dark:text-gray-500 text-xs">(Optional)</span>
          </label>
          <select
            {...register('location.state')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
          >
            <option value="">Select state</option>
            {INDIAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            City <span className="text-gray-400 dark:text-gray-500 text-xs">(Optional)</span>
          </label>
          <input
            type="text"
            {...register('location.city')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
          />
        </div>

        {/* Area */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Area / Locality <span className="text-gray-400 dark:text-gray-500 text-xs">(Optional)</span>
          </label>
          <input
            type="text"
            {...register('location.area')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
          />
        </div>

        {/* Locality */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Locality <span className="text-gray-400 dark:text-gray-500 text-xs">(Optional)</span>
          </label>
          <input
            type="text"
            {...register('location.locality')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
          />
        </div>

        {/* Pincode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Pincode / ZIP <span className="text-gray-400 dark:text-gray-500 text-xs">(Optional)</span>
          </label>
          <input
            type="text"
            {...register('location.pincode', {
              pattern: {
                value: /^[0-9]{6}$/,
                message: 'Pincode must be 6 digits',
              },
            })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
          />
          {errors.location?.pincode && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.location.pincode.message}</p>
          )}
        </div>
      </div>

      {/* Landmark */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Landmark (Optional)</label>
        <input
          type="text"
          {...register('location.landmark')}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
          placeholder="e.g., Near Metro Station, Opposite Mall"
        />
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Complete Address <span className="text-gray-400 dark:text-gray-500 text-xs">(Optional)</span>
        </label>
        <textarea
          {...register('location.address')}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
          placeholder="Enter complete address"
        />
      </div>

      {/* Interactive Map */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Exact Location on Map <span className="text-gray-400 dark:text-gray-500 text-xs">(Optional - temporarily)</span>
        </label>
        <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
          <MapPicker
            latitude={latitude}
            longitude={longitude}
            onLocationChange={(lat, lng) => {
              console.log('📍 Step2Location: Map location changed to', lat, lng) // Debug
              handleMapClick(lat, lng)
            }}
            height="400px"
          />
        </div>
        {errors.location?.coordinates && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">Location coordinates are required</p>
        )}
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          <strong>Click anywhere on the map</strong> or drag the marker to set the exact property location. This is used for geo-verification and nearby property searches.
        </p>
        {coordinates && coordinates[0] !== 0 && coordinates[1] !== 0 && (
          <p className="mt-1 text-xs text-green-600 dark:text-green-400 font-medium">
            ✅ Location set: {coordinates[1].toFixed(6)}, {coordinates[0].toFixed(6)}
          </p>
        )}
      </div>
    </div>
  )
}

