import { useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Bot, User, AlertTriangle, Home, Pill, Hospital, Loader2, Mic } from 'lucide-react'
import { useSymptomChecker } from '../../hooks/useSymptomChecker'
import { classNames, getUrgencyColor } from '../../lib/utils'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import type { SymptomAnalysis } from '../../types'

const bodyAreas = ['Head', 'Chest', 'Stomach', 'Limbs', 'Skin', 'Whole Body', 'Back', 'Throat']

const symptomTypes: Record<string, string[]> = {
  Head: ['Headache', 'Dizziness', 'Eye pain', 'Ear pain', 'Facial pain', 'Migraine'],
  Chest: ['Chest pain', 'Cough', 'Difficulty breathing', 'Palpitations', 'Wheezing'],
  Stomach: ['Abdominal pain', 'Nausea', 'Vomiting', 'Diarrhea', 'Constipation', 'Bloating'],
  Limbs: ['Joint pain', 'Muscle pain', 'Swelling', 'Weakness', 'Numbness'],
  Skin: ['Rash', 'Itching', 'Blisters', 'Dryness', 'Color change'],
  'Whole Body': ['Fever', 'Fatigue', 'Weight loss', 'Night sweats', 'Body ache'],
  Back: ['Lower back pain', 'Upper back pain', 'Neck pain'],
  Throat: ['Sore throat', 'Difficulty swallowing', 'Hoarseness', 'Swollen glands'],
}

const durations = ['Few hours', '1 day', '2-3 days', 'About a week', '2 weeks', 'More than a month']

interface AnalysisResultsProps {
  analysis: SymptomAnalysis
}

