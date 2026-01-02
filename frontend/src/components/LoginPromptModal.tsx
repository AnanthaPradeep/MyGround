import { Link } from 'react-router-dom'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface LoginPromptModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginPromptModal({ isOpen, onClose }: LoginPromptModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 sm:p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Close"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-primary-600 dark:text-primary-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          {/* Message */}
          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-gray-100 mb-3">
            Please Experience the Website After Login
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Sign in or create an account to explore properties, view details, and access all features.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/login"
              onClick={onClose}
              className="px-6 py-3 bg-primary-600 dark:bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={onClose}
              className="px-6 py-3 border-2 border-primary-600 dark:border-primary-500 text-primary-600 dark:text-primary-400 rounded-lg font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

