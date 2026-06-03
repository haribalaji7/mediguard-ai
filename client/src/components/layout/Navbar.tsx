import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sun, Moon, Heart, User, LogOut, Shield, Stethoscope } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../store/authStore'
import { useUiStore } from '../../store/uiStore'
import { LanguageSwitcher } from '../ui/LanguageSwitcher'
import { Button } from '../ui/Button'
import { classNames } from '../../lib/utils'

const navLinks = [
  { href: '/', label: 'nav.home', public: true },
  { href: '/dashboard', label: 'nav.dashboard', auth: true },
  { href: '/symptom-checker', label: 'nav.symptomChecker', auth: true },
  { href: '/screening', label: 'nav.screening', auth: true },
  { href: '/learn', label: 'nav.learn', public: true },
  { href: '/community', label: 'nav.community', public: true },
]

export function Navbar() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated, logout } = useAuthStore()
  const { theme, toggleTheme, largeText, setLargeText } = useUiStore()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string) => location.pathname === href

  return (
    <nav className="sticky top-0 z-40 bg-bg-base/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group" aria-label="MediGuard AI Home">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Heart size={20} className="text-white" />
            </div>
            <span className="font-display text-xl font-bold text-text-primary group-hover:text-primary transition-colors">
              MediGuard AI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              if (link.auth && !isAuthenticated) return null
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={classNames(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive(link.href)
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-secondary hover:text-text-primary hover:bg-gray-50 dark:hover:bg-white/5',
                  )}
                >
                  {t(link.label)}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLargeText(!largeText)}
              className="hidden md:flex px-2 py-1 rounded-lg text-xs font-bold text-text-secondary hover:text-primary border border-border hover:border-primary transition-colors"
              aria-label="Toggle large text"
              title={largeText ? 'Normal text' : 'Large text'}
            >
              A<sup className="text-[10px]">+</sup>
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-text-secondary hover:text-primary hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <LanguageSwitcher />

            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3 ml-2">
                <Link
                  to={user?.role === 'worker' ? '/worker' : user?.role === 'admin' ? '/admin' : '/dashboard'}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    {user?.role === 'worker' ? <Stethoscope size={16} className="text-primary" /> : <User size={16} className="text-primary" />}
                  </div>
                  <span className="text-sm font-medium text-text-primary max-w-[100px] truncate">{user?.name}</span>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => { logout(); navigate('/') }}>
                  <LogOut size={16} />
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2 ml-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                  {t('nav.login')}
                </Button>
                <Button size="sm" onClick={() => navigate('/register')}>
                  {t('nav.register')}
                </Button>
              </div>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-text-secondary hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border overflow-hidden bg-bg-card"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => {
                if (link.auth && !isAuthenticated) return null
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={classNames(
                      'block px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                      isActive(link.href)
                        ? 'bg-primary/10 text-primary'
                        : 'text-text-secondary hover:bg-gray-50 dark:hover:bg-white/5',
                    )}
                  >
                    {t(link.label)}
                  </Link>
                )
              })}
              <hr className="my-3 border-border" />
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <User size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{user?.name}</p>
                      <p className="text-xs text-text-secondary">{user?.phone}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setMobileOpen(false); logout(); navigate('/') }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-danger hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-2 px-4 pt-2">
                  <Button fullWidth variant="ghost" onClick={() => { setMobileOpen(false); navigate('/login') }}>
                    {t('nav.login')}
                  </Button>
                  <Button fullWidth onClick={() => { setMobileOpen(false); navigate('/register') }}>
                    {t('nav.register')}
                  </Button>
                </div>
              )}
              <div className="flex items-center gap-2 px-4 pt-2">
                <button
                  onClick={() => setLargeText(!largeText)}
                  className="px-3 py-2 rounded-lg text-xs font-bold border border-border hover:border-primary transition-colors"
                >
                  {largeText ? 'Normal' : 'Large'} Text
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
