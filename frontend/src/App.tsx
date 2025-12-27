import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect, useState } from 'react'
import { useAuthStore } from './store/authStore'
import SplashScreen from './components/SplashScreen'
import CreateProperty from './pages/CreateProperty'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Properties from './pages/Properties'
import PropertyDetail from './pages/PropertyDetail'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const { checkAuth } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)

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
        }, 500)
      }
    }

    initializeApp()
  }, [checkAuth])

  const handleSplashComplete = () => {
    setIsLoading(false)
  }

  return (
    <Router>
      {isLoading && <SplashScreen onComplete={handleSplashComplete} minDisplayTime={1500} />}
      <div className={`min-h-screen bg-gray-50 ${isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}>
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
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  )
}

export default App

