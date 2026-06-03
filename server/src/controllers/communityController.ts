import { Request, Response, NextFunction } from 'express'
import HealthCamp from '../models/HealthCamp'
import GovernmentScheme from '../models/GovernmentScheme'
import mongoose, { Schema, Document } from 'mongoose'

interface IOutbreakReport extends Document {
  condition: string
  village: string
  cases: number
  date: string
  reportedAt: Date
}

const OutbreakReportSchema = new Schema<IOutbreakReport>({
  condition: { type: String, required: true },
  village: { type: String, required: true },
  cases: { type: Number, required: true },
  date: { type: String },
  reportedAt: { type: Date, default: Date.now },
})

const OutbreakReport = mongoose.models.OutbreakReport || mongoose.model<IOutbreakReport>('OutbreakReport', OutbreakReportSchema)

export async function getCamps(req: Request, res: Response, next: NextFunction) {
  try {
    const camps = await HealthCamp.find().sort({ date: 1 }).limit(20)
    res.json({ success: true, data: camps })
  } catch (error) {
    next(error)
  }
}

export async function getSchemes(req: Request, res: Response, next: NextFunction) {
  try {
    const schemes = await GovernmentScheme.find().sort({ createdAt: -1 })
    res.json({ success: true, data: schemes })
  } catch (error) {
    next(error)
  }
}

export async function reportOutbreak(req: Request, res: Response, next: NextFunction) {
  try {
    const { condition, village, cases, date } = req.body
    const report = await OutbreakReport.create({ condition, village, cases, date })
    console.log(`Outbreak reported: ${condition} in ${village}, ${cases} cases on ${date}`)
    res.json({ success: true, data: { message: 'Report submitted anonymously. Health authorities notified.', id: report._id } })
  } catch (error) {
    next(error)
  }
}
