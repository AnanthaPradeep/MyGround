import { UseFormReturn } from 'react-hook-form'
import { PropertyFormData } from '../../types/property'

interface Props {
  form: UseFormReturn<PropertyFormData>
}

export default function Step6Legal({ form }: Props) {
  const { register, formState: { errors } } = form

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Legal & Compliance</h2>
        <p className="text-gray-600">Provide legal documents and compliance information</p>
      </div>

      {/* Legal Declarations */}
      <div className="space-y-4">
        <div className="flex items-start">
          <input
            type="checkbox"
            {...register('legal.titleClear', { required: 'This declaration is required' })}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
          />
          <label className="ml-2 block text-sm text-gray-700">
            <span className="font-medium">Title is Clear</span>
            <span className="text-red-500 ml-1">*</span>
            <p className="text-xs text-gray-500 mt-1">
              I confirm that the property has a clear title with no disputes
            </p>
          </label>
        </div>
        {errors.legal?.titleClear && (
          <p className="ml-6 text-sm text-red-600">{errors.legal.titleClear.message}</p>
        )}

        <div className="flex items-start">
          <input
            type="checkbox"
            {...register('legal.encumbranceFree', { required: 'This declaration is required' })}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
          />
          <label className="ml-2 block text-sm text-gray-700">
            <span className="font-medium">Encumbrance Free</span>
            <span className="text-red-500 ml-1">*</span>
            <p className="text-xs text-gray-500 mt-1">
              I confirm that the property is free from any encumbrances, mortgages, or liens
            </p>
          </label>
        </div>
        {errors.legal?.encumbranceFree && (
          <p className="ml-6 text-sm text-red-600">{errors.legal.encumbranceFree.message}</p>
        )}
      </div>

      {/* Litigation Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Litigation Status <span className="text-red-500">*</span>
        </label>
        <select
          {...register('legal.litigationStatus', { required: 'Litigation status is required' })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="NONE">No Litigation</option>
          <option value="PENDING">Litigation Pending</option>
          <option value="RESOLVED">Litigation Resolved</option>
        </select>
        {errors.legal?.litigationStatus && (
          <p className="mt-1 text-sm text-red-600">{errors.legal.litigationStatus.message}</p>
        )}
      </div>

      {/* RERA Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          RERA Number (Optional)
        </label>
        <input
          type="text"
          {...register('legal.reraNumber')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="e.g., PRM/KA/RERA/1251/308/AG/171218/000123"
        />
        <p className="mt-1 text-xs text-gray-500">
          RERA registration number if applicable (increases trust score)
        </p>
      </div>

      {/* Document Uploads */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Uploads (Optional)</h3>
        <p className="text-sm text-gray-600 mb-4">
          Uploading documents increases your property's trust score and verification status
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title Deed
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.png"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Encumbrance Certificate
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.png"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Land Use Certificate
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.png"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Occupancy Certificate (OC)
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.png"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Completion Certificate (CC)
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.png"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Final Declaration */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <input
            type="checkbox"
            required
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
          />
          <label className="ml-2 block text-sm text-yellow-800">
            <span className="font-medium">Final Declaration</span>
            <span className="text-red-500 ml-1">*</span>
            <p className="mt-1">
              I hereby declare that all information provided is accurate and true to the best of my knowledge.
              I am authorized to list this property. I understand that providing false information may result
              in account suspension and legal action.
            </p>
          </label>
        </div>
      </div>
    </div>
  )
}

