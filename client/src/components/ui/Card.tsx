import { motion } from 'framer-motion'
import { classNames } from '../../lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hoverable?: boolean
  onClick?: () => void
  variant?: 'default' | 'primary' | 'warning' | 'danger'
}

export function Card({ children, className, hoverable, onClick, variant = 'default' }: CardProps) {
  const variantStyles = {
    default: 'bg-bg-card border border-border shadow-card',
    primary: 'bg-primary/5 border-primary/20 shadow-card',
    warning: 'bg-warning/5 border-warning/20 shadow-card',
    danger: 'bg-danger/5 border-danger/20 shadow-card',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hoverable ? { y: -2, boxShadow: '0 8px 32px rgba(0,184,148,0.15)' } : {}}
      onClick={onClick}
      className={classNames(
        'rounded-2xl p-6 transition-all duration-200',
        variantStyles[variant],
        hoverable ? 'cursor-pointer hover:shadow-card-hover' : '',
        onClick ? 'cursor-pointer' : '',
        className || '',
      )}
    >
      {children}
    </motion.div>
  )
}