function AnalysisResults({ analysis }: AnalysisResultsProps) {
  const urgencyColor = getUrgencyColor(analysis.urgency_level)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div
        className="p-4 rounded-xl border-2 flex items-start gap-3"
        style={{ borderColor: urgencyColor, backgroundColor: `${urgencyColor}10` }}
      >
        {analysis.urgency_level === 'EMERGENCY' ? (
          <Hospital size={24} style={{ color: urgencyColor }} className="shrink-0 mt-0.5" />
        ) : analysis.urgency_level === 'HIGH' ? (
          <AlertTriangle size={24} style={{ color: urgencyColor }} className="shrink-0 mt-0.5" />
        ) : (
          <Home size={24} style={{ color: urgencyColor }} className="shrink-0 mt-0.5" />
        )}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={analysis.urgency_level.toLowerCase() as 'low' | 'medium' | 'high' | 'emergency'} pulse={analysis.urgency_level === 'HIGH' || analysis.urgency_level === 'EMERGENCY'}>
              {analysis.urgency_level} URGENCY
            </Badge>
          </div>
          <p className="text-text-primary font-medium">{analysis.recommended_action}</p>
        </div>
      </div>

      <div>
        <h4 className="font-display font-semibold text-text-primary mb-2">Possible Conditions</h4>
        <div className="space-y-2">
          {analysis.possible_conditions.map((condition, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-bg-card border border-border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                {condition.likelihood_percent}%
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary truncate">{condition.name}</p>
                <p className="text-xs text-text-secondary">{condition.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {analysis.home_care_tips.length > 0 && (
        <div>
          <h4 className="font-display font-semibold text-text-primary mb-2 flex items-center gap-2">
            <Pill size={16} className="text-primary" /> Home Care Tips
          </h4>
          <ul className="space-y-1.5">
            {analysis.home_care_tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-sm text-text-secondary bg-warning/5 p-3 rounded-xl border border-warning/20">
        <strong className="text-warning">⚠ When to seek help:</strong> {analysis.when_to_seek_help}
      </p>

      <p className="text-xs text-text-secondary italic">{analysis.disclaimer}</p>
    </motion.div>
  )
}

export function SymptomChatUI() {
  const {
    messages, step, isAnalyzing, bodyArea, symptomType, severity, description,
    setBodyArea, setSymptomType, setDuration, setSeverity,
    setDescription, addUserMessage, advanceStep, analyze, reset,
  } = useSymptomChecker()

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const analysis = messages.find((m) => m.role === 'system')
  const parsedAnalysis: SymptomAnalysis | null = analysis ? JSON.parse(analysis.content) : null

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const voiceRef = useRef<unknown>(null)
  const descriptionRef = useRef(description)
  descriptionRef.current = description

  const startVoice = useCallback(() => {
    const SpeechRecognitionAPI = (window as unknown as Record<string, unknown>).SpeechRecognition || (window as unknown as Record<string, unknown>).webkitSpeechRecognition
    if (!SpeechRecognitionAPI) return
    const recognition = new (SpeechRecognitionAPI as new () => unknown)() as {
      lang: string
      interimResults: boolean
      onresult: (event: { results: [{ transcript: string }[]] }) => void
      start: () => void
    }
    recognition.lang = 'hi-IN'
    recognition.interimResults = false
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript
      const current = descriptionRef.current
      setDescription(current + ' ' + text)
    }
    recognition.start()
    voiceRef.current = recognition
  }, [setDescription])

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-2xl mx-auto">
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.filter((m) => m.role !== 'system').map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={classNames(
              'flex gap-2 max-w-[85%]',
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : '',
            )}
          >
            <div className={classNames(
              'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
              msg.role === 'user' ? 'bg-primary text-white' : 'bg-primary/20 text-primary',
            )}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={classNames(
              'p-3 rounded-2xl text-sm leading-relaxed',
              msg.role === 'user'
                ? 'bg-primary text-white rounded-tr-sm'
                : 'bg-bg-card border border-border rounded-tl-sm text-text-primary',
            )}>
              {msg.content}
            </div>
          </motion.div>
        ))}

        {step === 'body-area' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 mt-2"
          >
            {bodyAreas.map((area) => (
              <button
                key={area}
                onClick={() => {
                  setBodyArea(area)
                  addUserMessage(area)
                  advanceStep()
                }}
                className="px-4 py-2 rounded-full bg-bg-card border border-border text-sm font-medium text-text-primary hover:border-primary hover:bg-primary/5 transition-all"
              >
                {area}
              </button>
            ))}
          </motion.div>
        )}

        {step === 'symptom-type' && bodyArea && symptomTypes[bodyArea] && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 mt-2"
          >
            {symptomTypes[bodyArea].map((type) => (
              <button
                key={type}
                onClick={() => {
                  setSymptomType(type)
                  addUserMessage(type)
                  advanceStep()
                }}
                className="px-4 py-2 rounded-full bg-bg-card border border-border text-sm font-medium text-text-primary hover:border-primary hover:bg-primary/5 transition-all"
              >
                {type}
              </button>
            ))}
          </motion.div>
        )}

        {step === 'duration' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 mt-2"
          >
            {durations.map((dur) => (
              <button
                key={dur}
                onClick={() => {
                  setDuration(dur)
                  addUserMessage(dur)
                  advanceStep()
                }}
                className="px-4 py-2 rounded-full bg-bg-card border border-border text-sm font-medium text-text-primary hover:border-primary hover:bg-primary/5 transition-all"
              >
                {dur}
              </button>
            ))}
          </motion.div>
        )}

        {step === 'severity' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 space-y-4"
          >
            <div className="flex items-center gap-4">
              <span className="text-sm text-text-secondary">Mild (1)</span>
              <input
                type="range"
                min="1"
                max="10"
                value={severity}
                onChange={(e) => setSeverity(Number(e.target.value))}
                className="flex-1 h-2 rounded-full appearance-none bg-gray-200 dark:bg-gray-700 accent-primary"
                aria-label="Severity level"
              />
              <span className="text-sm text-text-secondary">Severe (10)</span>
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold font-display text-primary">{severity}</span>
              <span className="text-text-secondary text-sm"> / 10</span>
            </div>

            <div className="flex gap-3">
              <textarea
                placeholder="Describe your symptoms in your own words..."
                onChange={(e) => setDescription(e.target.value)}
                className="flex-1 p-3 rounded-xl border border-border bg-bg-card text-text-primary text-sm resize-none h-20 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                aria-label="Describe symptoms"
              />
              {typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) && (
                <button
                  onClick={startVoice}
                  className="self-end p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  aria-label="Voice input"
                >
                  <Mic size={20} />
                </button>
              )}
            </div>

            <Button
              fullWidth
              size="lg"
              onClick={analyze}
              isLoading={isAnalyzing}
              className="animate-pulse-glow"
            >
              Analyze Symptoms
            </Button>
          </motion.div>
        )}

        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/20"
          >
            <Loader2 size={20} className="animate-spin text-primary" />
            <span className="text-sm text-text-primary font-medium">AI is analyzing your symptoms...</span>
          </motion.div>
        )}

        {step === 'results' && parsedAnalysis && (
          <div className="mt-4">
            <AnalysisResults analysis={parsedAnalysis} />
            <div className="flex gap-3 mt-4">
              <Button variant="primary" onClick={() => {}}>
                Save to Records
              </Button>
              <Button variant="secondary" onClick={() => {}}>
                Share with Doctor
              </Button>
            </div>
            <Button variant="ghost" onClick={reset} className="mt-2">
              Start New Check
            </Button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
