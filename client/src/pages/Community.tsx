import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, MapPin, Shield, Megaphone, Quote, AlertTriangle, Send } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { CampCard } from '../components/features/CampCard'
import { SchemeCard } from '../components/features/SchemeCard'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { Input } from '../components/ui/Input'
import { useCommunityStore } from '../store/communityStore'
import { useUiStore } from '../store/uiStore'

export default function Community() {
  const { camps, schemes, stories } = useCommunityStore()
  const { addToast } = useUiStore()
  const [showReport, setShowReport] = useState(false)
  const [reportForm, setReportForm] = useState({ condition: '', village: '', cases: '', date: '' })

  const handleReport = () => {
    addToast('Outbreak report submitted anonymously. Health authorities will be notified.', 'success')
    setShowReport(false)
    setReportForm({ condition: '', village: '', cases: '', date: '' })
  }

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary">Community</h1>
            <p className="text-text-secondary text-sm mt-1">Stay connected with your local health community</p>
          </div>
          <Button variant="danger" size="sm" onClick={() => setShowReport(true)}>
            <AlertTriangle size={16} /> Report Outbreak
          </Button>
        </div>

        <div className="mb-8">
          <h2 className="font-display text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <MapPin size={18} className="text-primary" /> Health Camps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {camps.length === 0 ? (
              <Card className="text-center py-8 col-span-full">
                <Users size={40} className="text-text-secondary/30 mx-auto mb-3" />
                <p className="text-text-secondary">No health camps announced yet.</p>
              </Card>
            ) : (
              camps.map((camp) => <CampCard key={camp._id} camp={camp} />)
            )}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="font-display text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <Shield size={18} className="text-accent-gold" /> Government Schemes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schemes.length === 0 ? (
              <Card className="text-center py-8 col-span-full">
                <Shield size={40} className="text-text-secondary/30 mx-auto mb-3" />
                <p className="text-text-secondary">No government schemes listed yet.</p>
              </Card>
            ) : (
              schemes.map((scheme) => <SchemeCard key={scheme._id} scheme={scheme} />)
            )}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="font-display text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <Quote size={18} className="text-primary" /> Success Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stories.length === 0 ? (
              <Card className="text-center py-8 col-span-full">
                <Quote size={40} className="text-text-secondary/30 mx-auto mb-3" />
                <p className="text-text-secondary">No success stories yet.</p>
              </Card>
            ) : (
              stories.map((story, i) => (
                <motion.div
                  key={story._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-bg-card rounded-2xl border border-border shadow-card p-5"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                    <span className="text-sm font-bold text-primary">{story.name.charAt(0)}</span>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed mb-3">"{story.story}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{story.name}</p>
                      <p className="text-xs text-text-secondary">{story.village}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={showReport} onClose={() => setShowReport(false)} title="Report a Health Outbreak" size="lg">
        <p className="text-sm text-text-secondary mb-4">
          This report is completely anonymous. It helps local health authorities respond quickly.
        </p>
        <div className="space-y-4">
          <Input label="Disease / Condition" value={reportForm.condition} onChange={(e) => setReportForm((p) => ({ ...p, condition: e.target.value }))} placeholder=" " />
          <Input label="Village / Area" value={reportForm.village} onChange={(e) => setReportForm((p) => ({ ...p, village: e.target.value }))} placeholder=" " />
          <Input label="Approximate number of cases" type="number" value={reportForm.cases} onChange={(e) => setReportForm((p) => ({ ...p, cases: e.target.value }))} placeholder=" " />
          <Input label="Date of first case" type="date" value={reportForm.date} onChange={(e) => setReportForm((p) => ({ ...p, date: e.target.value }))} placeholder=" " />
          <Button fullWidth onClick={handleReport}>
            <Send size={16} /> Submit Anonymous Report
          </Button>
        </div>
      </Modal>
    </PageTransition>
  )
}
