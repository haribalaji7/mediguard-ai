import axios, { AxiosError } from 'axios'
import type { ApiResponse, User, ScreeningResult, VitalRecord, Article, HealthCamp, GovernmentScheme, SuccessStory, SymptomAnalysis, AnalyticsData } from '../types'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 800, // Fail fast if API server is not running or responding
})

api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    if (err.response?.status === 401 && err.config && !err.config.url?.includes('/auth/refresh-token')) {
      try {
        await api.post('/auth/refresh-token')
        return api(err.config)
      } catch {
        // Clear logged-in state to prevent loop in checkAuth on reload
        localStorage.removeItem('aarogyam_logged_in')
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(err)
  }
)

async function handleApi<T>(fn: () => Promise<{ data: ApiResponse<T> }>): Promise<T> {
  const res = await fn()
  if (!res.data.success) throw new Error(res.data.error || 'API error')
  return res.data.data as T
}

export const authApi = {
  register: (data: Partial<User> & { password: string }) =>
    handleApi<User>(() => api.post('/auth/register', data)),
  login: (phone: string, password: string) =>
    handleApi<{ user: User; token: string }>(() => api.post('/auth/login', { phone, password })),
  me: () => handleApi<User>(() => api.get('/auth/me')),
  refresh: () => handleApi<{ token: string }>(() => api.post('/auth/refresh-token')),
}

export const patientApi = {
  get: (id: string) => handleApi<User>(() => api.get(`/patients/${id}`)),
  update: (id: string, data: Partial<User>) => handleApi<User>(() => api.put(`/patients/${id}`, data)),
  getRecords: (id: string) => handleApi<(ScreeningResult | VitalRecord)[]>(() => api.get(`/patients/${id}/records`)),
  addVitals: (id: string, data: Partial<VitalRecord>) => handleApi<VitalRecord>(() => api.post(`/patients/${id}/vitals`, data)),
}

export const screeningApi = {
  submit: (data: { patientId: string; type: string; answers: Record<string, string | number> }) =>
    handleApi<ScreeningResult>(() => api.post('/screenings/submit', data)),
  getByPatient: (patientId: string) => handleApi<ScreeningResult[]>(() => api.get(`/screenings/${patientId}`)),
  getResult: (id: string) => handleApi<ScreeningResult>(() => api.get(`/screenings/${id}/result`)),
}

export const aiApi = {
  symptomAnalysis: (symptoms: { bodyArea: string; symptomType: string; duration: string; severity: number; description: string }) =>
    handleApi<SymptomAnalysis>(() => api.post('/ai/symptom-analysis', { symptoms })),
  riskAssessment: (patientData: Record<string, unknown>) =>
    handleApi<{ riskScore: number; riskLevel: string }>(() => api.post('/ai/risk-assessment', patientData)),
}

export const educationApi = {
  getArticles: (params?: { category?: string; language?: string; search?: string }) =>
    handleApi<Article[]>(() => api.get('/education/articles', { params })),
  getArticle: (id: string) => handleApi<Article>(() => api.get(`/education/articles/${id}`)),
  toggleBookmark: (articleId: string) => handleApi<void>(() => api.post('/education/bookmark', { articleId })),
}

export const communityApi = {
  getCamps: () => handleApi<HealthCamp[]>(() => api.get('/community/camps')),
  getSchemes: () => handleApi<GovernmentScheme[]>(() => api.get('/community/schemes')),
  reportOutbreak: (data: { condition: string; village: string; cases: number; date: string }) =>
    handleApi<void>(() => api.post('/community/report-outbreak', data)),
}

export const workerApi = {
  getPatients: (params?: { search?: string; village?: string; riskLevel?: string }) =>
    handleApi<User[]>(() => api.get('/worker/patients', { params })),
  getAnalytics: () => handleApi<AnalyticsData>(() => api.get('/worker/analytics')),
  bulkEntry: (data: { screenings: { patientName: string; type: string; answers: Record<string, string | number> }[] }) =>
    handleApi<void>(() => api.post('/worker/bulk-entry', data)),
}

let isBackendDown = false

export async function mockOrApi<T>(apiCall: () => Promise<T>, mockData: T, delay = 600): Promise<T> {
  if (isBackendDown) {
    return mockData
  }
  try {
    return await apiCall()
  } catch (err: any) {
    // If it's a network timeout, connection refusal, or server offline error, mark backend as down for fast-path mock execution
    if (!err.response || err.code === 'ECONNABORTED' || err.message === 'Network Error') {
      isBackendDown = true
    }
    await new Promise((r) => setTimeout(r, delay))
    return mockData
  }
}

export default api
