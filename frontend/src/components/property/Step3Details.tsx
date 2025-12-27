import { UseFormReturn } from 'react-hook-form'
import { PropertyFormData } from '../../types/property'

interface Props {
  form: UseFormReturn<PropertyFormData>
}

export default function Step3Details({ form }: Props) {
  const { register, watch, formState: { errors } } = form
  const propertyCategory = watch('propertyCategory')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Details</h2>
        <p className="text-gray-600">Provide detailed information about your property</p>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register('title', {
            required: 'Title is required',
            minLength: { value: 10, message: 'Title must be at least 10 characters' },
            maxLength: { value: 200, message: 'Title must not exceed 200 characters' },
          })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="e.g., Spacious 3BHK Apartment in Prime Location"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('description', {
            required: 'Description is required',
            minLength: { value: 50, message: 'Description must be at least 50 characters' },
            maxLength: { value: 5000, message: 'Description must not exceed 5000 characters' },
          })}
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Describe your property in detail..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ownership Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ownership Type <span className="text-red-500">*</span>
          </label>
          <select
            {...register('ownershipType', { required: 'Ownership type is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="FREEHOLD">Freehold</option>
            <option value="LEASEHOLD">Leasehold</option>
            <option value="GOVERNMENT">Government</option>
            <option value="TRUST">Trust / Institutional</option>
          </select>
          {errors.ownershipType && (
            <p className="mt-1 text-sm text-red-600">{errors.ownershipType.message}</p>
          )}
        </div>

        {/* Possession Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Possession Status <span className="text-red-500">*</span>
          </label>
          <select
            {...register('possessionStatus', { required: 'Possession status is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="READY">Ready to Move</option>
            <option value="UNDER_CONSTRUCTION">Under Construction</option>
            <option value="PRE_LAUNCH">Pre-Launch</option>
          </select>
          {errors.possessionStatus && (
            <p className="mt-1 text-sm text-red-600">{errors.possessionStatus.message}</p>
          )}
        </div>

        {/* Property Age */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Age (Years)
          </label>
          <input
            type="number"
            {...register('propertyAge', {
              min: { value: 0, message: 'Age cannot be negative' },
              max: { value: 200, message: 'Age seems unrealistic' },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="e.g., 5"
          />
          {errors.propertyAge && (
            <p className="mt-1 text-sm text-red-600">{errors.propertyAge.message}</p>
          )}
        </div>
      </div>

      {/* Category-Specific Fields */}
      {propertyCategory === 'RESIDENTIAL' && (
        <div className="border-t pt-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Residential Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">BHK</label>
              <input
                type="number"
                {...register('residential.bhk', {
                  min: { value: 1, message: 'Minimum 1 BHK' },
                  max: { value: 10, message: 'Maximum 10 BHK' },
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., 3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
              <input
                type="number"
                {...register('residential.bathrooms', {
                  min: { value: 1, message: 'Minimum 1 bathroom' },
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., 2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Balconies</label>
              <input
                type="number"
                {...register('residential.balconies')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., 2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Furnishing</label>
              <select
                {...register('residential.furnishing')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select</option>
                <option value="FULLY_FURNISHED">Fully Furnished</option>
                <option value="SEMI_FURNISHED">Semi Furnished</option>
                <option value="UNFURNISHED">Unfurnished</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Floor</label>
              <input
                type="number"
                {...register('residential.floor')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., 5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Floors</label>
              <input
                type="number"
                {...register('residential.totalFloors')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., 10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Parking</label>
              <select
                {...register('residential.parking')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select</option>
                <option value="OPEN">Open</option>
                <option value="COVERED">Covered</option>
                <option value="NONE">None</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {propertyCategory === 'COMMERCIAL' && (
        <div className="border-t pt-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Commercial Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Built-up Area (sqft) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                {...register('commercial.builtUpArea', {
                  required: 'Built-up area is required',
                  min: { value: 1, message: 'Area must be greater than 0' },
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., 2000"
              />
              {errors.commercial?.builtUpArea && (
                <p className="mt-1 text-sm text-red-600">{errors.commercial.builtUpArea.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Carpet Area (sqft)</label>
              <input
                type="number"
                {...register('commercial.carpetArea')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., 1800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Power Load (kVA)</label>
              <input
                type="number"
                {...register('commercial.powerLoad')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., 50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ceiling Height (ft)</label>
              <input
                type="number"
                {...register('commercial.ceilingHeight')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., 12"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('commercial.dockAvailable')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">Dock Available</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('commercial.freightElevator')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">Freight Elevator</label>
            </div>
          </div>
        </div>
      )}

      {propertyCategory === 'LAND' && (
        <div className="border-t pt-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Land Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plot Area <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  {...register('land.plotArea', {
                    required: 'Plot area is required',
                    min: { value: 0.01, message: 'Area must be greater than 0' },
                  })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., 1200"
                />
                <select
                  {...register('land.areaUnit')}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="SQFT">sqft</option>
                  <option value="SQMT">sqm</option>
                  <option value="ACRE">acre</option>
                  <option value="HECTARE">hectare</option>
                </select>
              </div>
              {errors.land?.plotArea && (
                <p className="mt-1 text-sm text-red-600">{errors.land.plotArea.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Frontage (ft)</label>
              <input
                type="number"
                {...register('land.frontage')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., 30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Depth (ft)</label>
              <input
                type="number"
                {...register('land.depth')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., 40"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Road Access Width (ft)</label>
              <input
                type="number"
                {...register('land.roadAccessWidth')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., 30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Zoning Type</label>
              <input
                type="text"
                {...register('land.zoningType')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., Residential, Commercial"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">FSI</label>
              <input
                type="number"
                {...register('land.fsi')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., 2.5"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('land.waterAvailable')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">Water Available</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('land.electricityAvailable')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">Electricity Available</label>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

