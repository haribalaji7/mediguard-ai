import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Download, QrCode, Heart, Plus, Weight, Activity, Droplets } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { VitalChart } from '../components/features/VitalChart'
import { useHealthStore } from '../store/healthStore'
import { formatDate, getScreeningLabel, getRiskBgColor } from '../lib/utils'
import { Modal } from '../components/ui/Modal'
import { Input } from '../components/ui/Input'

export default function Records() {
  const { screenings, vitals, addVital } = useHealthStore()
  const [showVitalsModal, setShowVitalsModal] = useState(false)
  const [vitalForm, setVitalForm] = useState({ weight: '', bpSystolic: '', bpDiastolic: '', glucose: '', heartRate: '' })
  const [showQR, setShowQR] = useState(false)

  const handleAddVitals = () => {
    addVital({
      _id: Math.random().toString(36).substring(2),
      patientId: 'user-001',
      weight: vitalForm.weight ? Number(vitalForm.weight) : undefined,
      bpSystolic: vitalForm.bpSystolic ? Number(vitalForm.bpSystolic) : undefined,
      bpDiastolic: vitalForm.bpDiastolic ? Number(vitalForm.bpDiastolic) : undefined,
      glucose: vitalForm.glucose ? Number(vitalForm.glucose) : undefined,
      heartRate: vitalForm.heartRate ? Number(vitalForm.heartRate) : undefined,
      date: new Date().toISOString(),
    })
    setShowVitalsModal(false)
    setVitalForm({ weight: '', bpSystolic: '', bpDiastolic: '', glucose: '', heartRate: '' })
  }

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary">Health Records</h1>
            <p className="text-text-secondary text-sm mt-1">Your complete health history</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowQR(true)}>
              <QrCode size={18} />
            </Button>
            <Button variant="secondary" size="sm">
              <Download size={18} /> PDF
            </Button>
          </div>
        </div>

        {showQR && (
          <Card className="max-w-xs mx-auto text-center mb-6">
            <h3 className="font-semibold text-text-primary mb-3">Your Health Card</h3>
            <div className="w-48 h-48 mx-auto bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
              <QrCode size={120} className="text-text-primary" />
            </div>
            <p className="text-xs text-text-secondary mt-3">Share this QR code with your doctor</p>
            <Button variant="ghost" size="sm" onClick={() => setShowQR(false)} className="mt-2">Close</Button>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-bold text-text-primary flex items-center gap-2">
                <Heart size={18} className="text-primary" /> Screening History
              </h2>
            </div>
            <div className="relative">
              <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-border" />
              <div className="space-y-4">
                {screenings.length === 0 ? (
                  <Card className="text-center py-8">
                    <FileText size={40} className="text-text-secondary/30 mx-auto mb-3" />
                    <p className="text-text-secondary">No screenings yet. Start your first health check!</p>
                    <Button variant="primary" size="sm" className="mt-4">Go to Screening</Button>
                  </Card>
                ) : (
                  screenings.map((s, i) => (
                    <motion.div
                      key={s._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="relative pl-10"
                    >
                      <div className="absolute left-2 top-2 w-1.5 h-1.5 rounded-full bg-primary ring-4 ring-bg-base" />
                      <Card className="py-3 px-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-sm text-text-primary">{getScreeningLabel(s.type)}</p>
                            <p className="text-xs text-text-secondary">{formatDate(s.createdAt)}</p>
                          </div>
                          <Badge variant={s.riskLevel as 'low' | 'medium' | 'high' | 'emergency'} size="sm">
                            {s.riskLevel.toUpperCase()} · {s.riskScore}%
                          </Badge>
                        </div>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-bold text-text-primary">Vitals</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowVitalsModal(true)}>
                <Plus size={16} /> Add
              </Button>
            </div>
            {vitals.length > 0 && (
              <div className="space-y-3 mb-6">
                {vitals.slice(-3).reverse().map((v) => (
                  <Card key={v._id} className="py-3 px-4">
                    <div className="flex items-center gap-4 text-sm">
                      {v.weight && <span className="flex items-center gap-1"><Weight size={14} className="text-primary" /> {v.weight}kg</span>}
                      {v.bpSystolic && <span className="flex items-center gap-1"><Activity size={14} className="text-accent" /> {v.bpSystolic}/{v.bpDiastolic}</span>}
                      {v.glucose && <span className="flex items-center gap-1"><Droplets size={14} className="text-warning" /> {v.glucose}</span>}
                    </div>
                    <p className="text-xs text-text-secondary mt-1">{formatDate(v.date)}</p>
                  </Card>
                ))}
              </div>
            )}
            <Card>
              <h3 className="font-semibold text-sm text-text-primary mb-2">Weight Trend</h3>
              <VitalChart vitals={vitals} dataKey="weight" label="Weight" unit=" kg" />
            </Card>
            <Card className="mt-3">
              <h3 className="font-semibold text-sm text-text-primary mb-2">Blood Pressure</h3>
              <VitalChart vitals={vitals} dataKey="bpSystolic" label="Systolic" unit=" mmHg" color="#FF7675" />
            </Card>
            <Card className="mt-3">
              <h3 className="font-semibold text-sm text-text-primary mb-2">Glucose</h3>
              <VitalChart vitals={vitals} dataKey="glucose" label="Glucose" unit=" mg/dL" color="#F39C12" />
            </Card>
          </div>
        </div>
      </div>

      <Modal isOpen={showVitalsModal} onClose={() => setShowVitalsModal(false)} title="Add Vitals">
        <div className="space-y-4">
          <Input label="Weight (kg)" type="number" value={vitalForm.weight} onChange={(e) => setVitalForm((p) => ({ ...p, weight: e.target.value }))} placeholder=" " />
          <div className="grid grid-cols-2 gap-4">
            <Input label="BP Systolic" type="number" value={vitalForm.bpSystolic} onChange={(e) => setVitalForm((p) => ({ ...p, bpSystolic: e.target.value }))} placeholder=" " />
            <Input label="BP Diastolic" type="number" value={vitalForm.bpDiastolic} onChange={(e) => setVitalForm((p) => ({ ...p, bpDiastolic: e.target.value }))} placeholder=" " />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Glucose (mg/dL)" type="number" value={vitalForm.glucose} onChange={(e) => setVitalForm((p) => ({ ...p, glucose: e.target.value }))} placeholder=" " />
            <Input label="Heart Rate (bpm)" type="number" value={vitalForm.heartRate} onChange={(e) => setVitalForm((p) => ({ ...p, heartRate: e.target.value }))} placeholder=" " />
          </div>
          <Button fullWidth onClick={handleAddVitals}>Save Vitals</Button>
        </div>
      </Modal>
    </PageTransition>
  )
}
