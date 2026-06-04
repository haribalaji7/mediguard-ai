import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Stethoscope, Activity, FileText, Bell, MapPin, ChevronRight, ArrowRight, Heart, Navigation, Info, Plus } from 'lucide-react'
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
import { formatDate, getScreeningLabel, getRiskBgColor } from '../lib/utils'
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
  const R = 6371 // Radius of earth in km
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
  
  // Vitals tracker states
  const [showVitalModal, setShowVitalModal] = useState(false)
  const [activeVitalTab, setActiveVitalTab] = useState<'bpSystolic' | 'glucose' | 'weight' | 'heartRate'>('bpSystolic')
  const [vitalForm, setVitalForm] = useState({
    bpSystolic: '',
    bpDiastolic: '',
    glucose: '',
    weight: '',
    heartRate: ''
  })
  
  // Dynamic calculators
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
      for (let i = 1; i < newTimes.length; i++) {
        intervals.push(newTimes[i] - newTimes[i - 1])
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
      const bpm = Math.round(60000 / avgInterval)
      if (bpm >= 40 && bpm <= 200) {
        setCalculatedBpm(bpm)
        setVitalForm((p) => ({ ...p, heartRate: bpm.toString() }))
      }
    }
  }

  const resetPulseTapper = () => {
    setTapTimes([])
    setCalculatedBpm(null)
  }

  useEffect(() => {
    if (vitalForm.weight && heightCm) {
      const w = parseFloat(vitalForm.weight)
      const h = parseFloat(heightCm) / 100
      if (w > 0 && h > 0) {
        setCalculatedBmi(parseFloat((w / (h * h)).toFixed(1)))
      } else {
        setCalculatedBmi(null)
      }
    } else {
      setCalculatedBmi(null)
    }
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
      (position) => {
        setUserCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
        setLocationName('Current Location')
        setLocStatus('success')
      },
      () => {
        // Fallback to default village coordinates if permission denied / timeout
        setUserCoords({ latitude: 27.6000, longitude: 80.8000 })
        setLocationName('Ramnagar (Default)')
        setLocStatus('success')
      },
      { enableHighAccuracy: true, timeout: 5000 }
    )
  }

  const handleSaveVitals = () => {
    if (!vitalForm.bpSystolic && !vitalForm.glucose && !vitalForm.weight && !vitalForm.heartRate) {
      addToast('Please enter at least one vital metric.', 'error')
      return
    }
    addVital({
      _id: `vit-${Date.now()}`,
      patientId: user?._id || 'user-001',
      bpSystolic: vitalForm.bpSystolic ? parseInt(vitalForm.bpSystolic, 10) : undefined,
      bpDiastolic: vitalForm.bpDiastolic ? parseInt(vitalForm.bpDiastolic, 10) : undefined,
      glucose: vitalForm.glucose ? parseInt(vitalForm.glucose, 10) : undefined,
      weight: vitalForm.weight ? parseFloat(vitalForm.weight) : undefined,
      heartRate: vitalForm.heartRate ? parseInt(vitalForm.heartRate, 10) : undefined,
      date: new Date().toISOString()
    })
    addToast('Vitals recorded successfully.', 'success')
    setShowVitalModal(false)
    setVitalForm({ bpSystolic: '', bpDiastolic: '', glucose: '', weight: '', heartRate: '' })
  }

  useEffect(() => {
    requestLocation()
  }, [])

  const nearbyItems = useMemo(() => {
    const items: NearbyItem[] = [
      ...mockCamps.map(camp => ({
        id: camp._id,
        title: camp.title,
        type: 'camp' as const,
        location: camp.location,
        date: camp.date,
        lat: camp.lat || 27.6050,
        lng: camp.lng || 80.8050
      })),
      ...mockHospitals.map(hosp => ({
        id: hosp._id,
        title: hosp.name,
        type: 'hospital' as const,
        location: hosp.location,
        subType: hosp.type,
        lat: hosp.lat,
        lng: hosp.lng
      }))
    ]

    if (userCoords) {
      return items
        .map(item => ({
          ...item,
          distance: calculateDistance(userCoords.latitude, userCoords.longitude, item.lat, item.lng)
        }))
        .sort((a, b) => (a.distance || 0) - (b.distance || 0))
    }

    return items
  }, [userCoords])

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary">
              {t('dashboard.greeting', { name: user?.name || 'User' })}
            </h1>
            <p className="text-text-secondary text-sm mt-1">Let's take care of your health today</p>
          </div>
          <Link to="/symptom-checker">
            <Button size="lg" className="animate-pulse-glow">
              <Stethoscope size={20} />
              {t('cta.checkSymptoms')}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="flex flex-col items-center justify-center text-center md:col-span-1">
            <HealthScoreRing score={healthScore} size={140} />
            <p className="mt-3 font-semibold text-text-primary">{t('dashboard.healthScore')}</p>
          </Card>

          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { icon: Activity, label: t('dashboard.screeningsDone'), value: screenings.length.toString(), color: 'text-primary bg-primary/10' },
              { icon: Bell, label: t('dashboard.pending'), value: '2', color: 'text-warning bg-warning/10' },
              { icon: FileText, label: t('dashboard.upcoming'), value: '1', color: 'text-accent bg-accent/10' },
            ].map((stat, i) => (
              <Card key={i} className="text-center">
                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mx-auto mb-2`}>
                  <stat.icon size={20} />
                </div>
                <p className="text-2xl font-bold font-display text-text-primary">{stat.value}</p>
                <p className="text-xs text-text-secondary mt-0.5">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Vitals Chart Tracker */}
        <Card className="mb-8 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-display text-lg font-bold text-text-primary flex items-center gap-2">
                <Activity className="text-primary" /> Vitals History & Trends
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">Track your health parameters over time</p>
            </div>
            <Button size="sm" onClick={() => setShowVitalModal(true)}>
              <Plus size={16} /> Log Vitals
            </Button>
          </div>

          <div className="flex overflow-x-auto gap-1 border-b border-border/40 pb-2 mb-4 scrollbar-none">
            {[
              { id: 'bpSystolic', label: 'Blood Pressure', unit: 'mmHg' },
              { id: 'glucose', label: 'Blood Sugar', unit: 'mg/dL' },
              { id: 'weight', label: 'Weight', unit: 'kg' },
              { id: 'heartRate', label: 'Heart Rate', unit: 'bpm' },
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => setActiveVitalTab(v.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeVitalTab === v.id
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>

          <div className="p-4 bg-bg-base/30 rounded-2xl border border-border/40">
            <VitalChart
              vitals={vitals}
              dataKey={activeVitalTab}
              label={
                activeVitalTab === 'bpSystolic'
                  ? 'Systolic BP'
                  : activeVitalTab === 'glucose'
                  ? 'Blood Sugar'
                  : activeVitalTab === 'weight'
                  ? 'Weight'
                  : 'Heart Rate'
              }
              unit={
                activeVitalTab === 'bpSystolic'
                  ? ' mmHg'
                  : activeVitalTab === 'glucose'
                  ? ' mg/dL'
                  : activeVitalTab === 'weight'
                  ? ' kg'
                  : ' bpm'
              }
              color={
                activeVitalTab === 'bpSystolic'
                  ? '#EF4444'
                  : activeVitalTab === 'glucose'
                  ? '#F59E0B'
                  : activeVitalTab === 'weight'
                  ? '#10B981'
                  : '#3B82F6'
              }
            />
          </div>
        </Card>

        {/* Modal: Log Vitals */}
        <Modal isOpen={showVitalModal} onClose={() => setShowVitalModal(false)} title="Log Health Vitals">
          <p className="text-xs text-text-secondary mb-4">
            Enter your health parameters to keep your profile updated. If you don't know your Blood Pressure or Blood Sugar levels, please visit the nearest primary health center or camp listed on your dashboard to get tested.
          </p>
          <div className="space-y-4">
            {/* Blood Pressure Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="BP Systolic (mmHg)"
                type="number"
                value={vitalForm.bpSystolic}
                onChange={(e) => setVitalForm((p) => ({ ...p, bpSystolic: e.target.value }))}
                placeholder="e.g. 120"
              />
              <Input
                label="BP Diastolic (mmHg)"
                type="number"
                value={vitalForm.bpDiastolic}
                onChange={(e) => setVitalForm((p) => ({ ...p, bpDiastolic: e.target.value }))}
                placeholder="e.g. 80"
              />
            </div>

            {/* Glucose Inputs */}
            <Input
              label="Blood Glucose (mg/dL)"
              type="number"
              value={vitalForm.glucose}
              onChange={(e) => setVitalForm((p) => ({ ...p, glucose: e.target.value }))}
              placeholder="e.g. 100"
            />

            {/* Weight, Height, and BMI calculator */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Weight (kg)"
                type="number"
                step="0.1"
                value={vitalForm.weight}
                onChange={(e) => setVitalForm((p) => ({ ...p, weight: e.target.value }))}
                placeholder="e.g. 65"
              />
              <Input
                label="Height (cm) - Optional"
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                placeholder="e.g. 170"
              />
            </div>
            {calculatedBmi !== null && (
              <div className="text-xs text-text-secondary bg-primary/5 p-3 rounded-2xl border border-border/40 flex items-center justify-between">
                <span>Calculated BMI: <strong>{calculatedBmi}</strong></span>
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                  calculatedBmi < 18.5 ? 'bg-blue-500/10 text-blue-600' :
                  calculatedBmi < 25 ? 'bg-emerald-500/10 text-emerald-600' :
                  calculatedBmi < 30 ? 'bg-amber-500/10 text-amber-600' : 'bg-rose-500/10 text-rose-600'
                }`}>
                  {calculatedBmi < 18.5 ? 'Underweight' :
                   calculatedBmi < 25 ? 'Normal weight' :
                   calculatedBmi < 30 ? 'Overweight' : 'Obese'}
                </span>
              </div>
            )}

            {/* Heart Rate and Pulse Estimator Tapper */}
            <div className="grid grid-cols-1 gap-4">
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Input
                    label="Heart Rate (bpm)"
                    type="number"
                    value={vitalForm.heartRate}
                    onChange={(e) => setVitalForm((p) => ({ ...p, heartRate: e.target.value }))}
                    placeholder="e.g. 72"
                  />
                </div>
                <Button 
                  type="button"
                  variant="secondary"
                  className="mb-1 text-xs shrink-0"
                  onClick={() => {
                    setShowPulseTapper(!showPulseTapper)
                    resetPulseTapper()
                  }}
                >
                  {showPulseTapper ? 'Hide Estimator' : 'Pulse Estimator Tapper'}
                </Button>
              </div>

              {showPulseTapper && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 bg-bg-base/30 rounded-2xl border border-border/40 text-center space-y-3"
                >
                  <p className="text-[11px] text-text-secondary px-2 leading-relaxed">
                    Estimate pulse rate dynamically: Place index finger on your neck/wrist pulse, and tap the beating heart button in sync with your pulse beat.
                  </p>
                  
                  <button
                    type="button"
                    onClick={handlePulseTap}
                    className="w-16 h-16 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/20 flex items-center justify-center mx-auto transition-transform active:scale-95 group"
                  >
                    <Heart 
                      size={26} 
                      className={`text-primary ${calculatedBpm ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`}
                      style={calculatedBpm ? { animationDuration: `${60 / calculatedBpm}s` } : undefined}
                    />
                  </button>

                  <div className="text-sm font-bold text-text-primary">
                    {calculatedBpm ? `${calculatedBpm} BPM` : 'Tap to start beats estimation...'}
                  </div>
                  {calculatedBpm && (
                    <p className="text-[10px] text-emerald-600 font-semibold">Pulse recorded in input field!</p>
                  )}
                </motion.div>
              )}
            </div>

            <Button fullWidth onClick={handleSaveVitals} className="mt-4">
              Save Vitals
            </Button>
          </div>
        </Modal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold text-text-primary">{t('dashboard.healthHistory')}</h2>
              <Link to="/records" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                View all <ChevronRight size={14} />
              </Link>
            </div>
            <div className="space-y-3">
              {screenings.slice(0, 3).map((s) => (
                <motion.div
                  key={s._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-bg-card border border-border hover:shadow-card transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Heart size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-text-primary text-sm">{getScreeningLabel(s.type)}</p>
                    <p className="text-xs text-text-secondary">{formatDate(s.createdAt)}</p>
                  </div>
                  <Badge variant={s.riskLevel as 'low' | 'medium' | 'high' | 'emergency'} size="sm">
                    {s.riskLevel.toUpperCase()}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-text-primary mb-4">Nearby Facilities</h2>
            
            <div className="flex items-center justify-between gap-2 mb-4 text-xs bg-bg-card border border-border p-2.5 rounded-2xl">
              <span className="flex items-center gap-1.5 text-text-secondary">
                <Navigation size={12} className={locStatus === 'locating' ? 'animate-spin text-primary shrink-0' : 'text-primary shrink-0'} />
                <span className="truncate">Location: <strong>{locationName || 'Detecting...'}</strong></span>
              </span>
              {locStatus === 'locating' ? (
                <span className="text-primary animate-pulse font-medium shrink-0">Locating...</span>
              ) : (
                <button onClick={requestLocation} className="text-primary hover:underline font-semibold shrink-0">
                  Refresh
                </button>
              )}
            </div>

            {locStatus === 'locating' ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <Card key={i} className="animate-pulse py-6">
                    <div className="h-4 bg-border rounded w-2/3 mb-2"></div>
                    <div className="h-3 bg-border rounded w-1/2"></div>
                  </Card>
                ))}
              </div>
            ) : nearbyItems.length === 0 ? (
              <Card className="text-center py-6">
                <Info size={32} className="text-text-secondary/30 mx-auto mb-2" />
                <p className="text-text-secondary text-sm">No camps or hospitals found nearby.</p>
              </Card>
            ) : (
              nearbyItems.slice(0, 3).map((item) => (
                <Card key={item.id} className="mb-3 hover:border-primary/40 transition-all group">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className={item.type === 'camp' ? 'text-primary mt-0.5 shrink-0' : 'text-accent mt-0.5 shrink-0'} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-sm text-text-primary truncate">{item.title}</span>
                        <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded shrink-0 uppercase tracking-wider ${
                          item.type === 'camp' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'
                        }`}>
                          {item.type}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary mt-0.5 truncate">{item.location}</p>
                      
                      {item.date && (
                        <p className="text-[11px] text-text-secondary mt-0.5">Date: {formatDate(item.date)}</p>
                      )}
                      {item.subType && (
                        <p className="text-[11px] text-text-secondary italic mt-0.5">{item.subType}</p>
                      )}

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                        {item.distance !== undefined && (
                          <span className="text-[11px] font-semibold text-text-primary bg-bg-base/80 border border-border px-2 py-0.5 rounded-lg">
                            {item.distance < 1 
                              ? `${Math.round(item.distance * 1000)}m away`
                              : `${item.distance.toFixed(1)} km away`
                            }
                          </span>
                        )}
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline font-semibold flex items-center gap-0.5"
                        >
                          Directions <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                        </a>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
            
            <div className="flex gap-2 mt-3">
              <Link to="/community" className="flex-1">
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  All Camps <ArrowRight size={12} />
                </Button>
              </Link>
              <Link to="/consult" className="flex-1">
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  Doctors <ArrowRight size={12} />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-text-primary mb-4">{t('dashboard.tips')}</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4 scrollbar-hide">
            {healthTips.map((tip) => (
              <Card key={tip.id} className="min-w-[280px] snap-start shrink-0">
                <p className="font-semibold text-text-primary mb-1">{tip.title}</p>
                <p className="text-sm text-text-secondary">{tip.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
