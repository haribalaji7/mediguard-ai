import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Shield, Activity, Video, BookOpen, Star, Quote, ChevronRight } from 'lucide-react'
import { ParticleMesh } from '../components/features/ParticleMesh'
import { StatsCounter } from '../components/features/StatsCounter'
import { Button } from '../components/ui/Button'
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher'

const features = [
  { icon: Activity, titleKey: 'landing.features.aiChecker', descKey: 'landing.features.aiChecker.desc' },
  { icon: Shield, titleKey: 'landing.features.screening', descKey: 'landing.features.screening.desc' },
  { icon: Video, titleKey: 'landing.features.telemedicine', descKey: 'landing.features.telemedicine.desc' },
  { icon: BookOpen, titleKey: 'landing.features.education', descKey: 'landing.features.education.desc' },
]

const testimonials = [
  { name: 'Rajesh Kumar', village: 'Ramnagar, UP', text: 'MediGuard AI helped me identify early signs of diabetes. I changed my diet and lifestyle. Now my blood sugar is under control without medication.', rating: 5 },
  { name: 'Meena Patel', village: 'Bhimavaram, AP', text: 'I was feeling weak all the time. The AI symptom checker suggested I might be anemic. I visited the PHC and got treatment. Now I feel much better.', rating: 5 },
  { name: 'Sunita Verma', village: 'Sitapur, UP', text: 'During my pregnancy, I used the maternal health check module. It gave me helpful tips and reminded me about vaccinations. My baby is healthy!', rating: 5 },
]

export default function Landing() {
  const { t } = useTranslation()

  return (
    <div>
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <ParticleMesh />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-base/50 to-bg-base pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 w-full">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Shield size={14} />
                Trusted by 2.4L+ patients across India
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary leading-tight mb-6 text-balance"
            >
              Your <span className="text-primary">AI Doctor</span> for Rural India
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-text-secondary max-w-xl mb-8 leading-relaxed"
            >
              Free, AI-powered health screening. No travel. No waiting. 
              Available in your language. Bridging the gap between first symptom and first diagnosis.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/register">
                <Button size="lg" className="animate-pulse-glow">
                  {t('cta.startScreening')} <ArrowRight size={20} />
                </Button>
              </Link>
              <Link to="/worker">
                <Button variant="secondary" size="lg">
                  {t('cta.forWorkers')}
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-8 right-4 sm:right-8 z-20">
          <LanguageSwitcher />
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <StatsCounter />
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 bg-bg-card/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-4">
              How MediGuard AI Works
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Three simple steps to better health
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Check Symptoms', desc: 'Tell us your symptoms in your language. Our AI analyzes them instantly.' },
              { step: '02', title: 'Get Your Results', desc: 'Receive possible conditions, urgency level, and clear next steps.' },
              { step: '03', title: 'Take Action', desc: 'Visit your PHC, consult a doctor online, or follow home care tips.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold font-display text-primary">{item.step}</span>
                </div>
                <h3 className="font-display text-xl font-semibold text-text-primary mb-2">{item.title}</h3>
                <p className="text-text-secondary">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Everything You Need
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-bg-card rounded-2xl border border-border shadow-card p-6 hover:shadow-card-hover transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon size={24} className="text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-text-primary mb-2">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {t(feature.descKey)}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 bg-bg-card/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Stories from the Community
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-bg-card rounded-2xl border border-border shadow-card p-6"
              >
                <Quote size={24} className="text-primary/30 mb-3" />
                <p className="text-sm text-text-secondary leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{t.name}</p>
                    <p className="text-xs text-text-secondary">{t.village}</p>
                  </div>
                  <div className="ml-auto flex">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={14} className="text-accent-gold fill-accent-gold" />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-8 md:p-12 text-center text-white"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Start Your Health Journey Today
            </h2>
            <p className="text-white/80 max-w-lg mx-auto mb-8">
              Free, private, and available in your language. No appointment needed.
            </p>
            <Link to="/register">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 border-white">
                {t('cta.startScreening')} <ChevronRight size={20} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 bg-bg-card/50">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-sm text-text-secondary mb-6">Trusted by leading healthcare organizations</p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-50">
            {['ICMR', 'NHM', 'PHC India', 'ASHA', 'ICDS'].map((org) => (
              <span key={org} className="text-lg font-bold font-display text-text-secondary">{org}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
