import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Clock, CheckCircle2, AlertTriangle, Navigation, Users, Calendar, ChevronRight, Filter, Plus } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { Input } from '../components/ui/Input'
import { useUiStore } from '../store/uiStore'

const fieldVisits = [
  { id: 'v1', village: 'Ramnagar', type: 'Door-to-Door Screening', date: '2026-06-04', time: '09:00 AM', status: 'in-progress' as const, households: 24, completed: 16, priority: 'high' as const },
  { id: 'v2', village: 'Bhimavaram', type: 'Vaccination Drive', date: '2026-06-04', time: '02:00 PM', status: 'upcoming' as const, households: 40, completed: 0, priority: 'medium' as const },
  { id: 'v3', village: 'Sitapur', type: 'Maternal Health Check', date: '2026-06-05', time: '10:00 AM', status: 'upcoming' as const, households: 15, completed: 0, priority: 'high' as const },
  { id: 'v4', village: 'Lakshmipur', type: 'TB Follow-up', date: '2026-06-03', time: '11:00 AM', status: 'completed' as const, households: 8, completed: 8, priority: 'low' as const },
  { id: 'v5', village: 'Gopalpur', type: 'Emergency Response', date: '2026-06-04', time: '04:00 PM', status: 'upcoming' as const, households: 12, completed: 0, priority: 'emergency' as const },
]

const recentActivities = [
  { action: 'Completed screening', patient: 'Sita Devi', village: 'Ramnagar', time: '15 min ago' },
  { action: 'Flagged high-risk', patient: 'Ram Prasad', village: 'Ramnagar', time: '32 min ago' },
  { action: 'Administered vaccine', patient: 'Geeta Sharma', village: 'Ramnagar', time: '1 hr ago' },
  { action: 'Submitted report', patient: 'Mohan Lal', village: 'Ramnagar', time: '1.5 hrs ago' },
]

