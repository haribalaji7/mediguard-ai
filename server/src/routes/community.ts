import { Router } from 'express'
import { getCamps, getSchemes, reportOutbreak } from '../controllers/communityController'

const router = Router()

router.get('/camps', getCamps)
router.get('/schemes', getSchemes)
router.post('/report-outbreak', reportOutbreak)

export default router
