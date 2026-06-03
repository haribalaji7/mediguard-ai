import { Request, Response, NextFunction } from 'express'
import Screening from '../models/Screening'

export async function submitScreening(req: Request, res: Response, next: NextFunction) {
  try {
    const { patientId, type, answers } = req.body

    const yesCount = Object.values(answers).filter((v) => v === 'Yes' || v === 'yes').length
    const total = Object.keys(answers).length || 1
    const riskScore = Math.round((yesCount / total) * 100)
    let riskLevel: 'low' | 'medium' | 'high' | 'emergency' = 'low'

    if (riskScore > 70) riskLevel = 'emergency'
    else if (riskScore > 50) riskLevel = 'high'
    else if (riskScore > 30) riskLevel = 'medium'

    const screening = await Screening.create({
      patientId, type, answers, riskScore, riskLevel,
      resultData: { message: `${type} screening completed. Risk level: ${riskLevel}` },
    })

    res.status(201).json({ success: true, data: screening })
  } catch (error) {
    next(error)
  }
}

export async function getScreeningsByPatient(req: Request, res: Response, next: NextFunction) {
  try {
    const screenings = await Screening.find({ patientId: req.params.patientId }).sort({ createdAt: -1 })
    res.json({ success: true, data: screenings })
  } catch (error) {
    next(error)
  }
}

export async function getScreeningResult(req: Request, res: Response, next: NextFunction) {
  try {
    const screening = await Screening.findById(req.params.id)
    if (!screening) return res.status(404).json({ success: false, error: 'Screening not found' })
    res.json({ success: true, data: screening })
  } catch (error) {
    next(error)
  }
}
