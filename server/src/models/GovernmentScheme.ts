import mongoose, { Schema, Document } from 'mongoose'

export interface IGovernmentScheme extends Document {
  name: string
  description: string
  eligibility: string
  benefits: string
  applyUrl: string
}

const GovernmentSchemeSchema = new Schema<IGovernmentScheme>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    eligibility: { type: String },
    benefits: { type: String },
    applyUrl: { type: String },
  },
  { timestamps: true },
)

export default mongoose.model<IGovernmentScheme>('GovernmentScheme', GovernmentSchemeSchema)
