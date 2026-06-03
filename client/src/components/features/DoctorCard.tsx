import { motion } from 'framer-motion'
import { Star, Video, MessageCircle, Calendar, Stethoscope } from 'lucide-react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import type { Doctor } from '../../types'

interface DoctorCardProps {
  doctor: Doctor
  onBook?: (doctor: Doctor) => void
  onChat?: (doctor: Doctor) => void
  onVideoCall?: (doctor: Doctor) => void
}

export function DoctorCard({ doctor, onBook, onChat, onVideoCall }: DoctorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-card rounded-2xl border border-border shadow-card p-5 hover:shadow-card-hover transition-all"
    >
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
          <Stethoscope size={28} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text-primary truncate">{doctor.name}</h3>
          <p className="text-sm text-text-secondary">{doctor.specialty}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-0.5">
              <Star size={14} className="text-accent-gold fill-accent-gold" />
              <span className="text-sm font-medium text-text-primary">{doctor.rating}</span>
            </div>
            <span className="text-xs text-text-secondary">{doctor.languages.join(', ')}</span>
          </div>
        </div>
        {doctor.availableToday && (
          <Badge variant="success" size="sm">Available Today</Badge>
        )}
      </div>
      <div className="flex gap-2 mt-4">
        {onChat && (
          <Button variant="ghost" size="sm" onClick={() => onChat(doctor)}>
            <MessageCircle size={16} /> Chat
          </Button>
        )}
        {onVideoCall && (
          <Button variant="secondary" size="sm" onClick={() => onVideoCall(doctor)}>
            <Video size={16} /> Video
          </Button>
        )}
        {onBook && (
          <Button size="sm" onClick={() => onBook(doctor)} className="ml-auto">
            <Calendar size={16} /> Book
          </Button>
        )}
      </div>
    </motion.div>
  )
}
