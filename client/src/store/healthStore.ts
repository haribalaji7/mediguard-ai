import { create } from 'zustand'
import type { ScreeningResult, VitalRecord } from '../types'
import { mockScreenings, mockVitals } from '../lib/mockData'
import { calculateHealthScore } from '../lib/utils'

interface HealthStore {
  screenings: ScreeningResult[]
  vitals: VitalRecord[]
  healthScore: number
  isLoading: boolean
  setScreenings: (screenings: ScreeningResult[]) => void
  addScreening: (screening: ScreeningResult) => void
  setVitals: (vitals: VitalRecord[]) => void
  addVital: (vital: VitalRecord) => void
  recalculateScore: () => void
}

export const useHealthStore = create<HealthStore>((set, get) => ({
  screenings: mockScreenings,
  vitals: mockVitals,
  healthScore: calculateHealthScore(mockScreenings),
  isLoading: false,
  setScreenings: (screenings) => {
    set({ screenings })
    get().recalculateScore()
  },
  addScreening: (screening) => {
    set((s) => ({ screenings: [screening, ...s.screenings] }))
    get().recalculateScore()
  },
  setVitals: (vitals) => set({ vitals }),
  addVital: (vital) => set((s) => ({ vitals: [...s.vitals, vital] })),
  recalculateScore: () => {
    const score = calculateHealthScore(get().screenings)
    set({ healthScore: score })
  },
}))
