import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Stethoscope, ArrowLeft, Shield, Zap, Clock, Brain, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SymptomChatUI } from '../components/features/SymptomChat'
import { PageTransition } from '../components/layout/PageTransition'
import { Button } from '../components/ui/Button'

const quickTips = [
  { icon: Brain, text: 'AI analyzes 1000+ symptom patterns' },
  { icon: Shield, text: '100% private & secure' },
  { icon: Clock, text: 'Results in under 30 seconds' },
  { icon: Zap, text: 'Supports voice input in Hindi & English' },
]

export default function SymptomChecker() {
  const { t } = useTranslation()
  const [showTips, setShowTips] = useState(true)

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto">
        {/* Premium sticky header */}
        <div className="flex items-center gap-3 px-4 pt-4 pb-2 border-b border-border bg-bg-base/80 backdrop-blur-sm sticky top-16 z-10">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/20">
              <Stethoscope size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-text-primary">{t('symptomChecker.title')}</h1>
              <p className="text-[10px] text-text-secondary -mt-0.5">Powered by Gemini AI</p>
            </div>
          </div>
          <button
            onClick={() => setShowTips(!showTips)}
            className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full hover:bg-primary/20 transition-colors flex items-center gap-1"
          >
            <Sparkles size={12} /> Tips
          </button>
        </div>

        {/* Collapsible quick tips banner */}
        {showTips && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 pt-3 pb-1"
          >
            <div className="bg-gradient-to-r from-primary/5 via-accent-gold/5 to-bg-card border border-border/60 rounded-2xl p-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {quickTips.map((tip, i) => {
                  const Icon = tip.icon
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-center gap-2 bg-bg-card/80 rounded-xl px-3 py-2 border border-border/40"
                    >
                      <Icon size={14} className="text-primary shrink-0" />
                      <span className="text-[10px] text-text-secondary font-medium leading-tight">{tip.text}</span>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}

        <SymptomChatUI />
      </div>
    </PageTransition>
  )
}
