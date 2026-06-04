import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, MessageCircle, Video, Calendar, Clock, ChevronRight, Send, Phone, Mic } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { DoctorCard } from '../components/features/DoctorCard'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { Badge } from '../components/ui/Badge'
import { mockDoctors, mockChatMessages } from '../lib/mockData'
import { formatDate } from '../lib/utils'
import { useDebounce } from '../hooks/useDebounce'
import { useUiStore } from '../store/uiStore'
import type { Doctor, ChatMessage } from '../types'

const prescriptions = [
  { id: 'pr-1', doctorName: 'Dr. Priya Singh', date: '2026-05-20', medicine: 'Paracetamol 500mg, Multivitamin', notes: 'Take with food, 2 times a day' },
]

export default function Consult() {
  const { addToast } = useUiStore()
  const [search, setSearch] = useState('')
  const [selectedDoc, setSelectedDoc] = useState<Doctor | null>(null)
  const [showChat, setShowChat] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [showBooking, setShowBooking] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages)
  const [chatInput, setChatInput] = useState('')
  const debouncedSearch = useDebounce(search, 200)

  // Dynamic appointments state
  const [appointments, setAppointments] = useState([
    { id: 'apt-1', doctorName: 'Dr. Priya Singh', date: '2026-06-10T10:00:00Z', status: 'scheduled' as const },
    { id: 'apt-2', doctorName: 'Dr. Rajesh Gupta', date: '2026-05-28T11:00:00Z', status: 'completed' as const },
  ])

  // Booking details states
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  // Generate next 7 days starting from today for selection
  const nextSevenDays = useMemo(() => {
    const days = []
    const today = new Date()
    for (let i = 0; i < 7; i++) {
      const d = new Date()
      d.setDate(today.getDate() + i)
      days.push({
        dayNumber: d.getDate(),
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        fullDate: d.toISOString(),
      })
    }
    return days
  }, [])

  const confirmBooking = () => {
    if (selectedDayIndex === null || !selectedTime || !selectedDoc) return

    const selectedDayObj = nextSevenDays[selectedDayIndex]
    const datePart = selectedDayObj.fullDate.split('T')[0]
    
    // Construct time string (e.g. 9:00 AM -> 09:00)
    let hour = '09'
    if (selectedTime === '10:00 AM') hour = '10'
    else if (selectedTime === '11:00 AM') hour = '11'
    else if (selectedTime === '2:00 PM') hour = '14'
    else if (selectedTime === '3:00 PM') hour = '15'
    else if (selectedTime === '4:00 PM') hour = '16'

    const dateStr = `${datePart}T${hour}:00:00.000Z`

    const newAppointment = {
      id: `apt-${Date.now()}`,
      doctorName: selectedDoc.name,
      date: dateStr,
      status: 'scheduled' as const,
    }

    setAppointments((prev) => [newAppointment, ...prev])
    addToast(`Successfully booked appointment with ${selectedDoc.name}!`, 'success')
    
    // Reset selection and close modal
    setSelectedDayIndex(null)
    setSelectedTime(null)
    setShowBooking(false)
  }

  const filteredDoctors = mockDoctors.filter(
    (d) => d.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || d.specialty.toLowerCase().includes(debouncedSearch.toLowerCase()),
  )

  const sendChatMessage = () => {
    if (!chatInput.trim()) return
    setChatMessages((prev) => [...prev, { id: Math.random().toString(36).substring(2), role: 'user', content: chatInput, timestamp: Date.now() }])
    setChatInput('')
    setTimeout(() => {
      setChatMessages((prev) => [...prev, { id: Math.random().toString(36).substring(2), role: 'bot', content: 'Thank you for your message. A healthcare worker will respond shortly.', timestamp: Date.now() }])
    }, 1000)
  }

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary mb-1">Telemedicine</h1>
        <p className="text-text-secondary text-sm mb-6">Connect with doctors and ASHA workers</p>

        <Input label="Search doctors, specialists, or ASHA workers..." value={search} onChange={(e) => setSearch(e.target.value)} placeholder=" " className="mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {filteredDoctors.length === 0 ? (
              <Card className="text-center py-8">
                <p className="text-text-secondary">No doctors found matching your search.</p>
              </Card>
            ) : (
              filteredDoctors.map((doc) => (
                <DoctorCard
                  key={doc._id}
                  doctor={doc}
                  onChat={() => { setSelectedDoc(doc); setShowChat(true) }}
                  onVideoCall={() => { setSelectedDoc(doc); setShowVideo(true) }}
                  onBook={() => { setSelectedDoc(doc); setShowBooking(true) }}
                />
              ))
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <h3 className="font-display font-semibold text-text-primary mb-3 flex items-center gap-2">
                <Calendar size={16} className="text-primary" /> Appointments
              </h3>
              {appointments.length === 0 ? (
                <p className="text-sm text-text-secondary">No appointments</p>
              ) : (
                <div className="space-y-2">
                  {appointments.map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-3 rounded-xl bg-border/20">
                      <div>
                        <p className="text-sm font-medium text-text-primary">{apt.doctorName}</p>
                        <p className="text-xs text-text-secondary">{formatDate(apt.date)}</p>
                      </div>
                      <Badge variant={apt.status === 'scheduled' ? 'info' : 'success'} size="sm">
                        {apt.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card>
              <h3 className="font-display font-semibold text-text-primary mb-3">Prescriptions</h3>
              {prescriptions.length === 0 ? (
                <p className="text-sm text-text-secondary">No prescriptions yet</p>
              ) : (
                <div className="space-y-2">
                  {prescriptions.map((pr) => (
                    <div key={pr.id} className="p-3 rounded-xl bg-border/20">
                      <p className="text-sm font-medium text-text-primary">{pr.doctorName}</p>
                      <p className="text-xs text-text-secondary">{pr.date}</p>
                      <p className="text-sm text-text-primary mt-1">{pr.medicine}</p>
                      <p className="text-xs text-text-secondary mt-0.5">{pr.notes}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      <Modal isOpen={showChat} onClose={() => setShowChat(false)} title={`Chat with ${selectedDoc?.name || 'Doctor'}`} size="lg">
        <div className="flex flex-col h-[400px]">
          <div className="flex-1 overflow-y-auto space-y-3 mb-4">
            {chatMessages.filter((m) => m.role !== 'system').map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : ''}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-br-sm' : 'bg-border/20 text-text-primary rounded-bl-sm'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
              placeholder="Type a message..."
              aria-label="Chat message input"
              className="flex-1 p-3 rounded-xl border border-border bg-bg-card text-text-primary text-sm focus:outline-none focus:border-primary"
            />
            <Button variant="primary" size="md" onClick={sendChatMessage}>
              <Send size={18} />
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showVideo} onClose={() => setShowVideo(false)} title={`Video Call - ${selectedDoc?.name || ''}`} size="xl">
        <div className="aspect-video bg-bg-dark rounded-xl flex items-center justify-center relative">
          <div className="text-center text-white">
            <Video size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm opacity-70">Video call interface placeholder</p>
            <p className="text-xs opacity-50 mt-1">Connected to {selectedDoc?.name}</p>
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
            <Button variant="danger" size="sm">
              <Phone size={16} className="rotate-135" /> End Call
            </Button>
            <Button variant="secondary" size="sm">
              <Mic size={16} /> Mute
            </Button>
          </div>
          <div className="absolute top-4 right-4 w-32 aspect-video bg-bg-dark rounded-lg flex items-center justify-center">
            <span className="text-xs text-white/50">You</span>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showBooking} onClose={() => { setShowBooking(false); setSelectedDayIndex(null); setSelectedTime(null); }} title={`Book Appointment with ${selectedDoc?.name || ''}`}>
        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-1.5">
              <Calendar size={14} className="text-primary" /> Select Date
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2 mb-1 scrollbar-hide snap-x">
              {nextSevenDays.map((day, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDayIndex(idx)}
                  className={`flex flex-col items-center justify-center min-w-[3.5rem] py-2.5 rounded-xl border transition-all snap-start ${
                    selectedDayIndex === idx
                      ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-[1.02]'
                      : 'bg-bg-card border-border text-text-secondary hover:border-primary/50'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">{day.dayName}</span>
                  <span className="text-lg font-bold mt-0.5">{day.dayNumber}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-1.5">
              <Clock size={14} className="text-primary" /> Select Time Slot
            </p>
            <div className="grid grid-cols-3 gap-2">
              {['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'].map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    selectedTime === time
                      ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-[1.02]'
                      : 'bg-bg-card border-border text-text-secondary hover:border-primary/50'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <Button
            fullWidth
            onClick={confirmBooking}
            disabled={selectedDayIndex === null || !selectedTime}
            className="mt-2"
          >
            Confirm Booking
          </Button>
        </div>
      </Modal>
    </PageTransition>
  )
}
