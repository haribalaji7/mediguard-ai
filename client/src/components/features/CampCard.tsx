import { motion } from 'framer-motion'
import { Calendar, MapPin, Users } from 'lucide-react'
import { formatDate } from '../../lib/utils'
import { Button } from '../ui/Button'
import type { HealthCamp } from '../../types'

interface CampCardProps {
  camp: HealthCamp
}

export function CampCard({ camp }: CampCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-card rounded-2xl border border-border shadow-card p-5 hover:shadow-card-hover transition-all"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Users size={20} className="text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-text-primary">{camp.title}</h3>
          <p className="text-sm text-text-secondary">{camp.organizer}</p>
        </div>
      </div>
      <div className="space-y-2 text-sm text-text-secondary mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-primary" />
          <span>{formatDate(camp.date)}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-primary" />
          <span>{camp.location}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {camp.services.map((service) => (
          <span key={service} className="px-2.5 py-1 text-xs font-medium rounded-full bg-primary/5 text-primary">
            {service}
          </span>
        ))}
      </div>
      <p className="text-sm text-text-secondary mb-4">{camp.description}</p>
      <Button variant="primary" size="sm" fullWidth>
        Set Reminder
      </Button>
    </motion.div>
  )
}
