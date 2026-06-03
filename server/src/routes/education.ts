import { Router } from 'express'
import { getArticles, getArticle, toggleBookmark } from '../controllers/educationController'
import { authenticate } from '../middleware/auth'

const router = Router()

router.get('/articles', getArticles)
router.get('/articles/:id', getArticle)
router.post('/bookmark', authenticate, toggleBookmark)

export default router
