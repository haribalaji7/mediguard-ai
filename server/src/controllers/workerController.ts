import { Request, Response, NextFunction } from 'express'
import User from '../models/User'
import Screening from '../models/Screening'

function calculateRisk(answers: Record<string, string | number>): { riskScore: number; riskLevel: 'low' | 'medium' | 'high' | 'emergency' } {
  const yesCount = Object.values(answers).filter((v) => v === 'Yes' || v === 'yes').length
  const total = Object.keys(answers).length || 1
  const riskScore = Math.round((yesCount / total) * 100)
  let riskLevel: 'low' | 'medium' | 'high' | 'emergency' = 'low'
  if (riskScore > 70) riskLevel = 'emergency'
  else if (riskScore > 50) riskLevel = 'high'
  else if (riskScore > 30) riskLevel = 'medium'
  return { riskScore, riskLevel }
}

export async function getWorkerPatients(req: Request, res: Response, next: NextFunction) {
  try {
    const { search, village } = req.query
    const filter: Record<string, unknown> = { role: 'patient' }

    if (village) filter.village = String(village)
    if (search) filter.name = { $regex: String(search), $options: 'i' }

    const patients = await User.find(filter).select('-password -refreshToken').limit(100)
    res.json({ success: true, data: patients })
  } catch (error) {
    next(error)
  }
}

export async function getAnalytics(req: Request, res: Response, next: NextFunction) {
  try {
    const totalPatients = await User.countDocuments({ role: 'patient' })
    const totalScreenings = await Screening.countDocuments()
    const thisMonth = new Date()
    thisMonth.setDate(1)
    const screeningsThisMonth = await Screening.countDocuments({ createdAt: { $gte: thisMonth } })

    const screenings = await Screening.find()
    const diseaseCounts: Record<string, number> = { diabetes: 0, hypertension: 0, tb: 0, anemia: 0, maternal: 0 }
    for (const s of screenings) {
      diseaseCounts[s.type] = (diseaseCounts[s.type] || 0) + 1
    }

    const diseaseDistribution = Object.entries(diseaseCounts).map(([name, value]) => ({ name, value }))
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    const monthlyAgg = await Screening.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $limit: 6 },
    ])
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const monthlyScreenings = monthlyAgg.map((m) => {
      const [, monthStr] = m._id.split('-')
      return { month: monthNames[parseInt(monthStr) - 1] || m._id, count: m.count }
    })

    res.json({
      success: true,
      data: { totalPatients, totalScreenings, screeningsThisMonth, diseaseDistribution, monthlyScreenings },
    })
  } catch (error) {
    next(error)
  }
}

export async function bulkEntry(req: Request, res: Response, next: NextFunction) {
  try {
    const { screenings } = req.body
    if (!Array.isArray(screenings) || screenings.length === 0) {
      return res.status(400).json({ success: false, error: 'No screening data provided' })
    }

    const created = []
    for (const entry of screenings) {
      const patient = await User.findOne({ name: entry.patientName, role: 'patient' })
      const { riskScore, riskLevel } = calculateRisk(entry.answers || {})
      const screening = await Screening.create({
        patientId: patient ? patient._id.toString() : entry.patientName,
        type: entry.type || 'diabetes',
        answers: entry.answers || {},
        riskScore,
        riskLevel,
        resultData: { bulkEntry: true, patientName: entry.patientName },
      })
      created.push(screening)
    }

    res.status(201).json({ success: true, data: { count: created.length } })
  } catch (error) {
    next(error)
  }
}
