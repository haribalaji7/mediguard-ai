import { classNames } from '../../lib/utils'

interface SkeletonProps {
  variant?: 'text' | 'circle' | 'rect' | 'card'
  width?: string | number
  height?: string | number
  className?: string
}

export function Skeleton({ variant = 'text', width, height, className }: SkeletonProps) {
  const base = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded'

  const variants = {
    text: 'h-4 w-full rounded',
    circle: 'rounded-full',
    rect: 'rounded-lg',
    card: 'rounded-2xl h-48 w-full',
  }

  return (
    <div
      className={classNames(base, variants[variant], className || '')}
      style={{ width, height }}
      aria-hidden="true"
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-bg-card rounded-2xl border border-border p-6 space-y-4 animate-pulse">
      <Skeleton variant="rect" height={24} width="60%" />
      <Skeleton variant="text" />
      <Skeleton variant="text" width="80%" />
      <div className="flex gap-4 pt-2">
        <Skeleton variant="circle" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="50%" />
          <Skeleton variant="text" width="30%" />
        </div>
      </div>
    </div>
  )
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}
