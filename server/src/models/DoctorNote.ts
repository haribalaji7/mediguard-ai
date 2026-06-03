import mongoose, { Schema, Document } from 'mongoose'

export interface IDoctorNote extends Document {
  patientId: string
  doctorId: string
  note: string
  createdAt: Date
}

const DoctorNoteSchema = new Schema<IDoctorNote>(
  {
    patientId: { type: String, required: true, index: true },
    doctorId: { type: String, required: true },
    note: { type: String, required: true },
  },
  { timestamps: true },
)

export default mongoose.model<IDoctorNote>('DoctorNote', DoctorNoteSchema)
