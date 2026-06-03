import { create } from 'zustand'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

interface UiStore {
  theme: 'light' | 'dark'
  sidebarOpen: boolean
  toasts: Toast[]
  largeText: boolean

  setTheme: (theme: 'light' | 'dark') => void
  toggleTheme: () => void
  setSidebarOpen: (open: boolean) => void
  addToast: (message: string, type: Toast['type']) => void
  removeToast: (id: string) => void
  setLargeText: (large: boolean) => void
  initialize: () => void
}

const THEME_KEY = 'mediguard-ai-theme'
const LARGE_TEXT_KEY = 'mediguard-ai-large-text'

export const useUiStore = create<UiStore>((set, get) => ({
  theme: 'light',
  sidebarOpen: false,
  toasts: [],
  largeText: false,

  initialize: () => {
    if (typeof window === 'undefined') return

    const savedTheme = localStorage.getItem(THEME_KEY) as 'light' | 'dark' | null
    const theme = savedTheme ?? (window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light')
    
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')

    const largeText = localStorage.getItem(LARGE_TEXT_KEY) === 'true'
    document.documentElement.classList.toggle('large-text', largeText)

    set({
      theme,
      largeText,
    })
  },

  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_KEY, theme)
      document.documentElement.setAttribute('data-theme', theme)
      document.documentElement.classList.toggle('dark', theme === 'dark')
    }

    set({ theme })
  },

  toggleTheme: () => {
    const newTheme = get().theme === 'light' ? 'dark' : 'light'
    get().setTheme(newTheme)
  },

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  addToast: (message, type) => {
    const id = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2)

    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }))

    setTimeout(() => {
      get().removeToast(id)
    }, 4000)
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),

  setLargeText: (large) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LARGE_TEXT_KEY, String(large))
      document.documentElement.classList.toggle('large-text', large)
    }

    set({ largeText: large })
  },
}))
