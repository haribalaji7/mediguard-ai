import { create } from 'zustand'
import type { HealthCamp, GovernmentScheme, SuccessStory } from '../types'
import { mockCamps, mockSchemes, mockStories } from '../lib/mockData'

interface CommunityStore {
  camps: HealthCamp[]
  schemes: GovernmentScheme[]
  stories: SuccessStory[]
  isLoading: boolean
  setCamps: (camps: HealthCamp[]) => void
  setSchemes: (schemes: GovernmentScheme[]) => void
}

export const useCommunityStore = create<CommunityStore>((set) => ({
  camps: mockCamps,
  schemes: mockSchemes,
  stories: mockStories,
  isLoading: false,
  setCamps: (camps) => set({ camps }),
  setSchemes: (schemes) => set({ schemes }),
}))
