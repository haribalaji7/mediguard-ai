import { create } from 'zustand'
import type { ChatMessage, SymptomAnalysis } from '../types'

interface SymptomStore {
  messages: ChatMessage[]
  isAnalyzing: boolean
  step: 'idle' | 'body-area' | 'symptom-type' | 'duration' | 'severity' | 'analyzing' | 'results'
  bodyArea: string
  symptomType: string
  duration: string
  severity: number
  description: string
  analysis: SymptomAnalysis | null
  addMessage: (msg: ChatMessage) => void
  setStep: (step: SymptomStore['step']) => void
  setBodyArea: (area: string) => void
  setSymptomType: (type: string) => void
  setDuration: (duration: string) => void
  setSeverity: (severity: number) => void
  setDescription: (desc: string) => void
  setAnalysis: (analysis: SymptomAnalysis) => void
  setIsAnalyzing: (v: boolean) => void
  reset: () => void
}

const initialState = {
  messages: [{
    id: 'init-msg',
    role: 'bot' as const,
    content: 'Namaste! I am MediGuard AI\'s AI health assistant. I\'m here to help you understand your symptoms. Where does it hurt?',
    timestamp: Date.now(),
  }],
  isAnalyzing: false,
  step: 'body-area' as const,
  bodyArea: '',
  symptomType: '',
  duration: '',
  severity: 5,
  description: '',
  analysis: null,
}

export const useSymptomStore = create<SymptomStore>((set) => ({
  ...initialState,
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  setStep: (step) => set({ step }),
  setBodyArea: (area) => set({ bodyArea: area }),
  setSymptomType: (type) => set({ symptomType: type }),
  setDuration: (duration) => set({ duration }),
  setSeverity: (severity) => set({ severity }),
  setDescription: (desc) => set({ description: desc }),
  setAnalysis: (analysis) => set({ analysis, step: 'results' }),
  setIsAnalyzing: (v) => set({ isAnalyzing: v }),
  reset: () => set(initialState),
}))
