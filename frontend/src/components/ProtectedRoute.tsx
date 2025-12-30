import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { PageLoader } from './Loader'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string[]
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuthStore()

  // Show loader while checking authentication (prevents redirect during auth check)
  if (isLoading) {
    return <PageLoader />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user && !requiredRole.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

