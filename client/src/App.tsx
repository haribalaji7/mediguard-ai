import { useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useUiStore } from './store/uiStore'
import { useAuthStore } from './store/authStore'
import { Navbar } from './components/layout/Navbar'
import { BottomNav } from './components/layout/BottomNav'
import { Footer } from './components/layout/Footer'
import { ToastContainer } from './components/ui/Toast'
import { ErrorBoundary } from './components/layout/ErrorBoundary'
import { NotFound } from './components/layout/NotFound'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import SymptomChecker from './pages/SymptomChecker'
import Screening from './pages/Screening'
import Records from './pages/Records'
import Consult from './pages/Consult'
import Learn from './pages/Learn'
import Community from './pages/Community'
import WorkerPortal from './pages/WorkerPortal'
import WorkerFieldOps from './pages/WorkerFieldOps'
import WorkerInventory from './pages/WorkerInventory'
import WorkerTraining from './pages/WorkerTraining'
import Admin from './pages/Admin'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function ProtectedRoute({ children }: { children: React.JSX.Element }) {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

function RoleRoute({ children, roles }: { children: React.JSX.Element; roles: string[] }) {
  const { user, isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default function App() {
  const { theme, largeText, initialize } = useUiStore()
  const { checkAuth, isAuthenticated } = useAuthStore()

  useEffect(() => {
    initialize()
    checkAuth()
  }, [initialize])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    document.documentElement.classList.toggle('large-text', largeText)
  }, [largeText])

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-bg-base text-text-primary transition-colors duration-300">
        <ScrollToTop />
        <Navbar />
        <main className="min-h-[calc(100vh-4rem)]">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/symptom-checker" element={<ProtectedRoute><SymptomChecker /></ProtectedRoute>} />
              <Route path="/screening" element={<ProtectedRoute><Screening /></ProtectedRoute>} />
              <Route path="/records" element={<ProtectedRoute><Records /></ProtectedRoute>} />
              <Route path="/consult" element={<ProtectedRoute><Consult /></ProtectedRoute>} />
              <Route path="/learn" element={<ProtectedRoute><Learn /></ProtectedRoute>} />
              <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
              {/* Worker-Only Routes */}
              <Route path="/worker" element={<RoleRoute roles={['worker', 'admin']}><WorkerPortal /></RoleRoute>} />
              <Route path="/worker/field-ops" element={<RoleRoute roles={['worker', 'admin']}><WorkerFieldOps /></RoleRoute>} />
              <Route path="/worker/inventory" element={<RoleRoute roles={['worker', 'admin']}><WorkerInventory /></RoleRoute>} />
              <Route path="/worker/training" element={<RoleRoute roles={['worker', 'admin']}><WorkerTraining /></RoleRoute>} />
              <Route path="/admin" element={<RoleRoute roles={['admin']}><Admin /></RoleRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </main>
        {isAuthenticated && <BottomNav />}
        <ToastContainer />
      </div>
    </ErrorBoundary>
  )
}
