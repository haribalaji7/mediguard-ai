import mongoose, { Schema, Document } from 'mongoose'

export interface IScreening extends Document {
  patientId: string
  type: 'diabetes' | 'hypertension' | 'tb' | 'anemia' | 'maternal'
  answers: Map<string, string | number>
  riskScore: number
  riskLevel: 'low' | 'medium' | 'high' | 'emergency'
  resultData: Record<string, unknown>
  createdAt: Date
}

const ScreeningSchema = new Schema<IScreening>(
  {
    patientId: { type: String, required: true, index: true },
    type: { type: String, enum: ['diabetes', 'hypertension', 'tb', 'anemia', 'maternal'], required: true },
    answers: { type: Map, of: Schema.Types.Mixed },
    riskScore: { type: Number, required: true },
    riskLevel: { type: String, enum: ['low', 'medium', 'high', 'emergency'], required: true },
    resultData: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
)

export default mongoose.model<IScreening>('Screening', ScreeningSchema)
