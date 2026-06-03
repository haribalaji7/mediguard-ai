import { Router } from 'express'
import { getWorkerPatients, getAnalytics, bulkEntry } from '../controllers/workerController'
import { authenticate, authorize } from '../middleware/auth'

const router = Router()

router.get('/patients', authenticate, authorize('worker', 'admin'), getWorkerPatients)
router.get('/analytics', authenticate, authorize('worker', 'admin'), getAnalytics)
router.post('/bulk-entry', authenticate, authorize('worker', 'admin'), bulkEntry)

export default router
