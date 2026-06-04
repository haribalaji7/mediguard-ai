import { useState, useEffect } from 'react'
import { motion as motionHtml } from 'framer-motion'
import { Calendar, MapPin, Users, Volume2, VolumeX, QrCode, Clock, User, CheckCircle2, AlertCircle } from 'lucide-react'
import { formatDate } from '../../lib/utils'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Badge } from '../ui/Badge'
import { useUiStore } from '../../store/uiStore'
import { useAuthStore } from '../../store/authStore'
import type { HealthCamp } from '../../types'

interface CampCardProps {
  camp: HealthCamp
}

export function CampCard({ camp }: CampCardProps) {
  const { addToast } = useUiStore()
  const { user } = useAuthStore()

  // 1. Reminders Persistence
  const [isReminderSet, setIsReminderSet] = useState<boolean>(() => {
    const saved = localStorage.getItem(`camp-reminder-${camp._id}`)
    return saved === 'true'
  })

  // 2. Audio Broadcast / Accessibility
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)

  // 3. Camp Registration
  const [showRegModal, setShowRegModal] = useState(false)
  const [showPassModal, setShowPassModal] = useState(false)
  const [attendeeName, setAttendeeName] = useState(user?.name || '')
  const [attendeeRelation, setAttendeeRelation] = useState('Self')
  const [timeSlot, setTimeSlot] = useState('09:00 AM - 11:00 AM')

  const [registration, setRegistration] = useState<{
    name: string
    relation: string
    slot: string
    passId: string
    date: string
  } | null>(() => {
    const saved = localStorage.getItem(`camp-reg-${camp._id}`)
    return saved ? JSON.parse(saved) : null
  })

  // Update default name if user changes
  useEffect(() => {
    if (user?.name && !attendeeName) {
      setAttendeeName(user.name)
    }
  }, [user, attendeeName])

  // Stop audio synthesis when component unmounts
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel()
    }
  }, [])

  const handleToggleReminder = () => {
    const newValue = !isReminderSet
    setIsReminderSet(newValue)
    if (newValue) {
      localStorage.setItem(`camp-reminder-${camp._id}`, 'true')
      addToast(`Reminder set! You will receive an SMS alert 24 hours before the camp.`, 'success')
    } else {
      localStorage.removeItem(`camp-reminder-${camp._id}`)
      addToast(`Reminder cancelled for "${camp.title}".`, 'info')
    }
  }

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      window.speechSynthesis.cancel()
      setIsPlayingAudio(false)
    } else {
      window.speechSynthesis.cancel()
      const textToSpeak = `${camp.title}. Organized by ${camp.organizer}. Date: ${formatDate(camp.date)}. Location: ${camp.location}. Services available: ${camp.services.join(', ')}. Details: ${camp.description}`
      const utterance = new SpeechSynthesisUtterance(textToSpeak)
      
      utterance.onend = () => setIsPlayingAudio(false)
      utterance.onerror = () => setIsPlayingAudio(false)
      
      setIsPlayingAudio(true)
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleRegister = () => {
    if (!attendeeName.trim()) {
      addToast('Please enter the attendee name.', 'error')
      return
    }
    const regDetails = {
      name: attendeeName,
      relation: attendeeRelation,
      slot: timeSlot,
      passId: `MG-CAMP-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString()
    }
    localStorage.setItem(`camp-reg-${camp._id}`, JSON.stringify(regDetails))
    setRegistration(regDetails)
    setShowRegModal(false)
    setShowPassModal(true)
    addToast('Successfully registered for the health camp!', 'success')
  }

  const handleCancelRegistration = () => {
    if (window.confirm('Are you sure you want to cancel your slot registration?')) {
      localStorage.removeItem(`camp-reg-${camp._id}`)
      setRegistration(null)
      addToast('Registration cancelled.', 'info')
    }
  }

  return (
    <motionHtml.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-card rounded-2xl border border-border shadow-card p-5 hover:shadow-card-hover transition-all flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Users size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary text-sm sm:text-base">{camp.title}</h3>
              <p className="text-xs text-text-secondary">{camp.organizer}</p>
            </div>
          </div>
          
          {/* Audio Broadcast Guide Button */}
          <button
            onClick={handleToggleAudio}
            className={`p-2 rounded-xl transition-all border shrink-0 ${
              isPlayingAudio 
                ? 'bg-primary/20 border-primary text-primary animate-pulse'
                : 'bg-bg-base border-border text-text-secondary hover:border-primary/50 hover:text-primary'
            }`}
            title={isPlayingAudio ? 'Stop Audio Guide' : 'Listen to Camp Details'}
          >
            {isPlayingAudio ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
        </div>

        <div className="space-y-2 text-sm text-text-secondary mb-4">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-primary shrink-0" />
            <span>{formatDate(camp.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-primary shrink-0" />
            <span className="truncate">{camp.location}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {camp.services.map((service) => (
            <span key={service} className="px-2 py-0.5 text-xs font-semibold rounded-full bg-primary/5 text-primary border border-primary/10">
              {service}
            </span>
          ))}
        </div>
        
        <p className="text-xs text-text-secondary mb-4 leading-relaxed line-clamp-3">{camp.description}</p>
      </div>

      <div className="space-y-2 pt-2 border-t border-border/40">
        {/* Registration Badge if registered */}
        {registration ? (
          <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 font-semibold mb-2">
            <span className="flex items-center gap-1">
              <CheckCircle2 size={13} /> Registered Slot
            </span>
            <button
              onClick={() => setShowPassModal(true)}
              className="text-primary hover:underline hover:text-primary-dark"
            >
              View Pass
            </button>
          </div>
        ) : null}

        <div className="flex gap-2">
          {/* Reminder Button */}
          <Button 
            variant={isReminderSet ? 'secondary' : 'primary'} 
            size="sm" 
            className="flex-1 text-xs"
            onClick={handleToggleReminder}
          >
            {isReminderSet ? '✓ Reminder Set' : 'Set Reminder'}
          </Button>

          {/* Registration Button */}
          {registration ? (
            <Button 
              variant="danger" 
              size="sm" 
              className="flex-1 text-xs"
              onClick={handleCancelRegistration}
            >
              Cancel Slot
            </Button>
          ) : (
            <Button 
              variant="secondary" 
              size="sm" 
              className="flex-1 text-xs"
              onClick={() => setShowRegModal(true)}
            >
              Register Slot
            </Button>
          )}
        </div>
      </div>

      {/* MODAL: REGISTER FOR CAMP */}
      <Modal isOpen={showRegModal} onClose={() => setShowRegModal(false)} title="Register Camp Entry Slot" size="md">
        <p className="text-xs text-text-secondary mb-4">
          Book an appointment slot to get prioritized during the checkup camp and avoid long waiting queues.
        </p>
        <div className="space-y-4">
          <Input 
            label="Patient Name" 
            value={attendeeName} 
            onChange={(e) => setAttendeeName(e.target.value)} 
            placeholder="Enter full name" 
          />
          
          <div>
            <label className="text-xs font-semibold text-text-secondary block mb-1.5">Relationship to Account</label>
            <div className="grid grid-cols-4 gap-2">
              {['Self', 'Spouse', 'Child', 'Parent'].map((rel) => (
                <button
                  key={rel}
                  type="button"
                  onClick={() => setAttendeeRelation(rel)}
                  className={`py-1.5 text-xs font-bold rounded-xl border transition-all ${
                    attendeeRelation === rel
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-bg-card border-border text-text-secondary hover:border-primary/50'
                  }`}
                >
                  {rel}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-text-secondary block mb-1.5">Select Preferred Time Slot</label>
            <div className="space-y-2">
              {[
                { slot: '09:00 AM - 11:00 AM', label: 'Morning Session (General)' },
                { slot: '11:00 AM - 01:00 PM', label: 'Mid-Day Session' },
                { slot: '02:00 PM - 04:00 PM', label: 'Evening Session' }
              ].map((item) => (
                <button
                  key={item.slot}
                  type="button"
                  onClick={() => setTimeSlot(item.slot)}
                  className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                    timeSlot === item.slot
                      ? 'bg-primary/5 border-primary text-text-primary'
                      : 'bg-bg-card border-border text-text-secondary hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Clock size={14} className={timeSlot === item.slot ? 'text-primary' : 'text-text-secondary'} />
                    <div>
                      <p className="text-xs font-bold">{item.slot}</p>
                      <p className="text-[10px] opacity-75">{item.label}</p>
                    </div>
                  </div>
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                    timeSlot === item.slot ? 'border-primary bg-primary' : 'border-border'
                  }`}>
                    {timeSlot === item.slot && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Button fullWidth onClick={handleRegister} className="mt-2">
            Confirm Registration Slot
          </Button>
        </div>
      </Modal>

      {/* MODAL: VIEW TICKET PASS */}
      <Modal isOpen={showPassModal} onClose={() => setShowPassModal(false)} title="Camp Entry Pass" size="md">
        {registration && (
          <div className="space-y-6">
            <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent-gold/5 to-bg-card border-2 border-dashed border-primary/40 rounded-3xl p-5 shadow-inner">
              {/* Card Header */}
              <div className="flex justify-between items-start gap-4 pb-4 border-b border-border/60">
                <div>
                  <Badge variant="success" size="sm" className="mb-1">Active Ticket</Badge>
                  <h4 className="font-display font-bold text-text-primary text-base">{camp.title}</h4>
                  <p className="text-[11px] text-text-secondary mt-0.5">{camp.organizer}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-text-secondary block uppercase tracking-wider font-bold">Pass ID</span>
                  <span className="font-mono text-xs font-bold text-text-primary">{registration.passId}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="grid grid-cols-2 gap-4 py-4 text-xs">
                <div>
                  <span className="text-text-secondary block font-semibold">Attending Patient</span>
                  <span className="font-bold text-text-primary text-sm flex items-center gap-1 mt-0.5">
                    <User size={13} className="text-primary" /> {registration.name}
                  </span>
                  <span className="text-[10px] text-text-secondary">({registration.relation})</span>
                </div>

                <div>
                  <span className="text-text-secondary block font-semibold">Appointment Slot</span>
                  <span className="font-bold text-text-primary text-sm flex items-center gap-1 mt-0.5">
                    <Clock size={13} className="text-primary" /> {registration.slot}
                  </span>
                  <span className="text-[10px] text-text-secondary">Date: {formatDate(camp.date)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 py-3 bg-bg-base/50 px-3 rounded-2xl border border-border/40 text-[11px] text-text-secondary mb-4">
                <MapPin size={13} className="text-primary shrink-0" />
                <span>Venue: <strong>{camp.location}</strong></span>
              </div>

              {/* QR Code and Stub */}
              <div className="flex flex-col items-center justify-center pt-2">
                <div className="p-3 bg-white border border-border rounded-2xl shadow-sm flex items-center justify-center">
                  <QrCode size={120} className="text-gray-900" />
                </div>
                <p className="text-[9px] text-text-secondary mt-2 tracking-widest uppercase font-semibold">
                  Scan at Camp Registration Counter
                </p>
              </div>

              {/* Card Footer Warning */}
              <div className="mt-4 pt-3 border-t border-border/50 flex items-center gap-1.5 text-[10px] text-text-secondary">
                <AlertCircle size={12} className="text-accent-gold" />
                <span>Please arrive 15 minutes before your time slot.</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="primary" 
                fullWidth 
                onClick={() => {
                  window.print()
                }}
              >
                Print / Print to PDF
              </Button>
              <Button variant="secondary" onClick={() => setShowPassModal(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </motionHtml.div>
  )
}
