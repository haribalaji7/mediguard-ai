import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import { AppError } from '../middleware/errorHandler'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret'

function generateTokens(userId: string, role: string) {
  const token = jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '30m' })
  const refreshToken = jwt.sign({ id: userId }, JWT_REFRESH_SECRET, { expiresIn: '7d' })
  return { token, refreshToken }
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, phone, password, role, age, gender, village, district, state, workerId } = req.body

    const existing = await User.findOne({ phone })
    if (existing) throw new AppError('Phone number already registered', 400)

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await User.create({
      name, phone, password: hashedPassword, role: role || 'patient',
      age, gender, village, district, state, workerId,
    })

    const { token, refreshToken } = generateTokens(user._id.toString(), user.role)
    user.refreshToken = refreshToken
    await user.save()

    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 30 * 60 * 1000 })
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 })

    res.status(201).json({
      success: true,
      data: {
        user: { _id: user._id, name: user.name, phone: user.phone, role: user.role },
        token,
      },
    })
  } catch (error) {
    next(error)
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { phone, password } = req.body

    const user = await User.findOne({ phone })
    if (!user) throw new AppError('Invalid phone or password', 401)

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) throw new AppError('Invalid phone or password', 401)

    const { token, refreshToken } = generateTokens(user._id.toString(), user.role)
    user.refreshToken = refreshToken
    await user.save()

    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 30 * 60 * 1000 })
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 })

    res.json({
      success: true,
      data: { user: { _id: user._id, name: user.name, phone: user.phone, role: user.role }, token },
    })
  } catch (error) {
    next(error)
  }
}

export async function refreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    const refresh = req.cookies?.refreshToken
    if (!refresh) throw new AppError('Refresh token required', 401)

    const decoded = jwt.verify(refresh, JWT_REFRESH_SECRET) as { id: string }
    const user = await User.findById(decoded.id)
    if (!user || user.refreshToken !== refresh) throw new AppError('Invalid refresh token', 401)

    const { token, refreshToken: newRefresh } = generateTokens(user._id.toString(), user.role)
    user.refreshToken = newRefresh
    await user.save()

    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 30 * 60 * 1000 })
    res.cookie('refreshToken', newRefresh, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 })

    res.json({ success: true, data: { token } })
  } catch (error) {
    next(error)
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '')
    if (!token) throw new AppError('Not authenticated', 401)

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string }
    const user = await User.findById(decoded.id).select('-password -refreshToken')
    if (!user) throw new AppError('User not found', 404)

    res.json({ success: true, data: user })
  } catch (error) {
    next(error)
  }
}
