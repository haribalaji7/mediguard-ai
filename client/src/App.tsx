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
      <div className="min-h-screen bg-bg-base text-text-primary transition-colors duration-500 overflow-x-hidden relative">
        {/* Global Ambient Background */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] animate-blob" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[120px] animate-blob animation-delay-4000" />
          <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-accent-gold/5 rounded-full blur-[80px] animate-blob animation-delay-2000" />
        </div>
        
        <div className="relative z-10 flex flex-col min-h-screen">
          <ScrollToTop />
          <Navbar />
          <main className="flex-1 pb-20 md:pb-8">
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
        <Footer />
        <ToastContainer />
        </div>
      </div>
    </ErrorBoundary>
  )
}
