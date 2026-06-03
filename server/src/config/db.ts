import mongoose from 'mongoose'

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.log('MongoDB URI not provided, running without database')
    mongoose.set('bufferCommands', false)
    return
  }
  try {
    await mongoose.connect(uri)
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}
