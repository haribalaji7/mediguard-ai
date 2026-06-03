export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatPhone(phone: string): string {
  if (phone.length === 10) return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`
  return phone
}

export function getRiskColor(level: string): string {
  switch (level.toLowerCase()) {
    case 'low': return 'var(--success)'
    case 'medium': return 'var(--warning)'
    case 'high': return 'var(--danger)'
    case 'emergency': return 'var(--accent)'
    default: return 'var(--text-secondary)'
  }
}

export function getRiskBgColor(level: string): string {
  switch (level.toLowerCase()) {
    case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'emergency': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
}

export function getUrgencyColor(level: string): string {
  switch (level.toUpperCase()) {
    case 'LOW': return 'var(--success)'
    case 'MEDIUM': return 'var(--warning)'
    case 'HIGH': return '#E67E22'
    case 'EMERGENCY': return 'var(--accent)'
    default: return 'var(--text-secondary)'
  }
}

export function sanitizeInput(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim()
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, ms: number): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function calculateHealthScore(screenings: { riskLevel: string }[]): number {
  if (!screenings.length) return 85
  const weights: Record<string, number> = { low: 0, medium: 15, high: 30, emergency: 40 }
  const penalty = screenings.reduce((sum, s) => sum + (weights[s.riskLevel.toLowerCase()] || 0), 0)
  return Math.max(10, 100 - penalty)
}

export function getScreeningLabel(type: string): string {
  const labels: Record<string, string> = {
    diabetes: 'Diabetes Risk',
    hypertension: 'Hypertension Check',
    tb: 'TB Screening',
    anemia: 'Anemia Detection',
    maternal: 'Maternal Health Check',
  }
  return labels[type] || type
}
