import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { classNames } from '../../lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
      window.addEventListener('keydown', handleEsc)
      return () => {
        document.body.style.overflow = ''
        window.removeEventListener('keydown', handleEsc)
      }
    }
  }, [isOpen, onClose])

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={classNames(
              'relative w-full bg-bg-card rounded-2xl shadow-2xl border border-border overflow-hidden z-10',
              sizes[size],
            )}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            {title && (
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
                <h2 className="font-display text-xl font-semibold text-text-primary">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-border/30 transition-colors"
                  aria-label="Close modal"
                >
                  <X size={20} className="text-text-secondary" />
                </button>
              </div>
            )}
            <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
