import { Link, LinkProps, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

interface ProtectedLinkProps extends LinkProps {
  children: React.ReactNode
  showLoginModal?: () => void
}

/**
 * ProtectedLink component that shows login modal when clicked by unauthenticated users
 * If authenticated, behaves like a normal Link
 */
export default function ProtectedLink({ to, showLoginModal, children, onClick, ...props }: ProtectedLinkProps) {
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isAuthenticated) {
      e.preventDefault()
      e.stopPropagation()
      if (showLoginModal) {
        showLoginModal()
      } else {
        // Fallback: navigate to login if no modal function provided
        navigate('/login')
      }
      return
    }
    
    // Call original onClick if provided
    if (onClick) {
      onClick(e)
    }
  }

  return (
    <Link to={to} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}

