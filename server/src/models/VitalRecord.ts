import mongoose, { Schema, Document } from 'mongoose'

export interface IVitalRecord extends Document {
  patientId: string
  weight?: number
  bpSystolic?: number
  bpDiastolic?: number
  glucose?: number
  heartRate?: number
  date: Date
}

const VitalRecordSchema = new Schema<IVitalRecord>(
  {
    patientId: { type: String, required: true, index: true },
    weight: { type: Number },
    bpSystolic: { type: Number },
    bpDiastolic: { type: Number },
    glucose: { type: Number },
    heartRate: { type: Number },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

export default mongoose.model<IVitalRecord>('VitalRecord', VitalRecordSchema)
