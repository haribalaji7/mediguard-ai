import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Stethoscope, Activity, FileText, Bell, MapPin, ChevronRight, ArrowRight, Heart, Navigation, Info, Plus, Zap } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useHealthStore } from '../store/healthStore'
import { useUiStore } from '../store/uiStore'
import { HealthScoreRing } from '../components/ui/HealthScoreRing'
import { VitalChart } from '../components/features/VitalChart'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { Input } from '../components/ui/Input'
import { formatDate, getScreeningLabel } from '../lib/utils'
import { mockCamps, mockHospitals, healthTips } from '../lib/mockData'
import { PageTransition } from '../components/layout/PageTransition'

interface NearbyItem {
  id: string
  title: string
  type: 'camp' | 'hospital'
  location: string
  distance?: number
  date?: string
  subType?: string
  lat: number
  lng: number
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export default function Dashboard() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const { screenings, healthScore, vitals, addVital } = useHealthStore()
  const { addToast } = useUiStore()

  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null)
  const [locStatus, setLocStatus] = useState<'idle' | 'locating' | 'success' | 'error'>('idle')
  const [locationName, setLocationName] = useState<string>('')
  
  const [showVitalModal, setShowVitalModal] = useState(false)
  const [activeVitalTab, setActiveVitalTab] = useState<'bpSystolic' | 'glucose' | 'weight' | 'heartRate'>('bpSystolic')
  const [vitalForm, setVitalForm] = useState({ bpSystolic: '', bpDiastolic: '', glucose: '', weight: '', heartRate: '' })
  
  const [heightCm, setHeightCm] = useState('')
  const [calculatedBmi, setCalculatedBmi] = useState<number | null>(null)
  const [tapTimes, setTapTimes] = useState<number[]>([])
  const [showPulseTapper, setShowPulseTapper] = useState(false)
  const [calculatedBpm, setCalculatedBpm] = useState<number | null>(null)

  const handlePulseTap = () => {
    const now = Date.now()
    const newTimes = [...tapTimes, now].slice(-5)
    setTapTimes(newTimes)
    if (newTimes.length >= 2) {
      const intervals = []
      for (let i = 1; i < newTimes.length; i++) { intervals.push(newTimes[i] - newTimes[i - 1]) }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
      const bpm = Math.round(60000 / avgInterval)
      if (bpm >= 40 && bpm <= 200) { setCalculatedBpm(bpm); setVitalForm(p => ({ ...p, heartRate: bpm.toString() })) }
    }
  }

  const resetPulseTapper = () => { setTapTimes([]); setCalculatedBpm(null) }

  useEffect(() => {
    if (vitalForm.weight && heightCm) {
      const w = parseFloat(vitalForm.weight)
      const h = parseFloat(heightCm) / 100
      if (w > 0 && h > 0) setCalculatedBmi(parseFloat((w / (h * h)).toFixed(1)))
      else setCalculatedBmi(null)
    } else setCalculatedBmi(null)
  }, [vitalForm.weight, heightCm])

  const requestLocation = () => {
    setLocStatus('locating')
    if (!navigator.geolocation) {
      setUserCoords({ latitude: 27.6000, longitude: 80.8000 })
      setLocationName('Ramnagar (Default)')
      setLocStatus('success')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => { setUserCoords({ latitude: position.coords.latitude, longitude: position.coords.longitude }); setLocationName('Current Location'); setLocStatus('success') },
      () => { setUserCoords({ latitude: 27.6000, longitude: 80.8000 }); setLocationName('Ramnagar (Default)'); setLocStatus('success') },
      { enableHighAccuracy: true, timeout: 5000 }
    )
  }

  const handleSaveVitals = () => {
    if (!vitalForm.bpSystolic && !vitalForm.glucose && !vitalForm.weight && !vitalForm.heartRate) { addToast('Please enter at least one vital metric.', 'error'); return }
    addVital({
      _id: `vit-${Date.now()}`, patientId: user?._id || 'user-001',
      bpSystolic: vitalForm.bpSystolic ? parseInt(vitalForm.bpSystolic, 10) : undefined,
      bpDiastolic: vitalForm.bpDiastolic ? parseInt(vitalForm.bpDiastolic, 10) : undefined,
      glucose: vitalForm.glucose ? parseInt(vitalForm.glucose, 10) : undefined,
      weight: vitalForm.weight ? parseFloat(vitalForm.weight) : undefined,
      heartRate: vitalForm.heartRate ? parseInt(vitalForm.heartRate, 10) : undefined,
      date: new Date().toISOString()
    })
    addToast('Vitals recorded successfully.', 'success')
    setShowVitalModal(false); setVitalForm({ bpSystolic: '', bpDiastolic: '', glucose: '', weight: '', heartRate: '' })
  }

  useEffect(() => { requestLocation() }, [])

  const nearbyItems = useMemo(() => {
    const items: NearbyItem[] = [
      ...mockCamps.map(camp => ({ id: camp._id, title: camp.title, type: 'camp' as const, location: camp.location, date: camp.date, lat: camp.lat || 27.6050, lng: camp.lng || 80.8050 })),
      ...mockHospitals.map(hosp => ({ id: hosp._id, title: hosp.name, type: 'hospital' as const, location: hosp.location, subType: hosp.type, lat: hosp.lat, lng: hosp.lng }))
    ]
    if (userCoords) return items.map(item => ({ ...item, distance: calculateDistance(userCoords.latitude, userCoords.longitude, item.lat, item.lng) })).sort((a, b) => (a.distance || 0) - (b.distance || 0))
    return items
  }, [userCoords])

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-32 md:pb-12">
        
        {/* HERO DASHBOARD HEADER */}
        <div className="relative mb-10 p-8 sm:p-10 rounded-[2.5rem] bg-gradient-to-br from-bg-card/90 to-bg-card/40 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3 pointer-events-none animate-pulse-slow" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px] -translate-x-1/4 translate-y-1/3 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-tr from-primary to-accent p-[2px] shadow-[0_0_40px_rgba(0,200,150,0.3)] hover:scale-105 transition-transform duration-500">
                <div className="w-full h-full bg-bg-card rounded-[1.4rem] flex items-center justify-center text-3xl font-black text-text-primary">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              </div>
              <div>
                <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="font-display text-3xl md:text-5xl font-black text-text-primary mb-1">
                  Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent animate-gradient-x">{user?.name?.split(' ')[0] || 'User'}</span>
                </motion.h1>
                <p className="text-text-secondary text-base md:text-lg font-medium flex items-center gap-2">
                  <Zap size={16} className="text-accent-gold" /> AI Assistant is monitoring your vitals
                </p>
              </div>
            </div>
            
            <Link to="/symptom-checker" className="shrink-0">
              <Button size="lg" className="w-full md:w-auto px-8 py-4 text-lg rounded-2xl bg-primary hover:bg-primary-dark shadow-[0_0_30px_rgba(0,200,150,0.4)] hover:shadow-[0_0_50px_rgba(0,200,150,0.6)] transition-all duration-300 group">
                <Stethoscope size={22} className="group-hover:scale-110 transition-transform" />
                <span className="font-black tracking-wide">Start Screening</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* TOP LEVEL METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-10">
          
          <Card className="md:col-span-4 relative overflow-hidden bg-bg-card/60 backdrop-blur-3xl border border-white/20 p-8 flex flex-col items-center justify-center text-center shadow-card hover:shadow-card-hover transition-shadow duration-500 group">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", bounce: 0.5 }} className="relative z-10">
              <div className="absolute inset-0 bg-primary/20 blur-[40px] rounded-full group-hover:bg-primary/40 transition-colors duration-500" />
              <HealthScoreRing score={healthScore} size={180} />
            </motion.div>
            <p className="mt-6 font-display text-xl font-bold text-text-primary">Overall Health Score</p>
            <p className="text-sm text-text-secondary mt-1">Based on recent vitals & screenings</p>
          </Card>

          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Activity, label: t('dashboard.screeningsDone'), value: screenings.length.toString(), color: 'from-primary to-primary-dark', glow: 'shadow-[0_0_30px_rgba(0,200,150,0.2)]' },
              { icon: Bell, label: t('dashboard.pending'), value: '2', color: 'from-warning to-accent-gold', glow: 'shadow-[0_0_30px_rgba(250,160,20,0.2)]' },
              { icon: FileText, label: t('dashboard.upcoming'), value: '1', color: 'from-accent to-danger', glow: 'shadow-[0_0_30px_rgba(255,90,90,0.2)]' },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className={`h-full flex flex-col justify-center p-8 bg-bg-card/60 backdrop-blur-2xl border border-white/10 ${stat.glow} hover:-translate-y-1 transition-all duration-300 relative overflow-hidden`}>
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-bl-full`} />
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} p-[1px] mb-4`}>
                    <div className="w-full h-full bg-bg-card rounded-2xl flex items-center justify-center">
                      <stat.icon size={24} className="text-text-primary" />
                    </div>
                  </div>
                  <p className="text-4xl font-black font-display text-text-primary mb-1">{stat.value}</p>
                  <p className="text-sm font-semibold text-text-secondary">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* VITALS CHART TRACKER */}
        <Card className="mb-10 p-6 md:p-8 bg-bg-card/60 backdrop-blur-3xl border border-white/20 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="font-display text-2xl font-black text-text-primary flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg"><Activity className="text-primary" size={24} /></div>
                Vitals History
              </h2>
            </div>
            <Button size="lg" onClick={() => setShowVitalModal(true)} className="rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.1)]">
              <Plus size={18} className="mr-2" /> Log Vitals
            </Button>
          </div>

          <div className="flex flex-wrap gap-3 pb-2 mb-6">
            {[
              { id: 'bpSystolic', label: 'Blood Pressure', unit: 'mmHg' },
              { id: 'glucose', label: 'Blood Sugar', unit: 'mg/dL' },
              { id: 'weight', label: 'Weight', unit: 'kg' },
              { id: 'heartRate', label: 'Heart Rate', unit: 'bpm' },
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => setActiveVitalTab(v.id as any)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeVitalTab === v.id
                    ? 'bg-primary text-white shadow-[0_5px_15px_rgba(0,200,150,0.4)]'
                    : 'bg-bg-base/80 text-text-secondary hover:bg-bg-base hover:text-text-primary border border-white/10'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>

          <div className="p-6 bg-bg-base/40 rounded-[2rem] border border-white/10 shadow-inner">
            <VitalChart
              vitals={vitals}
              dataKey={activeVitalTab}
              label={activeVitalTab === 'bpSystolic' ? 'Systolic BP' : activeVitalTab === 'glucose' ? 'Blood Sugar' : activeVitalTab === 'weight' ? 'Weight' : 'Heart Rate'}
              unit={activeVitalTab === 'bpSystolic' ? ' mmHg' : activeVitalTab === 'glucose' ? ' mg/dL' : activeVitalTab === 'weight' ? ' kg' : ' bpm'}
              color={activeVitalTab === 'bpSystolic' ? '#EF4444' : activeVitalTab === 'glucose' ? '#F59E0B' : activeVitalTab === 'weight' ? '#10B981' : '#3B82F6'}
            />
          </div>
        </Card>

        {/* BOTTOM GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-black text-text-primary">Recent Screenings</h2>
              <Link to="/records" className="px-4 py-2 rounded-lg bg-bg-card border border-white/10 text-sm font-bold hover:bg-bg-base transition-colors flex items-center gap-1">
                View All <ChevronRight size={16} />
              </Link>
            </div>
            <div className="space-y-4">
              {screenings.slice(0, 3).map((s) => (
                <motion.div
                  key={s._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl bg-bg-card/80 backdrop-blur-md border border-white/10 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Heart size={24} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-text-primary text-base md:text-lg truncate">{getScreeningLabel(s.type)}</p>
                    <p className="text-sm text-text-secondary">{formatDate(s.createdAt)}</p>
                  </div>
                  <Badge variant={s.riskLevel as 'low' | 'medium' | 'high' | 'emergency'} className="self-start sm:self-center px-3 py-1.5 text-xs font-black shadow-sm">
                    {s.riskLevel.toUpperCase()}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
               <h2 className="font-display text-2xl font-black text-text-primary">Nearby</h2>
            </div>
            <div className="bg-bg-card/60 backdrop-blur-xl border border-white/20 rounded-[2rem] p-6 shadow-card">
              <div className="flex items-center justify-between gap-3 mb-6 p-4 rounded-xl bg-bg-base/80 border border-white/10">
                <div className="flex items-center gap-2 text-sm">
                  <Navigation size={16} className={locStatus === 'locating' ? 'animate-spin text-primary' : 'text-primary'} />
                  <span className="font-semibold truncate max-w-[150px]">{locationName || 'Detecting...'}</span>
                </div>
                <button onClick={requestLocation} className="px-3 py-1.5 bg-white/5 rounded-lg text-xs font-bold hover:bg-white/10 transition-colors">
                  Refresh
                </button>
              </div>

              {locStatus === 'locating' ? (
                 <div className="space-y-4">
                   {[1, 2].map((i) => (
                     <div key={i} className="animate-pulse bg-white/5 rounded-2xl p-5 h-24" />
                   ))}
                 </div>
              ) : nearbyItems.length === 0 ? (
                 <div className="text-center py-10">
                   <Info size={40} className="text-text-secondary/30 mx-auto mb-3" />
                   <p className="text-text-secondary font-medium">No nearby facilities found.</p>
                 </div>
              ) : (
                <div className="space-y-4">
                  {nearbyItems.slice(0, 3).map((item) => (
                    <div key={item.id} className="p-4 rounded-2xl bg-bg-base/50 hover:bg-bg-base border border-white/5 hover:border-primary/20 transition-all group">
                       <div className="flex items-start gap-3">
                         <div className={`p-2 rounded-lg shrink-0 ${item.type === 'camp' ? 'bg-primary/20' : 'bg-accent/20'}`}>
                           <MapPin size={20} className={item.type === 'camp' ? 'text-primary' : 'text-accent'} />
                         </div>
                         <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-2 flex-wrap mb-1">
                             <span className="font-bold text-sm text-text-primary truncate">{item.title}</span>
                             <span className={`px-2 py-0.5 text-[9px] font-black rounded uppercase tracking-wider ${item.type === 'camp' ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'}`}>
                               {item.type}
                             </span>
                           </div>
                           <p className="text-xs text-text-secondary truncate mb-2">{item.location}</p>
                           <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-2">
                              {item.distance !== undefined && (
                                <span className="text-[10px] font-bold text-text-primary bg-bg-card px-2 py-1 rounded-md border border-white/5">
                                  {item.distance < 1 ? `${Math.round(item.distance * 1000)}m away` : `${item.distance.toFixed(1)} km`}
                                </span>
                              )}
                              <a href={`https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}`} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                                Navigate <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                              </a>
                           </div>
                         </div>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal: Log Vitals (Minimal Changes inside) */}
        <Modal isOpen={showVitalModal} onClose={() => setShowVitalModal(false)} title="Log Health Vitals" size="md">
           <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="BP Systolic (mmHg)" type="number" value={vitalForm.bpSystolic} onChange={(e) => setVitalForm(p => ({ ...p, bpSystolic: e.target.value }))} placeholder="120" />
              <Input label="BP Diastolic (mmHg)" type="number" value={vitalForm.bpDiastolic} onChange={(e) => setVitalForm(p => ({ ...p, bpDiastolic: e.target.value }))} placeholder="80" />
            </div>
            <Input label="Blood Glucose (mg/dL)" type="number" value={vitalForm.glucose} onChange={(e) => setVitalForm(p => ({ ...p, glucose: e.target.value }))} placeholder="100" />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Weight (kg)" type="number" step="0.1" value={vitalForm.weight} onChange={(e) => setVitalForm(p => ({ ...p, weight: e.target.value }))} placeholder="65" />
              <Input label="Height (cm) - Optional" type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} placeholder="170" />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Input label="Heart Rate (bpm)" type="number" value={vitalForm.heartRate} onChange={(e) => setVitalForm(p => ({ ...p, heartRate: e.target.value }))} placeholder="72" />
                </div>
                <Button type="button" variant="secondary" className="mb-1 text-xs shrink-0" onClick={() => { setShowPulseTapper(!showPulseTapper); resetPulseTapper() }}>
                  {showPulseTapper ? 'Hide Estimator' : 'Pulse Estimator'}
                </Button>
              </div>
            </div>
            <Button fullWidth onClick={handleSaveVitals} className="mt-4 py-4 rounded-xl text-lg font-black">Save Vitals</Button>
          </div>
        </Modal>
      </div>
    </PageTransition>
  )
}
