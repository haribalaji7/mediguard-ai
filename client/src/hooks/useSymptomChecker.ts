import { useCallback } from 'react'
import { useSymptomStore } from '../store/symptomStore'
import { generateId } from '../lib/utils'
import { mockSymptomAnalysis } from '../lib/mockData'

const botResponses: Record<string, string> = {
  'body-area': 'Thank you. What type of symptom are you experiencing?',
  'symptom-type': 'How long have you been experiencing this?',
  'duration': 'On a scale of 1 to 10, how severe is it? (1 = mild, 10 = worst possible)',
}

export function useSymptomChecker() {
  const store = useSymptomStore()

  const addUserMessage = useCallback((content: string) => {
    store.addMessage({ id: generateId(), role: 'user', content, timestamp: Date.now() })
  }, [store])

  const advanceStep = useCallback(() => {
    const steps = ['body-area', 'symptom-type', 'duration', 'severity'] as const
    const currentIdx = steps.indexOf(store.step as typeof steps[number])
    if (currentIdx < steps.length - 1) {
      const nextStep = steps[currentIdx + 1]
      setTimeout(() => {
        store.addMessage({ id: generateId(), role: 'bot', content: botResponses[nextStep], timestamp: Date.now() })
        store.setStep(nextStep)
      }, 500)
    }
  }, [store])

  const analyze = useCallback(async () => {
    store.setStep('analyzing')
    store.setIsAnalyzing(true)
    store.addMessage({ id: generateId(), role: 'bot', content: 'Analyzing your symptoms with AI... Please wait a moment.', timestamp: Date.now() })

    await new Promise((r) => setTimeout(r, 2000))

    store.setAnalysis(mockSymptomAnalysis)
    store.setIsAnalyzing(false)

    store.addMessage({ id: generateId(), role: 'system', content: JSON.stringify(mockSymptomAnalysis), timestamp: Date.now() })
  }, [store])

  const reset = useCallback(() => {
    store.reset()
  }, [store])

  return { ...store, addUserMessage, advanceStep, analyze, reset }
}
