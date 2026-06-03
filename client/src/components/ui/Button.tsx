import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { classNames } from '../../lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  fullWidth?: boolean
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading,
  fullWidth,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-body font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary/50 rounded-full shadow-md hover:shadow-lg',
    secondary: 'bg-white text-primary border-2 border-primary hover:bg-primary-light focus:ring-primary/30 rounded-lg',
    ghost: 'bg-transparent text-text-secondary hover:bg-gray-100 dark:hover:bg-white/10 focus:ring-text-secondary/30 rounded-lg',
    danger: 'bg-danger text-white hover:bg-red-700 focus:ring-danger/50 rounded-lg shadow-md',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm gap-1.5 min-h-[36px]',
    md: 'px-6 py-2.5 text-sm gap-2 min-h-[44px]',
    lg: 'px-8 py-3.5 text-base gap-2.5 min-h-[52px]',
  }

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={classNames(baseStyles, variants[variant], sizes[size], fullWidth ? 'w-full' : '', className || '')}
      disabled={disabled || isLoading}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </motion.button>
  )
}
