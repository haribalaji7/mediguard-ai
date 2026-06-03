import { Router } from 'express'
import { submitScreening, getScreeningsByPatient, getScreeningResult } from '../controllers/screeningController'
import { authenticate } from '../middleware/auth'

const router = Router()

router.post('/submit', authenticate, submitScreening)
router.get('/:patientId', authenticate, getScreeningsByPatient)
router.get('/:id/result', authenticate, getScreeningResult)

export default router
