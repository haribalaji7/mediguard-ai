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
  { href: '/dashboard', label: 'nav.dashboard', auth: true, roles: ['patient'] },
  { href: '/symptom-checker', label: 'nav.symptomChecker', auth: true, roles: ['patient'] },
  { href: '/screening', label: 'nav.screening', auth: true, roles: ['patient'] },
  { href: '/learn', label: 'nav.learn', auth: true, roles: ['patient'] },
  { href: '/community', label: 'nav.community', auth: true, roles: ['patient'] },
  
  // Worker Specific Routes
  { href: '/worker', label: 'Command Center', auth: true, roles: ['worker', 'admin'] },
  { href: '/worker/field-ops', label: 'Field Ops', auth: true, roles: ['worker', 'admin'] },
  { href: '/worker/inventory', label: 'Inventory', auth: true, roles: ['worker', 'admin'] },
  { href: '/worker/training', label: 'Training', auth: true, roles: ['worker', 'admin'] },
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
    <nav className="sticky top-2 sm:top-4 z-50 mx-2 sm:mx-6 md:mx-auto max-w-7xl bg-bg-card/70 backdrop-blur-2xl border border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.1)] rounded-3xl transition-all duration-300">
      <div className="px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link to="/" className="flex items-center gap-3 group" aria-label="MediGuard AI Home">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow group-hover:shadow-[0_0_30px_rgba(0,200,150,0.5)] transition-all">
              <Heart size={20} className="text-white fill-white group-hover:scale-110 transition-transform" />
            </div>
            <span className="font-display text-xl font-bold text-text-primary group-hover:text-primary transition-colors">
              MediGuard AI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              if (link.auth && !isAuthenticated) return null
              if ((link as any).roles && user && !(link as any).roles.includes(user.role)) return null
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={classNames(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive(link.href)
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-secondary hover:text-text-primary hover:bg-border/20',
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
              className="p-2 rounded-lg text-text-secondary hover:text-primary hover:bg-border/30 transition-colors"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <LanguageSwitcher />

            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3 ml-2">
                <Link
                  to={user?.role === 'worker' ? '/worker' : user?.role === 'admin' ? '/admin' : '/dashboard'}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-border/30 transition-colors"
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
              className="md:hidden p-2 rounded-lg text-text-secondary hover:bg-border/30 transition-colors"
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
                if ((link as any).roles && user && !(link as any).roles.includes(user.role)) return null
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={classNames(
                      'block px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                      isActive(link.href)
                        ? 'bg-primary/10 text-primary'
                        : 'text-text-secondary hover:bg-border/20',
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
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-danger hover:bg-danger/10 transition-colors"
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
