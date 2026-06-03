import { useTranslation } from 'react-i18next'
import { Stethoscope, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SymptomChatUI } from '../components/features/SymptomChat'
import { PageTransition } from '../components/layout/PageTransition'
import { Button } from '../components/ui/Button'

export default function SymptomChecker() {
  const { t } = useTranslation()

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 px-4 pt-4 pb-2 border-b border-border bg-bg-base/80 backdrop-blur-sm sticky top-16 z-10">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Stethoscope size={18} className="text-primary" />
            </div>
            <h1 className="font-display text-lg font-bold text-text-primary">{t('symptomChecker.title')}</h1>
          </div>
        </div>
        <SymptomChatUI />
      </div>
    </PageTransition>
  )
}
