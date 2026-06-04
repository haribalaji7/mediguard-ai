import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Shield, Activity, Video, BookOpen, Star, Quote, ChevronRight, Heart, Sparkles, Globe, BrainCircuit } from 'lucide-react'
import { ParticleMesh } from '../components/features/ParticleMesh'
import { StatsCounter } from '../components/features/StatsCounter'
import { Button } from '../components/ui/Button'
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher'
import { useRef } from 'react'

const features = [
  { icon: BrainCircuit, titleKey: 'landing.features.aiChecker', descKey: 'landing.features.aiChecker.desc', color: 'from-primary to-accent' },
  { icon: Shield, titleKey: 'landing.features.screening', descKey: 'landing.features.screening.desc', color: 'from-accent-gold to-warning' },
  { icon: Video, titleKey: 'landing.features.telemedicine', descKey: 'landing.features.telemedicine.desc', color: 'from-accent to-primary-dark' },
  { icon: BookOpen, titleKey: 'landing.features.education', descKey: 'landing.features.education.desc', color: 'from-success to-primary' },
]

const testimonials = [
  { name: 'Rajesh Kumar', village: 'Ramnagar, UP', text: 'MediGuard AI helped me identify early signs of diabetes. I changed my diet and lifestyle. Now my blood sugar is under control without medication.', rating: 5, bg: 'bg-primary/5' },
  { name: 'Meena Patel', village: 'Bhimavaram, AP', text: 'I was feeling weak all the time. The AI symptom checker suggested I might be anemic. I visited the PHC and got treatment. Now I feel much better.', rating: 5, bg: 'bg-accent/5' },
  { name: 'Sunita Verma', village: 'Sitapur, UP', text: 'During my pregnancy, I used the maternal health check module. It gave me helpful tips and reminded me about vaccinations. My baby is healthy!', rating: 5, bg: 'bg-accent-gold/5' },
]

