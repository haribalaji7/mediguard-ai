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

  // Sanitize req.body
  if (req.body && typeof req.body === 'object') {
    req.body = sanitize(req.body) as Record<string, unknown>
  }
  
  // Sanitize req.query values without reassigning the whole object
  if (req.query && typeof req.query === 'object') {
    const sanitizedQuery: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(req.query)) {
      sanitizedQuery[key] = sanitize(value)
    }
    // We can't reassign req.query due to Express typing, so we modify in place
    // Clear and repopulate to avoid type issues
    Object.keys(req.query).forEach(key => delete (req.query as any)[key])
    Object.assign(req.query, sanitizedQuery)
  }
  
  next()
}
