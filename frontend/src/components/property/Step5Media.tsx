import { UseFormReturn } from 'react-hook-form'
import { PropertyFormData } from '../../types/property'
import { useState } from 'react'
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline'

interface Props {
  form: UseFormReturn<PropertyFormData>
}

export default function Step5Media({ form }: Props) {
  const { register, watch, setValue, formState: { errors } } = form
  const images = watch('media.images') || []
  const [uploading, setUploading] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setUploading(true)
    try {
      // In production, upload to cloud storage (S3, Cloudinary, etc.)
      // For now, we'll use base64 or file URLs
      const newImages: string[] = []
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        // Convert to base64 for demo (in production, upload to cloud)
        const reader = new FileReader()
        reader.onloadend = () => {
          newImages.push(reader.result as string)
          if (newImages.length === files.length) {
            setValue('media.images', [...images, ...newImages], { shouldValidate: true })
            setUploading(false)
          }
        }
        reader.readAsDataURL(file)
      }
    } catch (error) {
      console.error('Error uploading images:', error)
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setValue('media.images', newImages, { shouldValidate: true })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-gray-100 mb-2">Media Upload</h2>
        <p className="text-gray-600 dark:text-gray-400">Upload images, videos, and documents for your property</p>
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Property Images <span className="text-red-500 dark:text-red-400">*</span>
          <span className="text-gray-500 dark:text-gray-400 text-xs ml-2">(Minimum 3 images required)</span>
        </label>
        
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Property ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center bg-gray-50 dark:bg-gray-800/50">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            disabled={uploading}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <PhotoIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-2" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {uploading ? 'Uploading...' : 'Click to upload images'}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              PNG, JPG, GIF up to 10MB each
            </span>
          </label>
        </div>
        {errors.media?.images && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.media.images.message}</p>
        )}
        {images.length < 3 && (
          <p className="mt-1 text-sm text-yellow-600 dark:text-yellow-400">
            {3 - images.length} more image(s) required
          </p>
        )}
      </div>

      {/* Videos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Videos (Optional)
        </label>
        <input
          type="url"
          {...register('media.virtualTour')}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
          placeholder="Virtual tour URL (YouTube, Vimeo, etc.)"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          You can also upload video files directly (coming soon)
        </p>
      </div>

      {/* Floor Plans */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Floor Plans (Optional)
        </label>
        <input
          type="file"
          accept=".pdf,.jpg,.png"
          multiple
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 dark:file:bg-primary-900/30 file:text-primary-700 dark:file:text-primary-300 hover:file:bg-primary-100 dark:hover:file:bg-primary-900/50"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Upload PDF or image files of floor plans
        </p>
      </div>
    </div>
  )
}

