import mongoose, { Schema, Document } from 'mongoose'

export interface ISymptomAnalysis extends Document {
  patientId: string
  symptoms: {
    bodyArea: string
    symptomType: string
    duration: string
    severity: number
    description: string
  }
  analysis: Record<string, unknown>
  createdAt: Date
}

const SymptomAnalysisSchema = new Schema<ISymptomAnalysis>(
  {
    patientId: { type: String, required: true, index: true },
    symptoms: {
      bodyArea: String,
      symptomType: String,
      duration: String,
      severity: Number,
      description: String,
    },
    analysis: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
)

export default mongoose.model<ISymptomAnalysis>('SymptomAnalysis', SymptomAnalysisSchema)
