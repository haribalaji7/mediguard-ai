import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageTransition } from '../components/layout/PageTransition'
import { ScreeningCard } from '../components/features/ScreeningCard'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { ProgressBar } from '../components/ui/ProgressBar'
import { Badge } from '../components/ui/Badge'
import { useScreening } from '../hooks/useScreening'
import { classNames, getRiskColor } from '../lib/utils'

const screeningTypes = [
  { type: 'diabetes', title: 'Diabetes Risk Assessment', description: 'FINDRISC questionnaire - 10 questions to assess your risk of type 2 diabetes.', time: '~5 minutes', icon: 'Diabetes' },
  { type: 'hypertension', title: 'Hypertension Check', description: 'Assess your risk of high blood pressure based on lifestyle and symptoms.', time: '~5 minutes', icon: 'Hypertension' },
  { type: 'tb', title: 'TB Screening', description: 'WHO-standard screening for tuberculosis symptoms and risk factors.', time: '~3 minutes', icon: 'TB' },
  { type: 'anemia', title: 'Anemia Detection', description: 'Symptom-based screening to detect potential iron deficiency anemia.', time: '~4 minutes', icon: 'Anemia' },
  { type: 'maternal', title: 'Maternal Health Check', description: 'Essential health check for pregnant women in rural areas.', time: '~5 minutes', icon: 'Maternal' },
]

function ScreeningFormView({ type, onBack }: { type: string; onBack: () => void }) {
  const { questions, currentIndex, answers, progress, isComplete, result, isLoading, setAnswer, nextQuestion, prevQuestion, calculateResult, reset } = useScreening(type)
  const currentQuestion = questions[currentIndex]

  if (result) {
    const riskColor = getRiskColor(result.riskLevel)
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg mx-auto px-4 py-8">
        <Card variant={result.riskLevel === 'high' || result.riskLevel === 'emergency' ? 'danger' : result.riskLevel === 'medium' ? 'warning' : 'primary'} className="text-center">
          {result.riskLevel === 'emergency' ? <AlertTriangle size={48} className="mx-auto mb-4 text-danger" /> : <Check size={48} className="mx-auto mb-4 text-success" />}
          <h2 className="font-display text-2xl font-bold text-text-primary mb-2">Screening Complete</h2>
          <div className="text-5xl font-bold font-display my-4" style={{ color: riskColor }}>{result.riskScore}/100</div>
          <Badge variant={result.riskLevel as 'low' | 'medium' | 'high' | 'emergency'} size="md" className="mb-4">{result.riskLevel.toUpperCase()} RISK</Badge>
          <p className="text-text-secondary mb-6">{result.message}</p>
          <div className="flex gap-3">
            <Button variant="primary" fullWidth onClick={() => {}}>Save to Records</Button>
            <Button variant="secondary" fullWidth onClick={() => { reset(); onBack() }}>New Screening</Button>
          </div>
        </Card>
      </motion.div>
    )
  }

  if (!currentQuestion) return null

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <ProgressBar progress={progress} showLabel label={`Question ${currentIndex + 1} of ${questions.length}`} className="mb-8" />

      <motion.div key={currentIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
        <h2 className="font-display text-xl font-semibold text-text-primary">{currentQuestion.question}</h2>

        {currentQuestion.type === 'number' && (
          <input
            type="number"
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => setAnswer(currentQuestion.id, Number(e.target.value))}
            className="w-full p-4 rounded-xl border border-border bg-bg-card text-text-primary text-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="Enter your answer"
            aria-label={currentQuestion.question}
          />
        )}

        {currentQuestion.type === 'select' && currentQuestion.options && (
          <div className="space-y-2">
            {currentQuestion.options.map((opt) => (
              <button
                key={opt}
                onClick={() => setAnswer(currentQuestion.id, opt)}
                className={classNames(
                  'w-full text-left p-4 rounded-xl border transition-all text-sm',
                  answers[currentQuestion.id] === opt
                    ? 'border-primary bg-primary/5 text-primary font-semibold'
                    : 'border-border bg-bg-card text-text-primary hover:border-primary/50',
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-3 pt-4">
          {currentIndex > 0 && (
            <Button variant="ghost" onClick={prevQuestion}>
              <ArrowLeft size={18} /> Previous
            </Button>
          )}
          {currentIndex < questions.length - 1 ? (
            <Button
              variant="primary"
              onClick={nextQuestion}
              disabled={!answers[currentQuestion.id]}
              className="ml-auto"
            >
              Next <ArrowRight size={18} />
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={calculateResult}
              isLoading={isLoading}
              disabled={!answers[currentQuestion.id]}
              className="ml-auto"
            >
              View Results
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default function Screening() {
  const [activeScreening, setActiveScreening] = useState<string | null>(null)

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-6">
        <AnimatePresence mode="wait">
          {activeScreening ? (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-center gap-3 mb-4">
                <Button variant="ghost" size="sm" onClick={() => setActiveScreening(null)}>
                  <ArrowLeft size={18} />
                </Button>
                <h1 className="font-display text-xl font-bold text-text-primary">
                  {screeningTypes.find((s) => s.type === activeScreening)?.title}
                </h1>
              </div>
              <ScreeningFormView type={activeScreening} onBack={() => setActiveScreening(null)} />
            </motion.div>
          ) : (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="mb-6">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary">Health Screening</h1>
                <p className="text-text-secondary text-sm mt-1">Evidence-based screening for common diseases</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {screeningTypes.map((s) => (
                  <ScreeningCard
                    key={s.type}
                    type={s.type}
                    title={s.title}
                    description={s.description}
                    time={s.time}
                    icon={s.icon}
                    onClick={() => setActiveScreening(s.type)}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}
