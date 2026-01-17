import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect, useState, lazy, Suspense } from 'react'
import { useAuthStore } from './store/authStore'
import { useLocationStore } from './store/locationStore'
import { useLanguageStore } from './store/languageStore'
import { ThemeProvider } from './contexts/ThemeContext'
import { QueryProvider } from './providers/QueryProvider'
import { changeLanguage } from './config/i18n'
import i18n from './config/i18n'
import SplashScreen from './components/SplashScreen'
import LocationSelectorModal from './components/LocationSelectorModal'
import CookieBanner from './components/CookieBanner'
import { ErrorBoundary } from './components/ErrorBoundary'
import { OfflineIndicator } from './components/NetworkError'
import ProtectedRoute from './components/ProtectedRoute'
import ChatWidget from './components/ChatWidget'
import { PageLoader } from './components/Loader'

// Keep lightweight routes as direct imports (fast initial load)
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Properties from './pages/Properties'
import TermsAndConditions from './pages/TermsAndConditions'
import PrivacyPolicy from './pages/PrivacyPolicy'

// Lazy load heavy routes (code splitting for better performance)
const CreateProperty = lazy(() => import('./pages/CreateProperty'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const PropertyDetail = lazy(() => import('./pages/PropertyDetail'))
const Profile = lazy(() => import('./pages/Profile'))
const Settings = lazy(() => import('./pages/Settings'))
const Notifications = lazy(() => import('./pages/Notifications'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const LocationTest = lazy(() => import('./pages/LocationTest'))
const CookiePreferences = lazy(() => import('./pages/CookiePreferences'))
const EAuctionList = lazy(() => import('./pages/EAuctionList'))
const EAuctionDetail = lazy(() => import('./pages/EAuctionDetail'))
const NotFoundPage = lazy(() => import('./pages/ErrorPages').then(module => ({ default: module.NotFoundPage })))

function App() {
  const { checkAuth } = useAuthStore()
  const { isLocationSet } = useLocationStore()
  const { selectedLanguage } = useLanguageStore()
  const [showSplash, setShowSplash] = useState(true)
  const [shellReady, setShellReady] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)

  // Update language when selectedLanguage changes (but not on initial mount to avoid double load)
  useEffect(() => {
    // Only change language if it's different from current i18n language
    if (selectedLanguage && i18n.language !== selectedLanguage.languageCode) {
      changeLanguage(selectedLanguage).catch((error) => {
        console.error('Error changing language:', error)
      })
    }
  }, [selectedLanguage])

  useEffect(() => {
    const shellTimer = setTimeout(() => setShellReady(true), 100)
    const splashTimer = setTimeout(() => setShowSplash(false), 600)
    const splashFailSafe = setTimeout(() => setShowSplash(false), 800)

    return () => {
      clearTimeout(shellTimer)
      clearTimeout(splashTimer)
      clearTimeout(splashFailSafe)
    }
  }, [])

  useEffect(() => {
    checkAuth().catch((error) => {
      console.error('Auth check failed:', error)
    })
  }, [checkAuth])

  useEffect(() => {
    if (!shellReady) return
    const timer = setTimeout(() => {
      if (!isLocationSet) {
        setShowLocationModal(true)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [shellReady, isLocationSet])

  const handleLocationModalClose = () => {
    setShowLocationModal(false)
  }

  return (
    <ThemeProvider>
      <QueryProvider>
        <ErrorBoundary>
          <Router>
            {showSplash && (
              <SplashScreen
                onComplete={() => setShowSplash(false)}
                minDisplayTime={300}
                maxDisplayTime={800}
              />
            )}
            <OfflineIndicator />
            <LocationSelectorModal isOpen={showLocationModal} onClose={handleLocationModalClose} />
            <CookieBanner />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Suspense fallback={<PageLoader />}>
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/cookie-preferences" element={<CookiePreferences />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />
            <Route path="/eauction" element={<EAuctionList />} />
            <Route path="/eauction/:id" element={<EAuctionDetail />} />
            <Route
              path="/properties/create"
              element={
                <ProtectedRoute requiredRole={['USER', 'OWNER', 'BROKER', 'DEVELOPER', 'ADMIN']}>
                  <CreateProperty />
                </ProtectedRoute>
              }
            />
            <Route
              path="/properties/:id/edit"
              element={
                <ProtectedRoute requiredRole={['USER', 'OWNER', 'BROKER', 'DEVELOPER', 'ADMIN']}>
                  <CreateProperty />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              }
            />
            <Route path="/location-test" element={<LocationTest />} />
            <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
          <Toaster 
            position="top-right"
            toastOptions={{
              className: 'dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700',
              style: {},
            }}
          />
          <ChatWidget />
          </div>
        </Router>
      </ErrorBoundary>
      </QueryProvider>
    </ThemeProvider>
  )
}

export default App

