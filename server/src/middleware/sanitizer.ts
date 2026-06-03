import { Request, Response, NextFunction } from 'express'

export function sanitizeInput(req: Request, _res: Response, next: NextFunction): void {
  const sanitize = (value: unknown): unknown => {
    if (typeof value === 'string') {
      return value.replace(/<[^>]*>/g, '').trim()
    }
    if (Array.isArray(value)) {
      return value.map(sanitize)
    }
    if (value && typeof value === 'object') {
      const sanitized: Record<string, unknown> = {}
      for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
        sanitized[k] = sanitize(v)
      }
      return sanitized
    }
    return value
  }

  req.body = sanitize(req.body) as Record<string, unknown>
  req.query = sanitize(req.query) as Record<string, string>
  next()
}
