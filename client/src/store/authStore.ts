import { create } from 'zustand'
import type { User } from '../types'
import { authApi, mockOrApi } from '../lib/api'
import { mockUser } from '../lib/mockData'

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (phone: string, password: string) => Promise<void>
  register: (data: Partial<User> & { password: string }) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
  setUser: (user: User | null) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async (phone, password) => {
    const result = await mockOrApi(
      () => authApi.login(phone, password).then((r) => ({ user: r.user, token: r.token })),
      { user: mockUser, token: 'mock-jwt-token' },
    )
    set({ user: result.user, isAuthenticated: true, isLoading: false })
  },
  register: async (data) => {
    await mockOrApi(
      () => authApi.register(data),
      { ...mockUser, ...data } as unknown as User,
    )
  },
  logout: () => {
    set({ user: null, isAuthenticated: false, isLoading: false })
  },
  checkAuth: async () => {
    try {
      const user = await mockOrApi(() => authApi.me(), mockUser, 300)
      set({ user, isAuthenticated: true, isLoading: false })
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
}))
