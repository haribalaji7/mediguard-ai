import { motion } from 'framer-motion'
import { classNames } from '../../lib/utils'

interface ProgressBarProps {
  progress: number
  color?: string
  height?: number
  showLabel?: boolean
  label?: string
  className?: string
}

export function ProgressBar({ progress, color, height = 8, showLabel, label, className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, progress))
  const barColor = color || (clamped > 70 ? 'var(--danger)' : clamped > 40 ? 'var(--warning)' : 'var(--success)')

  return (
    <div className={classNames('w-full', className || '')}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-sm font-medium text-text-secondary">{label}</span>}
          {showLabel && <span className="text-sm font-semibold text-text-primary">{Math.round(clamped)}%</span>}
        </div>
      )}
      <div
        className="w-full bg-border/40 rounded-full overflow-hidden"
        style={{ height }}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: barColor }}
        />
      </div>
    </div>
  )
}
