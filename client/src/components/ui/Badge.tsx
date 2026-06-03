import { motion } from 'framer-motion'
import { classNames, getRiskBgColor } from '../../lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'low' | 'medium' | 'high' | 'emergency' | 'info' | 'success'
  size?: 'sm' | 'md'
  pulse?: boolean
  className?: string
}

export function Badge({ children, variant = 'info', size = 'md', pulse, className }: BadgeProps) {
  const variantStyles: Record<string, string> = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    emergency: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    info: 'bg-primary/10 text-primary dark:bg-primary/20',
    success: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
  }

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  }

  return (
    <motion.span
      animate={pulse ? { scale: [1, 1.05, 1] } : {}}
      transition={pulse ? { repeat: Infinity, duration: 1.5 } : {}}
      className={classNames(
        'inline-flex items-center font-semibold rounded-full',
        variantStyles[variant] || variantStyles.info,
        sizeStyles[size],
        className || '',
      )}
    >
      {(variant === 'high' || variant === 'emergency') && (
        <span className={classNames(
          'w-1.5 h-1.5 rounded-full mr-1.5',
          variant === 'emergency' ? 'bg-red-500 animate-pulse' : 'bg-orange-500 animate-pulse',
        )} />
      )}
      {children}
    </motion.span>
  )
}
