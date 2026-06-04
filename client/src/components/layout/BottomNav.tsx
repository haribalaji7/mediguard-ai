import { Link, useLocation } from 'react-router-dom'
import { Home, Stethoscope, FileText, BookOpen, User, Clipboard, Package, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../store/authStore'
import { classNames } from '../../lib/utils'

const patientItems = [
  { href: '/dashboard', icon: Home, label: 'nav.home' },
  { href: '/symptom-checker', icon: Stethoscope, label: 'nav.symptomChecker' },
  { href: '/records', icon: FileText, label: 'nav.records' },
  { href: '/learn', icon: BookOpen, label: 'nav.learn' },
  { href: '/community', icon: User, label: 'nav.community' },
]

const workerItems = [
  { href: '/worker', icon: Clipboard, label: 'Command Center' },
  { href: '/worker/field-ops', icon: Users, label: 'Field Ops' },
  { href: '/worker/inventory', icon: Package, label: 'Inventory' },
  { href: '/worker/training', icon: BookOpen, label: 'Training' },
]

export function BottomNav() {
  const { t } = useTranslation()
  const location = useLocation()
  const { user } = useAuthStore()

  const items = user?.role === 'worker' || user?.role === 'admin' ? workerItems : patientItems

  return (
    <nav className="md:hidden fixed bottom-4 left-4 right-4 z-40 bg-bg-card/70 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden safe-area-bottom">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
      <div className="flex items-center justify-around h-16 px-2 relative z-10">
        {items.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.href}
              to={item.href}
              className={classNames(
                'relative flex flex-col items-center justify-center gap-1 px-3 py-1 min-w-[64px] min-h-[48px] rounded-xl transition-all duration-300',
                isActive ? 'text-primary scale-110' : 'text-text-secondary hover:text-text-primary hover:scale-105',
              )}
              aria-label={t(item.label)}
            >
              {isActive && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(0,184,148,0.8)]" />
              )}
              {isActive && (
                <div className="absolute inset-0 bg-primary/10 rounded-xl blur-sm -z-10" />
              )}
              <item.icon size={22} className={classNames('transition-transform duration-300', isActive ? 'fill-primary/20 drop-shadow-[0_0_8px_rgba(0,184,148,0.5)]' : '')} />
              <span className={classNames("text-[10px] font-bold leading-tight transition-opacity", isActive ? 'opacity-100' : 'opacity-70')}>{t(item.label)}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
