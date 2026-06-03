import { Request, Response, NextFunction } from 'express'
import Article from '../models/Article'
import { AuthRequest } from '../middleware/auth'

export async function getArticles(req: Request, res: Response, next: NextFunction) {
  try {
    const { category, language, search } = req.query
    const filter: Record<string, unknown> = {}

    if (category && category !== 'all') filter.category = String(category)
    if (language) filter.language = String(language)
    if (search) filter.title = { $regex: String(search), $options: 'i' }

    const articles = await Article.find(filter).sort({ createdAt: -1 }).limit(50)
    res.json({ success: true, data: articles })
  } catch (error) {
    next(error)
  }
}

export async function getArticle(req: Request, res: Response, next: NextFunction) {
  try {
    const article = await Article.findById(req.params.id)
    if (!article) return res.status(404).json({ success: false, error: 'Article not found' })
    res.json({ success: true, data: article })
  } catch (error) {
    next(error)
  }
}

export async function toggleBookmark(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { articleId } = req.body
    const article = await Article.findById(articleId)
    if (!article) return res.status(404).json({ success: false, error: 'Article not found' })

    if (!req.user) return res.status(401).json({ success: false, error: 'Not authenticated' })

    const userId = req.user.id
    const idx = article.bookmarkedBy.indexOf(userId)
    if (idx > -1) article.bookmarkedBy.splice(idx, 1)
    else article.bookmarkedBy.push(userId)

    await article.save()
    res.json({ success: true, data: { bookmarked: idx === -1 } })
  } catch (error) {
    next(error)
  }
}
