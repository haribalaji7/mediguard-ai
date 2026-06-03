import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  name: string
  phone: string
  password: string
  role: 'patient' | 'worker' | 'admin'
  age?: number
  gender?: 'male' | 'female' | 'other'
  village?: string
  district?: string
  state?: string
  workerId?: string
  refreshToken?: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 4 },
    role: { type: String, enum: ['patient', 'worker', 'admin'], default: 'patient' },
    age: { type: Number },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    village: { type: String, trim: true },
    district: { type: String, trim: true },
    state: { type: String, trim: true },
    workerId: { type: String, trim: true },
    refreshToken: { type: String },
  },
  { timestamps: true },
)

export default mongoose.model<IUser>('User', UserSchema)
