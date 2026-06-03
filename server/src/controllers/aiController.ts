import { Request, Response, NextFunction } from 'express'
import { analyzeSymptoms, assessRisk } from '../services/gemini.service'

export async function symptomAnalysis(req: Request, res: Response, next: NextFunction) {
  try {
    const { symptoms } = req.body
    const result = await analyzeSymptoms(symptoms)
    res.json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}

export async function riskAssessment(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await assessRisk(req.body)
    res.json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}
