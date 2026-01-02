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
        <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-gray-100 mb-2">Legal & Compliance</h2>
        <p className="text-gray-600 dark:text-gray-400">Provide legal documents and compliance information</p>
      </div>

      {/* Legal Declarations */}
      <div className="space-y-4">
        <div className="flex items-start">
          <input
            type="checkbox"
            {...register('legal.titleClear', { required: 'This declaration is required' })}
            className="h-4 w-4 text-primary-600 dark:text-primary-400 focus:ring-primary-500 dark:focus:ring-primary-400 border-gray-300 dark:border-gray-600 rounded mt-1 bg-white dark:bg-gray-700"
          />
          <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">Title is Clear</span>
            <span className="text-red-500 dark:text-red-400 ml-1">*</span>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              I confirm that the property has a clear title with no disputes
            </p>
          </label>
        </div>
        {errors.legal?.titleClear && (
          <p className="ml-6 text-sm text-red-600 dark:text-red-400">{errors.legal.titleClear.message}</p>
        )}

        <div className="flex items-start">
          <input
            type="checkbox"
            {...register('legal.encumbranceFree', { required: 'This declaration is required' })}
            className="h-4 w-4 text-primary-600 dark:text-primary-400 focus:ring-primary-500 dark:focus:ring-primary-400 border-gray-300 dark:border-gray-600 rounded mt-1 bg-white dark:bg-gray-700"
          />
          <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">Encumbrance Free</span>
            <span className="text-red-500 dark:text-red-400 ml-1">*</span>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              I confirm that the property is free from any encumbrances, mortgages, or liens
            </p>
          </label>
        </div>
        {errors.legal?.encumbranceFree && (
          <p className="ml-6 text-sm text-red-600 dark:text-red-400">{errors.legal.encumbranceFree.message}</p>
        )}
      </div>

      {/* Litigation Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Litigation Status <span className="text-red-500 dark:text-red-400">*</span>
        </label>
        <select
          {...register('legal.litigationStatus', { required: 'Litigation status is required' })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
        >
          <option value="NONE">No Litigation</option>
          <option value="PENDING">Litigation Pending</option>
          <option value="RESOLVED">Litigation Resolved</option>
        </select>
        {errors.legal?.litigationStatus && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.legal.litigationStatus.message}</p>
        )}
      </div>

      {/* RERA Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          RERA Number (Optional)
        </label>
        <input
          type="text"
          {...register('legal.reraNumber')}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
          placeholder="e.g., PRM/KA/RERA/1251/308/AG/171218/000123"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          RERA registration number if applicable (increases trust score)
        </p>
      </div>

      {/* Document Uploads */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Document Uploads (Optional)</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Uploading documents increases your property's trust score and verification status
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title Deed
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.png"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 dark:file:bg-primary-900/30 file:text-primary-700 dark:file:text-primary-300 hover:file:bg-primary-100 dark:hover:file:bg-primary-900/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Encumbrance Certificate
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.png"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 dark:file:bg-primary-900/30 file:text-primary-700 dark:file:text-primary-300 hover:file:bg-primary-100 dark:hover:file:bg-primary-900/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Land Use Certificate
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.png"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 dark:file:bg-primary-900/30 file:text-primary-700 dark:file:text-primary-300 hover:file:bg-primary-100 dark:hover:file:bg-primary-900/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Occupancy Certificate (OC)
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.png"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 dark:file:bg-primary-900/30 file:text-primary-700 dark:file:text-primary-300 hover:file:bg-primary-100 dark:hover:file:bg-primary-900/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Completion Certificate (CC)
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.png"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 dark:file:bg-primary-900/30 file:text-primary-700 dark:file:text-primary-300 hover:file:bg-primary-100 dark:hover:file:bg-primary-900/50"
            />
          </div>
        </div>
      </div>

      {/* Final Declaration */}
      <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-start">
          <input
            type="checkbox"
            required
            className="h-4 w-4 text-primary-600 dark:text-primary-400 focus:ring-primary-500 dark:focus:ring-primary-400 border-gray-300 dark:border-gray-600 rounded mt-1 bg-white dark:bg-gray-700"
          />
          <label className="ml-2 block text-sm text-yellow-800 dark:text-yellow-300">
            <span className="font-medium">Final Declaration</span>
            <span className="text-red-500 dark:text-red-400 ml-1">*</span>
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

