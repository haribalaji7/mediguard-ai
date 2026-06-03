import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export function useAuth(requireAuth = false) {
  const { user, isAuthenticated, isLoading, login, register, logout, checkAuth } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      navigate('/login')
    }
  }, [isLoading, requireAuth, isAuthenticated, navigate])

  return { user, isAuthenticated, isLoading, login, register, logout }
}
