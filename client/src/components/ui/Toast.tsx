import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { useUiStore } from '../../store/uiStore'

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const colors = {
  success: 'border-l-4 border-success bg-green-50 dark:bg-green-900/20',
  error: 'border-l-4 border-danger bg-red-50 dark:bg-red-900/20',
  warning: 'border-l-4 border-warning bg-yellow-50 dark:bg-yellow-900/20',
  info: 'border-l-4 border-primary bg-blue-50 dark:bg-blue-900/20',
}

const iconColors = {
  success: 'text-success',
  error: 'text-danger',
  warning: 'text-warning',
  info: 'text-primary',
}

export function ToastContainer() {
  const { toasts, removeToast } = useUiStore()

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.type]
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              className={`pointer-events-auto flex items-start gap-3 p-4 bg-bg-card rounded-xl shadow-lg border border-border ${colors[toast.type]}`}
              role="alert"
            >
              <Icon size={20} className={`${iconColors[toast.type]} shrink-0 mt-0.5`} />
              <p className="flex-1 text-sm text-text-primary">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 p-1 rounded hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                aria-label="Dismiss"
              >
                <X size={14} className="text-text-secondary" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
