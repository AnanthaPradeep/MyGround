import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect, useState } from 'react'
import { useAuthStore } from './store/authStore'
import { useLocationStore } from './store/locationStore'
import { ThemeProvider } from './contexts/ThemeContext'
import SplashScreen from './components/SplashScreen'
import LocationSelectorModal from './components/LocationSelectorModal'
import { ErrorBoundary } from './components/ErrorBoundary'
import { OfflineIndicator } from './components/NetworkError'
import CreateProperty from './pages/CreateProperty'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Properties from './pages/Properties'
import PropertyDetail from './pages/PropertyDetail'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Notifications from './pages/Notifications'
import LocationTest from './pages/LocationTest'
import ProtectedRoute from './components/ProtectedRoute'
import ChatWidget from './components/ChatWidget'
import { NotFoundPage } from './pages/ErrorPages'

function App() {
  const { checkAuth } = useAuthStore()
  const { isLocationSet } = useLocationStore()
  const [isLoading, setIsLoading] = useState(true)
  const [showLocationModal, setShowLocationModal] = useState(false)

  useEffect(() => {
    // Initialize app: check auth and load resources
    const initializeApp = async () => {
      try {
        await checkAuth()
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        // Small delay to ensure smooth transition
        setTimeout(() => {
          setIsLoading(false)
          // Show location modal if location is not set
          // Add a small delay to ensure UI is ready
          setTimeout(() => {
            if (!isLocationSet) {
              setShowLocationModal(true)
            }
          }, 800) // Increased delay to ensure everything is loaded
        }, 500)
      }
    }

    initializeApp()
  }, [checkAuth])

  const handleSplashComplete = () => {
    setIsLoading(false)
    // Show location modal if location is not set
    setTimeout(() => {
      if (!isLocationSet) {
        setShowLocationModal(true)
      }
    }, 800)
  }

  const handleLocationModalClose = () => {
    setShowLocationModal(false)
  }

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <Router>
          {isLoading && <SplashScreen onComplete={handleSplashComplete} minDisplayTime={1500} />}
          <OfflineIndicator />
          <LocationSelectorModal isOpen={showLocationModal} onClose={handleLocationModalClose} />
          <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />
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
            <Route path="/location-test" element={<LocationTest />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
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
    </ThemeProvider>
  )
}

export default App

