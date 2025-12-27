import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'

export const useAuth = () => {
  const authStore = useAuthStore()

  useEffect(() => {
    // Check auth on mount
    if (!authStore.isAuthenticated && !authStore.isLoading) {
      authStore.checkAuth()
    }
  }, [])

  return {
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    isLoading: authStore.isLoading,
    login: authStore.login,
    register: authStore.register,
    logout: authStore.logout,
    updateUser: authStore.updateUser,
  }
}


