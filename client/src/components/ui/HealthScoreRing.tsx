import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect } from 'react'
import { classNames } from '../../lib/utils'

interface HealthScoreRingProps {
  score: number
  size?: number
  strokeWidth?: number
  className?: string
}

export function HealthScoreRing({ score, size = 140, strokeWidth = 10, className }: HealthScoreRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))
  const offset = useTransform(count, (v) => circumference - (v / 100) * circumference)

  useEffect(() => {
    const controls = animate(count, score, { duration: 1.5, ease: 'easeOut' })
    return controls.stop
  }, [score, count])

  const getColor = (s: number) => {
    if (s >= 80) return '#27AE60'
    if (s >= 60) return '#FDCB6E'
    if (s >= 40) return '#F39C12'
    return '#FF7675'
  }

  const color = getColor(score)

  return (
    <div className={classNames('relative inline-flex items-center justify-center', className || '')}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: offset }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-3xl font-bold font-display"
          style={{ color }}
        >
          {rounded}
        </motion.span>
        <span className="text-xs text-text-secondary font-medium -mt-1">/ 100</span>
      </div>
    </div>
  )
}
