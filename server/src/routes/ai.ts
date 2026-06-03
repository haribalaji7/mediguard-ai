import { Router } from 'express'
import { symptomAnalysis, riskAssessment } from '../controllers/aiController'
import { authenticate } from '../middleware/auth'

const router = Router()

router.post('/symptom-analysis', authenticate, symptomAnalysis)
router.post('/risk-assessment', authenticate, riskAssessment)

export default router
