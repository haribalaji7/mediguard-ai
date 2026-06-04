import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Shield, Activity, Video, BookOpen, Star, Quote, ChevronRight, Heart } from 'lucide-react'
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
      <section className="relative min-h-[95vh] flex items-center overflow-hidden bg-bg-base">
        {/* Dynamic Background Elements */}
        <ParticleMesh />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-blob" />
        <div className="absolute bottom-0 left-[-200px] w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px] mix-blend-multiply opacity-50 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-warning/10 rounded-full blur-[150px] mix-blend-multiply opacity-30 animate-blob animation-delay-4000" />
        
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-base/80 to-bg-base pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <div className="max-w-2xl relative z-20">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative inline-block mb-6 group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary rounded-full blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-500 animate-gradient-x" />
                <span className="relative inline-flex items-center gap-2 px-5 py-2 rounded-full bg-bg-card/80 backdrop-blur-xl border border-white/20 text-primary text-sm font-semibold shadow-[0_0_20px_rgba(0,184,148,0.2)]">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                  </span>
                  Trusted by 2.4L+ patients across India
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] font-extrabold text-text-primary leading-[1.1] tracking-tight mb-8"
              >
                Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-dark to-accent animate-gradient-x">AI Doctor</span><br/>
                <span className="font-light italic text-text-secondary">for Rural India</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-lg sm:text-xl text-text-secondary max-w-xl mb-10 leading-relaxed font-medium"
              >
                Free, proactive AI health screening. No travel. No waiting. 
                Available in 12+ dialects. Bridging the gap between first symptom and first diagnosis.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col sm:flex-row gap-5"
              >
                <Link to="/register">
                  <Button size="lg" className="relative group overflow-hidden px-8 py-4 h-auto text-lg rounded-2xl shadow-[0_0_40px_rgba(0,184,148,0.3)] hover:shadow-[0_0_60px_rgba(0,184,148,0.5)] transition-all">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-white/20 to-primary opacity-0 group-hover:opacity-100 group-hover:animate-shimmer" />
                    <span className="relative flex items-center gap-2 font-bold">
                      {t('cta.startScreening')} <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" size="lg" className="px-8 py-4 h-auto text-lg rounded-2xl border-border bg-bg-card/50 backdrop-blur-md hover:bg-bg-card hover:border-primary/50 transition-all font-semibold">
                    Already have an account?
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Right Interactive Mockup/Visual */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 100 }}
              className="relative hidden lg:block perspective-1000"
            >
              <div className="relative w-full aspect-square rounded-[3rem] bg-gradient-to-tr from-bg-card/40 to-bg-card/80 backdrop-blur-2xl border border-white/20 shadow-2xl p-8 transform rotate-y-minus-10 hover:rotate-y-0 hover:scale-[1.02] transition-all duration-700 ease-out flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
                
                {/* Floating UI Elements inside */}
                <motion.div 
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-12 left-8 bg-bg-card/90 backdrop-blur-md border border-border p-4 rounded-2xl shadow-xl flex items-center gap-4 z-20"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Activity className="text-primary" size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary font-medium">Health Status</p>
                    <p className="text-lg font-bold font-display text-primary">Stable</p>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-16 right-8 bg-bg-card/90 backdrop-blur-md border border-border p-4 rounded-2xl shadow-xl flex items-center gap-4 z-20"
                >
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <Shield className="text-accent" size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary font-medium">AI Screening</p>
                    <p className="text-lg font-bold font-display text-accent">Complete</p>
                  </div>
                </motion.div>

                {/* Central AI Orb */}
                <div className="relative w-48 h-48 rounded-full bg-gradient-to-tr from-primary to-accent p-[2px] shadow-[0_0_60px_rgba(0,184,148,0.4)] animate-pulse-slow">
                  <div className="absolute inset-0 rounded-full bg-bg-card m-[2px] flex items-center justify-center backdrop-blur-sm overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30" />
                    <Heart className="text-primary w-20 h-20 animate-pulse" />
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-8 right-4 sm:right-8 z-30">
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
