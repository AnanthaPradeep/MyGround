import { Link, useRouteError, isRouteErrorResponse } from 'react-router-dom'
import { 
  ExclamationTriangleIcon, 
  HomeIcon, 
  ArrowPathIcon,
  WifiIcon,
  DocumentTextIcon 
} from '@heroicons/react/24/outline'

/**
 * 404 Not Found Page
 */
export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold text-primary-200">404</div>
          <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-gray-100 mt-4 mb-2">Page Not Found</h1>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <HomeIcon className="w-5 h-5" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <ArrowPathIcon className="w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * 500 Server Error Page
 */
export function ServerErrorPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <ExclamationTriangleIcon className="w-10 h-10 text-red-600" />
            </div>
          </div>
          <div className="text-9xl font-bold text-red-200">500</div>
          <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-gray-100 mt-4 mb-2">Server Error</h1>
          <p className="text-gray-600 mb-8">
            Something went wrong on our end. We're working to fix it.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <ArrowPathIcon className="w-5 h-5" />
            Reload Page
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <HomeIcon className="w-5 h-5" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}

/**
 * Network Error Page
 */
export function NetworkErrorPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
              <WifiIcon className="w-10 h-10 text-yellow-600" />
            </div>
          </div>
          <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-gray-100 mt-4 mb-2">No Internet Connection</h1>
          <p className="text-gray-600 mb-8">
            Please check your internet connection and try again.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <ArrowPathIcon className="w-5 h-5" />
            Retry
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <HomeIcon className="w-5 h-5" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}

/**
 * Generic Error Page (for React Router errors)
 */
export function ErrorPage() {
  const error = useRouteError()

  let errorMessage = 'An unexpected error occurred'
  let errorTitle = 'Oops!'

  if (isRouteErrorResponse(error)) {
    errorTitle = error.status === 404 ? '404' : `${error.status}`
    errorMessage = error.statusText || errorMessage
  } else if (error instanceof Error) {
    errorMessage = error.message
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <ExclamationTriangleIcon className="w-10 h-10 text-red-600" />
            </div>
          </div>
          <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-gray-100 mt-4 mb-2">{errorTitle}</h1>
          <p className="text-gray-600 mb-8">{errorMessage}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <ArrowPathIcon className="w-5 h-5" />
            Reload
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <HomeIcon className="w-5 h-5" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}


