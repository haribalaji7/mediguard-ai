import { Request, Response, NextFunction } from 'express'
import User from '../models/User'
import Screening from '../models/Screening'
import VitalRecord from '../models/VitalRecord'
import { AppError } from '../middleware/errorHandler'

export async function getPatient(req: Request, res: Response, next: NextFunction) {
  try {
    const patient = await User.findById(req.params.id).select('-password -refreshToken')
    if (!patient) throw new AppError('Patient not found', 404)
    res.json({ success: true, data: patient })
  } catch (error) {
    next(error)
  }
}

export async function updatePatient(req: Request, res: Response, next: NextFunction) {
  try {
    const allowed = ['name', 'age', 'gender', 'village', 'district', 'state']
    const updates: Record<string, unknown> = {}
    for (const field of allowed) {
      if (req.body[field] !== undefined) updates[field] = req.body[field]
    }
    const patient = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password -refreshToken')
    if (!patient) throw new AppError('Patient not found', 404)
    res.json({ success: true, data: patient })
  } catch (error) {
    next(error)
  }
}

export async function getPatientRecords(req: Request, res: Response, next: NextFunction) {
  try {
    const screenings = await Screening.find({ patientId: req.params.id }).sort({ createdAt: -1 }).lean()
    const vitals = await VitalRecord.find({ patientId: req.params.id }).sort({ date: -1 }).lean()

    const withType = [
      ...screenings.map((s) => ({ ...s, documentType: 'screening' as const, recordedAt: s.createdAt })),
      ...vitals.map((v) => ({ ...v, documentType: 'vital' as const, recordedAt: (v as Record<string, unknown>).createdAt || v.date })),
    ]
    withType.sort((a, b) => new Date(String(b.recordedAt)).getTime() - new Date(String(a.recordedAt)).getTime())

    res.json({ success: true, data: withType })
  } catch (error) {
    next(error)
  }
}

export async function addVitals(req: Request, res: Response, next: NextFunction) {
  try {
    const vital = await VitalRecord.create({ patientId: req.params.id, ...req.body })
    res.status(201).json({ success: true, data: vital })
  } catch (error) {
    next(error)
  }
}
