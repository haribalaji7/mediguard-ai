import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Stethoscope, Activity, FileText, Bell, MapPin, ChevronRight, ArrowRight, Heart } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useHealthStore } from '../store/healthStore'
import { HealthScoreRing } from '../components/ui/HealthScoreRing'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { formatDate, getScreeningLabel, getRiskBgColor } from '../lib/utils'
import { mockCamps, healthTips } from '../lib/mockData'
import { PageTransition } from '../components/layout/PageTransition'

export default function Dashboard() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const { screenings, healthScore } = useHealthStore()

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
            <h2 className="font-display text-xl font-bold text-text-primary mb-4">{t('dashboard.nearbyCamps')}</h2>
            {mockCamps.slice(0, 2).map((camp) => (
              <Card key={camp._id} className="mb-3">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-sm text-text-primary">{camp.title}</p>
                    <p className="text-xs text-text-secondary mt-0.5">{camp.location}</p>
                    <p className="text-xs text-text-secondary">{formatDate(camp.date)}</p>
                  </div>
                </div>
              </Card>
            ))}
            <Link to="/community">
              <Button variant="ghost" size="sm" fullWidth>
                View all camps <ArrowRight size={14} />
              </Button>
            </Link>
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
