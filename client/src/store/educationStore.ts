import { create } from 'zustand'
import type { Article } from '../types'
import { mockArticles } from '../lib/mockData'

interface EducationStore {
  articles: Article[]
  bookmarkedIds: Set<string>
  searchQuery: string
  selectedCategory: string
  isLoading: boolean
  setArticles: (articles: Article[]) => void
  toggleBookmark: (articleId: string) => void
  setSearchQuery: (query: string) => void
  setSelectedCategory: (category: string) => void
  setLoading: (v: boolean) => void
}

export const useEducationStore = create<EducationStore>((set, get) => ({
  articles: mockArticles,
  bookmarkedIds: new Set(),
  searchQuery: '',
  selectedCategory: 'all',
  isLoading: false,
  setArticles: (articles) => set({ articles }),
  toggleBookmark: (articleId) => {
    const ids = new Set(get().bookmarkedIds)
    if (ids.has(articleId)) ids.delete(articleId)
    else ids.add(articleId)
    set({ bookmarkedIds: ids })
  },
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setLoading: (v) => set({ isLoading: v }),
}))
