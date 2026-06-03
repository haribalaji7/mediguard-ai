import { Link, useLocation } from 'react-router-dom'
import { Home, Stethoscope, FileText, BookOpen, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { classNames } from '../../lib/utils'

const items = [
  { href: '/dashboard', icon: Home, label: 'nav.home' },
  { href: '/symptom-checker', icon: Stethoscope, label: 'nav.symptomChecker' },
  { href: '/records', icon: FileText, label: 'nav.records' },
  { href: '/learn', icon: BookOpen, label: 'nav.learn' },
  { href: '/profile', icon: User, label: 'nav.profile' },
]

export function BottomNav() {
  const { t } = useTranslation()
  const location = useLocation()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-bg-card/95 backdrop-blur-lg border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.href}
              to={item.href}
              className={classNames(
                'flex flex-col items-center justify-center gap-0.5 px-3 py-1 min-w-[56px] min-h-[48px] rounded-xl transition-colors',
                isActive ? 'text-primary' : 'text-text-secondary hover:text-text-primary',
              )}
              aria-label={t(item.label)}
            >
              <item.icon size={22} className={isActive ? 'fill-primary/10' : ''} />
              <span className="text-[10px] font-medium leading-tight">{t(item.label)}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