export default function Landing() {
  const { t } = useTranslation()
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, 150])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div className="overflow-hidden bg-bg-base" ref={containerRef}>
      {/* PRO MAX HERO SECTION */}
      <section className="relative min-h-[100vh] flex items-center justify-center pt-20 pb-32 perspective-1000">
        <ParticleMesh />
        
        {/* Massive Ambient Glows */}
        <div className="absolute top-[-20%] right-[-10%] w-[1200px] h-[1200px] bg-primary/10 rounded-full blur-[150px] animate-pulse-slow pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-accent/10 rounded-full blur-[150px] animate-blob pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-gold/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay pointer-events-none" />
        
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full flex flex-col items-center text-center mt-10"
        >
          {/* Ultra Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, type: "spring", bounce: 0.5 }}
            className="mb-8 relative group cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent-gold to-primary rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-700 animate-gradient-x" />
            <div className="relative flex items-center gap-3 px-6 py-2.5 rounded-full bg-bg-card/40 backdrop-blur-2xl border border-white/20 shadow-[0_0_30px_rgba(0,200,150,0.3)] text-primary text-sm font-bold tracking-wide uppercase">
              <Sparkles size={16} className="text-accent-gold animate-pulse" />
              <span>Next-Gen Healthcare AI</span>
              <div className="w-2 h-2 rounded-full bg-primary animate-ping ml-2" />
            </div>
          </motion.div>

          {/* Epic Typography */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] font-black text-text-primary leading-[1.05] tracking-tighter mb-8 max-w-5xl drop-shadow-2xl"
          >
            Healthcare <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-gradient-x">
              Reimagined.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl sm:text-2xl text-text-secondary max-w-3xl mb-12 leading-relaxed font-medium"
          >
            Experience the future of rural medicine. Free, proactive AI health screening available in 12+ dialects. Bridging the gap between symptoms and survival.
          </motion.p>

          {/* Hyper CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-6"
          >
            <Link to="/register">
              <Button size="lg" className="relative overflow-hidden px-10 py-5 h-auto text-xl rounded-[2rem] bg-gradient-to-r from-primary to-primary-dark border-0 shadow-[0_20px_50px_rgba(0,200,150,0.4)] hover:shadow-[0_30px_60px_rgba(0,200,150,0.6)] hover:-translate-y-2 transition-all duration-500 group">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                <div className="absolute inset-0 w-[200%] bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <span className="relative flex items-center gap-3 font-black tracking-wide text-white">
                  {t('cta.startScreening')} 
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-2 transition-transform">
                    <ArrowRight size={18} />
                  </div>
                </span>
              </Button>
            </Link>
            <Link to="/login" className="group">
              <div className="px-8 py-5 text-lg font-bold text-text-secondary hover:text-primary transition-colors flex items-center gap-2">
                Already registered? <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>
        </motion.div>

        {/* 3D Floating Dashboard Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 150, rotateX: 40, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, rotateX: 10, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.8, type: "spring", stiffness: 50, damping: 20 }}
          style={{ transformStyle: 'preserve-3d' }}
          className="absolute -bottom-32 md:-bottom-64 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl z-20 pointer-events-none hidden md:block"
        >
          <div className="w-full aspect-[16/9] rounded-[3rem] bg-bg-card/40 backdrop-blur-3xl border border-white/20 shadow-[0_40px_100px_rgba(0,0,0,0.3)] overflow-hidden relative flex items-center justify-center">
             <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent/10" />
             
             {/* Holographic UI Elements */}
             <div className="absolute top-10 left-10 w-64 h-48 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md p-6 transform -rotate-6 animate-float">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-4"><Heart className="text-primary" /></div>
                <div className="h-4 w-32 bg-white/10 rounded-full mb-2" />
                <div className="h-4 w-24 bg-white/10 rounded-full" />
             </div>
             
             <div className="absolute bottom-10 right-10 w-80 h-64 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md p-6 transform rotate-3 animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex justify-between items-end h-full w-full gap-2 opacity-50">
                  <div className="w-full bg-primary/40 h-[40%] rounded-t-lg" />
                  <div className="w-full bg-accent/40 h-[70%] rounded-t-lg" />
                  <div className="w-full bg-warning/40 h-[50%] rounded-t-lg" />
                  <div className="w-full bg-success/40 h-[90%] rounded-t-lg" />
                </div>
             </div>

             <div className="relative w-48 h-48 rounded-full bg-gradient-to-tr from-primary to-accent-gold p-[2px] shadow-[0_0_80px_rgba(0,200,150,0.5)] animate-pulse-slow">
                <div className="absolute inset-0 rounded-full bg-bg-card flex items-center justify-center backdrop-blur-xl">
                  <Globe className="text-primary w-20 h-20 animate-[spin_20s_linear_infinite]" />
                </div>
             </div>
          </div>
        </motion.div>
      </section>

      {/* Spacer for 3D Hero Overlap */}
      <div className="h-20 md:h-64" />

      {/* ULTRA STATS */}
      <section className="py-20 px-4 sm:px-6 relative z-30">
        <div className="max-w-7xl mx-auto">
          <StatsCounter />
        </div>
      </section>

      {/* GLASSMORPHIC FEATURES GRID */}
      <section className="py-32 px-4 sm:px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-bg-base via-bg-card/30 to-bg-base pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-text-primary mb-6">
              A Complete <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Ecosystem</span>
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto font-medium">
              Everything required to monitor, diagnose, and treat rural populations, wrapped in a frictionless AI-powered platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.1, type: "spring" }}
                  className="group relative p-[1px] rounded-[2.5rem] bg-gradient-to-br from-white/20 to-white/5 overflow-hidden hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  <div className="h-full w-full bg-bg-card/80 backdrop-blur-2xl rounded-[2.5rem] p-10 flex flex-col items-start">
                    <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${feature.color} p-[1px] mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                      <div className="w-full h-full bg-bg-card rounded-3xl flex items-center justify-center">
                        <Icon size={36} className="text-primary" />
                      </div>
                    </div>
                    <h3 className="font-display text-3xl font-bold text-text-primary mb-4 group-hover:text-primary transition-colors">
                      {t(feature.titleKey)}
                    </h3>
                    <p className="text-lg text-text-secondary leading-relaxed font-medium">
                      {t(feature.descKey)}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* PREMIUM TESTIMONIALS */}
      <section className="py-32 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-0 right-[-20%] w-[800px] h-[800px] bg-accent-gold/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-text-primary mb-6">
              Lives <span className="text-transparent bg-clip-text bg-gradient-to-r from-warning to-accent-gold">Transformed</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className={`relative p-10 rounded-[2.5rem] ${t.bg} border border-white/10 backdrop-blur-xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-2`}
              >
                <Quote size={40} className="text-primary/20 mb-6" />
                <p className="text-lg text-text-primary font-medium leading-relaxed mb-8">"{t.text}"</p>
                
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl font-black text-white shadow-lg">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-base font-bold text-text-primary">{t.name}</p>
                    <p className="text-sm font-medium text-text-secondary">{t.village}</p>
                  </div>
                </div>
                <div className="absolute top-10 right-10 flex gap-1">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={16} className="text-accent-gold fill-accent-gold drop-shadow-sm" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL MASSIVE CTA */}
      <section className="py-32 px-4 sm:px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, type: "spring" }}
            className="relative rounded-[3rem] bg-gradient-to-br from-primary via-primary-dark to-bg-dark p-12 md:p-20 text-center text-white overflow-hidden shadow-[0_40px_100px_rgba(0,200,150,0.3)]"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/30 rounded-full blur-[80px] -translate-x-1/2 translate-y-1/2" />
            
            <div className="relative z-10">
              <h2 className="font-display text-4xl md:text-6xl font-black mb-8 leading-tight">
                The Future of Health <br/> is in Your Hands.
              </h2>
              <p className="text-xl text-white/80 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                Join thousands of others taking control of their wellbeing. 100% free forever.
              </p>
              <Link to="/register">
                <Button size="lg" className="bg-white text-primary hover:bg-bg-base text-xl font-black px-12 py-6 h-auto rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.3)] hover:scale-105 transition-all duration-300">
                  Join MediGuard Free
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TRUST FOOTER */}
      <section className="py-16 px-4 sm:px-6 border-t border-white/5 bg-bg-card/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-sm font-bold text-text-secondary uppercase tracking-widest mb-10">Trusted & Backed By</p>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            {['Ministry of Health', 'ICMR', 'WHO Rural', 'ASHA Network', 'Digital India'].map((org) => (
              <span key={org} className="text-2xl font-black font-display text-text-primary hover:text-primary transition-colors cursor-default">{org}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
