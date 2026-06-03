import { motion } from 'framer-motion'
import { Activity, Heart, Wind, Droplets, Baby } from 'lucide-react'
import { Button } from '../ui/Button'
import { classNames } from '../../lib/utils'

interface ScreeningCardProps {
  type: string
  title: string
  description: string
  time: string
  icon: string
  onClick: () => void
}

const iconMap: Record<string, React.ElementType> = {
  Diabetes: Activity,
  Hypertension: Heart,
  TB: Wind,
  Anemia: Droplets,
  Maternal: Baby,
}

export function ScreeningCard({ type, title, description, time, icon, onClick }: ScreeningCardProps) {
  const Icon = iconMap[icon] || Activity

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-bg-card rounded-2xl border border-border shadow-card p-5 hover:shadow-card-hover transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className={classNames(
          'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
          type === 'diabetes' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' :
          type === 'hypertension' ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300' :
          type === 'tb' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300' :
          type === 'anemia' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300' :
          'bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300',
        )}>
          <Icon size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text-primary">{title}</h3>
          <p className="text-sm text-text-secondary mt-0.5">{description}</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-text-secondary">{time}</span>
          </div>
        </div>
      </div>
      <div className="mt-4" onClick={(e) => e.stopPropagation()}>
        <Button variant="primary" size="sm" fullWidth onClick={onClick}>
          Start Screening
        </Button>
      </div>
    </motion.div>
  )
}
