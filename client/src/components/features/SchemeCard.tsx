import { motion } from 'framer-motion'
import { ExternalLink, Shield, Users, IndianRupee } from 'lucide-react'
import { Button } from '../ui/Button'
import type { GovernmentScheme } from '../../types'

interface SchemeCardProps {
  scheme: GovernmentScheme
}

const iconMap: Record<string, React.ElementType> = {
  'Ayushman Bharat - PM-JAY': Shield,
  'Janani Suraksha Yojana': Users,
  'PM Jan Aushadhi Yojana': IndianRupee,
}

export function SchemeCard({ scheme }: SchemeCardProps) {
  const Icon = iconMap[scheme.name] || Shield

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-card rounded-2xl border border-border shadow-card p-5 hover:shadow-card-hover transition-all"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-accent-gold/20 flex items-center justify-center shrink-0">
          <Icon size={20} className="text-accent-gold" />
        </div>
        <div>
          <h3 className="font-semibold text-text-primary">{scheme.name}</h3>
        </div>
      </div>
      <p className="text-sm text-text-secondary mb-3">{scheme.description}</p>
      <div className="space-y-2 text-sm mb-4">
        <div>
          <span className="font-medium text-text-primary">Eligibility: </span>
          <span className="text-text-secondary">{scheme.eligibility}</span>
        </div>
        <div>
          <span className="font-medium text-text-primary">Benefits: </span>
          <span className="text-text-secondary">{scheme.benefits}</span>
        </div>
      </div>
      <a href={scheme.applyUrl} target="_blank" rel="noopener noreferrer">
        <Button variant="secondary" size="sm" fullWidth>
          <ExternalLink size={16} /> Apply Now
        </Button>
      </a>
    </motion.div>
  )
}
