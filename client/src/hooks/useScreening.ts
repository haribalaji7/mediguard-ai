import { useState, useCallback, useMemo } from 'react'
import { screeningQuestions } from '../lib/mockData'
import type { RiskLevel, ScreeningResult } from '../types'

interface ScreeningHookReturn {
  questions: { id: string; question: string; type: string; options: string[] | null }[]
  currentIndex: number
  answers: Record<string, string | number>
  isComplete: boolean
  result: { riskScore: number; riskLevel: RiskLevel; message: string } | null
  isLoading: boolean
  setAnswer: (id: string, value: string | number) => void
  nextQuestion: () => void
  prevQuestion: () => void
  calculateResult: () => Promise<void>
  reset: () => void
  progress: number
}

export function useScreening(type: string): ScreeningHookReturn {
  const questions = useMemo(() => screeningQuestions[type as keyof typeof screeningQuestions] || [], [type])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | number>>({})
  const [result, setResult] = useState<{ riskScore: number; riskLevel: RiskLevel; message: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const setAnswer = useCallback((id: string, value: string | number) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }, [])

  const nextQuestion = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1)
    }
  }, [currentIndex, questions.length])

  const prevQuestion = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1)
    }
  }, [currentIndex])

  const calculateResult = useCallback(async () => {
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1200))

    const yesCount = Object.values(answers).filter((v) => v === 'Yes' || v === 'yes').length
    const totalQuestions = questions.length
    const riskScore = Math.round((yesCount / totalQuestions) * 100)

    let riskLevel: RiskLevel = 'low'
    let message = 'Low risk detected. Maintain healthy habits.'

    if (riskScore > 70) {
      riskLevel = 'emergency'
      message = 'High risk detected! Please visit the nearest hospital immediately.'
    } else if (riskScore > 50) {
      riskLevel = 'high'
      message = 'Moderate-high risk detected. Please visit your PHC within this week.'
    } else if (riskScore > 30) {
      riskLevel = 'medium'
      message = 'Moderate risk detected. Please consult a doctor at your PHC.'
    } else {
      riskLevel = 'low'
      message = 'Low risk detected. Maintain healthy habits and screen again in 6 months.'
    }

    setResult({ riskScore, riskLevel, message })
    setIsLoading(false)
  }, [answers, questions.length])

  const reset = useCallback(() => {
    setCurrentIndex(0)
    setAnswers({})
    setResult(null)
  }, [])

  const isComplete = currentIndex >= questions.length - 1

  return {
    questions,
    currentIndex,
    answers,
    isComplete,
    result,
    isLoading,
    setAnswer,
    nextQuestion,
    prevQuestion,
    calculateResult,
    reset,
    progress: questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0,
  }
}
