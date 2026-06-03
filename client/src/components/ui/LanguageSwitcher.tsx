import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Languages, ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { classNames } from '../../lib/utils'

const languages = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'hi', label: 'हि', name: 'हिन्दी' },
  { code: 'ta', label: 'த', name: 'தமிழ்' },
  { code: 'te', label: 'తె', name: 'తెలుగు' },
  { code: 'bn', label: 'বাং', name: 'বাংলা' },
]

export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const current = languages.find((l) => l.code === i18n.language) || languages[0]

  const switchLang = (code: string) => {
    i18n.changeLanguage(code)
    localStorage.setItem('i18nextLng', code)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={classNames(
          'flex items-center gap-2 px-3 py-2 rounded-full border border-border bg-bg-card shadow-sm',
          'hover:border-primary hover:shadow-md transition-all duration-200',
          'text-sm font-semibold text-text-primary',
        )}
        aria-label="Select language"
      >
        <Languages size={16} className="text-primary" />
        <span>{current.label}</span>
        <ChevronDown size={14} className={classNames('transition-transform', isOpen ? 'rotate-180' : '')} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-40 bg-bg-card rounded-xl shadow-xl border border-border overflow-hidden z-50"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => switchLang(lang.code)}
                className={classNames(
                  'w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors',
                  lang.code === current.code
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-text-primary hover:bg-gray-50 dark:hover:bg-white/5',
                )}
              >
                <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                  {lang.label}
                </span>
                <span>{lang.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
