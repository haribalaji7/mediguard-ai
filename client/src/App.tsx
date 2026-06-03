import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
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
import Admin from './pages/Admin'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  const { theme, largeText, initialize } = useUiStore()
  const { checkAuth } = useAuthStore()

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
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/symptom-checker" element={<SymptomChecker />} />
              <Route path="/screening" element={<Screening />} />
              <Route path="/records" element={<Records />} />
              <Route path="/consult" element={<Consult />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/community" element={<Community />} />
              <Route path="/worker" element={<WorkerPortal />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </main>
        <BottomNav />
        <ToastContainer />
      </div>
    </ErrorBoundary>
  )
}
