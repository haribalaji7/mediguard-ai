import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import { connectDB } from './config/db'
import { generalLimiter } from './middleware/rateLimiter'
import { sanitizeInput } from './middleware/sanitizer'
import { errorHandler } from './middleware/errorHandler'

import authRoutes from './routes/auth'
import patientRoutes from './routes/patients'
import screeningRoutes from './routes/screenings'
import aiRoutes from './routes/ai'
import educationRoutes from './routes/education'
import communityRoutes from './routes/community'
import workerRoutes from './routes/worker'

const app = express()
const PORT = process.env.PORT || 5000

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(cookieParser())
app.use(express.json({ limit: '10mb' }))
app.use(morgan('dev'))

app.get('/api/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } })
})

app.use(generalLimiter)
app.use(sanitizeInput)

app.use('/api/auth', authRoutes)
app.use('/api/patients', patientRoutes)
app.use('/api/screenings', screeningRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/education', educationRoutes)
app.use('/api/community', communityRoutes)
app.use('/api/worker', workerRoutes)

app.use(errorHandler)

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`MediGuard AI server running on port ${PORT}`)
  })
}).catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})

export default app
