import { useRef, useEffect, useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { Bot, User, AlertTriangle, Home, Pill, Hospital, Loader2, Mic, FileDown } from 'lucide-react'
import { useSymptomChecker } from '../../hooks/useSymptomChecker'
import { classNames, getUrgencyColor } from '../../lib/utils'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import type { SymptomAnalysis } from '../../types'
import { useHealthStore } from '../../store/healthStore'
import { useUiStore } from '../../store/uiStore'
import { jsPDF } from 'jspdf'

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

  const { addScreening } = useHealthStore()
  const { addToast } = useUiStore()

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const analysis = messages.find((m) => m.role === 'system')
  const parsedAnalysis: SymptomAnalysis | null = analysis ? JSON.parse(analysis.content) : null

  // Local state for actions
  const [hasSaved, setHasSaved] = useState(false)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [isListening, setIsListening] = useState(false)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const voiceRef = useRef<any>(null)
  const descriptionRef = useRef(description)
  descriptionRef.current = description

  const startVoice = useCallback(() => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognitionAPI) {
      addToast('Speech recognition not supported on this browser.', 'error')
      return
    }
    
    setIsListening(true)
    const recognition = new SpeechRecognitionAPI()
    recognition.lang = 'en-IN'
    recognition.interimResults = false
    
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript
      const current = descriptionRef.current
      setDescription(current ? `${current} ${text}` : text)
      addToast('Voice captured successfully.', 'success')
      setIsListening(false)
    }
    
    recognition.onerror = () => {
      setIsListening(false)
    }
    
    recognition.onend = () => {
      setIsListening(false)
    }
    
    recognition.start()
    voiceRef.current = recognition
  }, [setDescription, addToast])

  const handleSaveToRecords = () => {
    if (!parsedAnalysis) return
    
    addScreening({
      _id: `scr-${Date.now()}`,
      patientId: 'user-001',
      type: 'diabetes', // generic classification placeholder
      answers: {},
      riskScore: parsedAnalysis.urgency_level === 'EMERGENCY' || parsedAnalysis.urgency_level === 'HIGH' ? 75 : 20,
      riskLevel: parsedAnalysis.urgency_level === 'EMERGENCY' || parsedAnalysis.urgency_level === 'HIGH' ? 'high' : 'low',
      resultData: { message: parsedAnalysis.recommended_action },
      createdAt: new Date().toISOString()
    })
    
    setHasSaved(true)
    addToast('Symptom analysis report saved to your profile history.', 'success')
  }

  const handleDownloadPdf = () => {
    if (!parsedAnalysis) return
    setIsGeneratingPdf(true)
    
    try {
      const doc = new jsPDF()
      const primaryColor = '#00B894'
      const darkColor = '#2D3748'
      
      // Header Banner
      doc.setFillColor(0, 184, 148)
      doc.rect(0, 0, 210, 32, 'F')
      
      doc.setTextColor(255, 255, 255)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(22)
      doc.text('Aarogyam MediGuard AI', 15, 20)
      
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.text('RURAL RURAL HEALTH SUPPORT AND SCREENING REPORT', 115, 20)
      
      // Patient Summary Card
      doc.setTextColor(darkColor)
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Clinical Assessment Summary', 15, 48)
      
      doc.setDrawColor(220, 220, 220)
      doc.line(15, 52, 195, 52)
      
      // Core Diagnostics Table
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.text('Urgency Level:', 15, 62)
      doc.setFont('helvetica', 'normal')
      doc.text(parsedAnalysis.urgency_level, 55, 62)
      
      doc.setFont('helvetica', 'bold')
      doc.text('Recommended Action:', 15, 70)
      doc.setFont('helvetica', 'normal')
      const actionText = doc.splitTextToSize(parsedAnalysis.recommended_action, 135)
      doc.text(actionText, 55, 70)
      
      let nextY = 70 + (actionText.length * 5) + 6
      
      // Possible Conditions Table
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(13)
      doc.text('Possible Conditions Graphed', 15, nextY)
      nextY += 4
      doc.line(15, nextY, 195, nextY)
      nextY += 8
      
      doc.setFontSize(11)
      parsedAnalysis.possible_conditions.forEach((c) => {
        doc.setFont('helvetica', 'bold')
        doc.text(`${c.name} (${c.likelihood_percent}% Probability)`, 15, nextY)
        nextY += 5
        doc.setFont('helvetica', 'normal')
        const descText = doc.splitTextToSize(c.description, 180)
        doc.text(descText, 15, nextY)
        nextY += (descText.length * 5) + 4
      })
      
      // Home Care Interventions
      if (parsedAnalysis.home_care_tips.length > 0) {
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(13)
        doc.text('Recommended Care Interventions', 15, nextY)
        nextY += 4
        doc.line(15, nextY, 195, nextY)
        nextY += 8
        
        doc.setFontSize(11)
        doc.setFont('helvetica', 'normal')
        parsedAnalysis.home_care_tips.forEach((tip) => {
          doc.text(`- ${tip}`, 15, nextY)
          nextY += 6
        })
        nextY += 4
      }
      
      // Orange Callout Box
      doc.setFillColor(254, 243, 199)
      doc.rect(15, nextY, 180, 22, 'F')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.setTextColor(217, 119, 6)
      doc.text('WARNING / WHEN TO SEEK PROFESSIONAL CARE:', 18, nextY + 7)
      
      doc.setFont('helvetica', 'normal')
      const warningText = doc.splitTextToSize(parsedAnalysis.when_to_seek_help, 174)
      doc.text(warningText, 18, nextY + 14)
      
      doc.save('aarogyam-symptom-report.pdf')
      addToast('Assessment report downloaded successfully as PDF.', 'success')
    } catch (e) {
      console.error(e)
      addToast('Error generating PDF report.', 'error')
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  const handleReset = () => {
    reset()
    setHasSaved(false)
  }

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
                className="flex-1 h-2 rounded-full appearance-none bg-border/40 accent-primary"
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="flex-1 p-3 rounded-xl border border-border bg-bg-card text-text-primary text-sm resize-none h-20 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                aria-label="Describe symptoms"
              />
              {typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) && (
                <button
                  onClick={startVoice}
                  disabled={isListening}
                  className={classNames(
                    "self-end p-3 rounded-xl transition-all",
                    isListening
                      ? "bg-primary text-white animate-pulse"
                      : "bg-primary/10 text-primary hover:bg-primary/20"
                  )}
                  aria-label="Voice input"
                >
                  <Mic size={20} />
                </button>
              )}
            </div>

            {/* Soundwave animation */}
            {isListening && (
              <div className="flex items-center justify-center gap-1.5 py-2">
                <span className="text-xs text-primary font-medium">Listening... Speak now</span>
                <div className="flex gap-0.5 items-end h-4">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [4, 16, 4] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                      className="w-1 bg-primary rounded-full"
                    />
                  ))}
                </div>
              </div>
            )}

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
              <Button 
                variant="primary" 
                onClick={handleSaveToRecords}
                disabled={hasSaved}
              >
                {hasSaved ? 'Saved to Profile!' : 'Save to Records'}
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleDownloadPdf}
                isLoading={isGeneratingPdf}
              >
                <FileDown size={16} /> Download Report PDF
              </Button>
            </div>
            <Button variant="ghost" onClick={handleReset} className="mt-2">
              Start New Check
            </Button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
