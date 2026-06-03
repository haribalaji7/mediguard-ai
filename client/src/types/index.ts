export interface User {
  _id: string
  name: string
  phone: string
  role: 'patient' | 'worker' | 'admin'
  age?: number
  gender?: 'male' | 'female' | 'other'
  village?: string
  district?: string
  state?: string
  workerId?: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export type RiskLevel = 'low' | 'medium' | 'high' | 'emergency'

export interface ScreeningResult {
  _id: string
  patientId: string
  type: 'diabetes' | 'hypertension' | 'tb' | 'anemia' | 'maternal'
  answers: Record<string, string | number>
  riskScore: number
  riskLevel: RiskLevel
  resultData: Record<string, unknown>
  createdAt: string
}

export type UrgencyLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY'

export interface Condition {
  name: string
  likelihood_percent: number
  description: string
}

export interface SymptomAnalysis {
  possible_conditions: Condition[]
  urgency_level: UrgencyLevel
  recommended_action: string
  home_care_tips: string[]
  when_to_seek_help: string
  disclaimer: string
}

export interface VitalRecord {
  _id: string
  patientId: string
  weight?: number
  bpSystolic?: number
  bpDiastolic?: number
  glucose?: number
  heartRate?: number
  date: string
}

export interface Article {
  _id: string
  title: string
  content: string
  category: 'nutrition' | 'hygiene' | 'mental-health' | 'mother-child' | 'chronic-disease'
  language: string
  readTime: number
  imageUrl: string
  isVideo?: boolean
  videoUrl?: string
  bookmarkedBy?: string[]
}

export interface HealthCamp {
  _id: string
  title: string
  date: string
  location: string
  services: string[]
  description: string
  organizer: string
}

export interface GovernmentScheme {
  _id: string
  name: string
  description: string
  eligibility: string
  benefits: string
  applyUrl: string
}

export interface SuccessStory {
  _id: string
  name: string
  village: string
  story: string
  image?: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'bot' | 'system'
  content: string
  timestamp: number
}

export interface Doctor {
  _id: string
  name: string
  specialty: string
  languages: string[]
  rating: number
  availableToday: boolean
  image?: string
}

export interface Appointment {
  _id: string
  doctorId: string
  doctorName: string
  patientId: string
  date: string
  time: string
  status: 'scheduled' | 'completed' | 'cancelled'
}

export interface AnalyticsData {
  totalPatients: number
  totalScreenings: number
  screeningsThisMonth: number
  diseaseDistribution: { name: string; value: number }[]
  monthlyScreenings: { month: string; count: number }[]
  villageData: { village: string; count: number; riskLevel: RiskLevel }[]
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
