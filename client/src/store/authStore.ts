import { create } from 'zustand'
import type { User } from '../types'
import { authApi, mockOrApi } from '../lib/api'
import { mockUser, mockWorker } from '../lib/mockData'

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (phone: string, password: string, role?: 'patient' | 'worker') => Promise<void>
  register: (data: Partial<User> & { password: string }) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
  setUser: (user: User | null) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async (phone, password, role = 'patient') => {
    const fallbackUser = role === 'worker' ? mockWorker : mockUser
    const result = await mockOrApi(
      () => authApi.login(phone, password).then((r) => ({ user: r.user, token: r.token })),
      { user: fallbackUser, token: 'mock-jwt-token' },
    )
    localStorage.setItem('aarogyam_logged_in', 'true')
    localStorage.setItem('aarogyam_role', result.user.role ?? role)
    set({ user: result.user, isAuthenticated: true, isLoading: false })
  },
  register: async (data) => {
    await mockOrApi(
      () => authApi.register(data),
      { ...mockUser, ...data } as unknown as User,
    )
  },
  logout: () => {
    localStorage.removeItem('aarogyam_logged_in')
    localStorage.removeItem('aarogyam_role')
    set({ user: null, isAuthenticated: false, isLoading: false })
  },
  checkAuth: async () => {
    const isLoggedIn = localStorage.getItem('aarogyam_logged_in') === 'true'
    if (!isLoggedIn) {
      set({ user: null, isAuthenticated: false, isLoading: false })
      return
    }
    try {
      const savedRole = localStorage.getItem('aarogyam_role')
      const fallbackUser = savedRole === 'worker' ? mockWorker : mockUser
      const user = await mockOrApi(() => authApi.me(), fallbackUser, 300)
      set({ user, isAuthenticated: true, isLoading: false })
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },
  setUser: (user) => {
    if (user) {
      localStorage.setItem('aarogyam_logged_in', 'true')
    } else {
      localStorage.removeItem('aarogyam_logged_in')
    }
    set({ user, isAuthenticated: !!user, isLoading: false })
  },
}))