export default function WorkerFieldOps() {
  const { addToast } = useUiStore()
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'upcoming' | 'completed'>('all')
  const [showNewVisit, setShowNewVisit] = useState(false)

  const filtered = fieldVisits.filter(v => filter === 'all' || v.status === filter)

  const stats = [
    { label: 'Today\'s Visits', value: '3', sub: '2 remaining', color: 'from-primary to-accent' },
    { label: 'Households Covered', value: '16', sub: 'of 76 target', color: 'from-accent to-primary' },
    { label: 'Patients Screened', value: '42', sub: '+8 today', color: 'from-warning to-accent-gold' },
    { label: 'Alerts Raised', value: '2', sub: 'high priority', color: 'from-danger to-warning' },
  ]

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-6">

        {/* Hero Header */}
        <div className="relative mb-8 p-6 sm:p-8 rounded-[2rem] bg-gradient-to-br from-bg-card/80 to-bg-card/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,184,148,0.1)] overflow-hidden">
          <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-accent/15 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none animate-pulse-slow" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-accent to-primary p-[2px] shadow-glow">
                <div className="w-full h-full bg-bg-card/90 rounded-2xl flex items-center justify-center">
                  <Navigation size={28} className="text-accent" />
                </div>
              </div>
              <div>
                <h1 className="font-display text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
                  Field Operations
                </h1>
                <p className="text-text-secondary font-medium mt-0.5">Manage village visits, screenings & outreach missions</p>
              </div>
            </div>
            <Button size="lg" className="shadow-glow" onClick={() => setShowNewVisit(true)}>
              <Plus size={18} /> Schedule Visit
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="relative overflow-hidden border-white/10 bg-bg-card/60 backdrop-blur-md">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`} />
                <p className="text-3xl font-extrabold font-display text-text-primary mt-1">{stat.value}</p>
                <p className="text-sm font-semibold text-text-primary mt-1">{stat.label}</p>
                <p className="text-xs text-text-secondary">{stat.sub}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filter Tabs + Visit Cards */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2 overflow-x-auto">
            {(['all', 'in-progress', 'upcoming', 'completed'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                  filter === f ? 'bg-primary text-white shadow-glow' : 'bg-bg-card border border-border text-text-secondary hover:border-primary/50'
                }`}
              >
                {f === 'all' ? 'All Visits' : f === 'in-progress' ? '🔄 In Progress' : f === 'upcoming' ? '📅 Upcoming' : '✅ Completed'}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {filtered.map((visit, i) => (
            <motion.div
              key={visit.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, type: 'spring', stiffness: 300, damping: 24 }}
            >
              <Card className="relative overflow-hidden bg-bg-card/60 backdrop-blur-md border-white/10 hover:shadow-card-hover transition-all group">
                <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                  visit.status === 'completed' ? 'bg-success' : visit.status === 'in-progress' ? 'bg-primary' : visit.priority === 'emergency' ? 'bg-danger animate-pulse' : 'bg-warning'
                }`} />
                <div className="pl-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-display text-lg font-bold text-text-primary">{visit.type}</h3>
                      <Badge variant={visit.priority === 'emergency' ? 'emergency' : visit.priority === 'high' ? 'high' : visit.priority === 'medium' ? 'medium' : 'low'} pulse={visit.priority === 'emergency'}>
                        {visit.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                      <span className="flex items-center gap-1.5"><MapPin size={14} className="text-primary" /> {visit.village}</span>
                      <span className="flex items-center gap-1.5"><Calendar size={14} /> {visit.date}</span>
                      <span className="flex items-center gap-1.5"><Clock size={14} /> {visit.time}</span>
                      <span className="flex items-center gap-1.5"><Users size={14} /> {visit.households} households</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {visit.status !== 'completed' && (
                      <div className="text-right">
                        <div className="w-32 bg-border/40 rounded-full h-2.5 mb-1">
                          <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all" style={{ width: `${(visit.completed / visit.households) * 100}%` }} />
                        </div>
                        <p className="text-xs text-text-secondary">{visit.completed}/{visit.households} done</p>
                      </div>
                    )}
                    {visit.status === 'completed' ? (
                      <div className="flex items-center gap-1.5 text-success font-semibold text-sm">
                        <CheckCircle2 size={18} /> Complete
                      </div>
                    ) : (
                      <Button
                        variant={visit.status === 'in-progress' ? 'primary' : 'secondary'}
                        size="sm"
                        className="opacity-70 group-hover:opacity-100 transition-opacity"
                        onClick={() => addToast(`Navigating to ${visit.village}...`, 'info')}
                      >
                        {visit.status === 'in-progress' ? 'Continue' : 'Start'} <ChevronRight size={16} />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity Feed */}
        <Card className="bg-bg-card/60 backdrop-blur-md border-white/10">
          <h3 className="font-display text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <Clock size={18} className="text-primary" /> Recent Activity
          </h3>
          <div className="space-y-3">
            {recentActivities.map((act, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-4 p-3 rounded-xl bg-bg-base/50 border border-border/30"
              >
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary font-medium truncate">
                    {act.action} — <span className="text-primary">{act.patient}</span>
                  </p>
                  <p className="text-xs text-text-secondary">{act.village}</p>
                </div>
                <span className="text-xs text-text-secondary whitespace-nowrap">{act.time}</span>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* New Visit Modal */}
        <Modal isOpen={showNewVisit} onClose={() => setShowNewVisit(false)} title="Schedule New Field Visit" size="lg">
          <div className="space-y-4">
            <Input label="Village Name" placeholder=" " />
            <Input label="Visit Type (e.g. Screening, Vaccination)" placeholder=" " />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Date" type="date" placeholder=" " />
              <Input label="Time" type="time" placeholder=" " />
            </div>
            <Input label="Target Households" type="number" placeholder=" " />
            <Input label="Notes (optional)" placeholder=" " />
            <Button fullWidth onClick={() => { setShowNewVisit(false); addToast('Visit scheduled successfully!', 'success') }}>
              Schedule Visit
            </Button>
          </div>
        </Modal>
      </div>
    </PageTransition>
  )
}
