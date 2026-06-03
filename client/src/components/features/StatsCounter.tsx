import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { CountUp } from '../ui/CountUp'

interface StatItem {
  end: number
  suffix?: string
  labelKey: string
}

const stats: StatItem[] = [
  { end: 247392, labelKey: 'landing.stats.screened' },
  { end: 18423, labelKey: 'landing.stats.detected' },
  { end: 102847, labelKey: 'landing.stats.impacted' },
]

export function StatsCounter() {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, i) => (
        <div key={i} className="text-center p-6 rounded-2xl bg-bg-card/50 backdrop-blur-sm border border-border">
          <div className="text-3xl md:text-4xl font-bold font-display text-primary mb-1">
            {isInView ? (
              <CountUp end={stat.end} duration={2.5} formatter={(n) => Math.round(n).toLocaleString('en-IN')} />
            ) : (
              '0'
            )}
            {stat.suffix}
          </div>
          <div className="text-sm text-text-secondary font-medium">{t(stat.labelKey)}</div>
        </div>
      ))}
    </div>
  )
}
