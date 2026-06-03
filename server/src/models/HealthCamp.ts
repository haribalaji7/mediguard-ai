import mongoose, { Schema, Document } from 'mongoose'

export interface IHealthCamp extends Document {
  title: string
  date: Date
  location: string
  services: string[]
  description: string
  organizer: string
  createdAt: Date
}

const HealthCampSchema = new Schema<IHealthCamp>(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    services: [{ type: String }],
    description: { type: String },
    organizer: { type: String },
  },
  { timestamps: true },
)

export default mongoose.model<IHealthCamp>('HealthCamp', HealthCampSchema)
