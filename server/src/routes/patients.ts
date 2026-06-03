import { Router } from 'express'
import { getPatient, updatePatient, getPatientRecords, addVitals } from '../controllers/patientController'
import { authenticate } from '../middleware/auth'

const router = Router()

router.get('/:id', authenticate, getPatient)
router.put('/:id', authenticate, updatePatient)
router.get('/:id/records', authenticate, getPatientRecords)
router.post('/:id/vitals', authenticate, addVitals)

export default router
