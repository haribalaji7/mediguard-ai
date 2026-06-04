import { create } from 'zustand'
import type { HealthCamp, GovernmentScheme, SuccessStory, OutbreakReport, DiscussionPost, DiscussionReply } from '../types'
import { mockCamps, mockSchemes, mockStories } from '../lib/mockData'

interface CommunityStore {
  camps: HealthCamp[]
  schemes: GovernmentScheme[]
  stories: SuccessStory[]
  outbreaks: OutbreakReport[]
  posts: DiscussionPost[]
  isLoading: boolean
  setCamps: (camps: HealthCamp[]) => void
  setSchemes: (schemes: GovernmentScheme[]) => void
  addSuccessStory: (story: Omit<SuccessStory, '_id'>) => void
  addOutbreakReport: (report: Omit<OutbreakReport, '_id' | 'reportedAt' | 'status'>) => void
  updateOutbreakStatus: (id: string, status: OutbreakReport['status']) => void
  addDiscussionPost: (post: Omit<DiscussionPost, '_id' | 'likes' | 'replies' | 'createdAt'>) => void
  likeDiscussionPost: (id: string, isLiked?: boolean) => void
  addDiscussionReply: (postId: string, reply: Omit<DiscussionReply, '_id' | 'createdAt'>) => void
}

export const useCommunityStore = create<CommunityStore>((set) => ({
  camps: mockCamps,
  schemes: mockSchemes,
  stories: mockStories,
  outbreaks: [
    {
      _id: 'out-001',
      condition: 'Malaria Outbreak Trend',
      village: 'Gopalpur',
      cases: 12,
      date: '2026-06-01',
      reportedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
    },
    {
      _id: 'out-002',
      condition: 'Sudden Typhoid Cases',
      village: 'Sitapur',
      cases: 8,
      date: '2026-05-28',
      reportedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'reviewed',
    },
  ],
  posts: [
    {
      _id: 'post-001',
      authorName: 'Ramesh Patel',
      village: 'Kharadi',
      content: 'Has anyone visited the clean water camp at Gopalpur? Are they distributing free filter kits?',
      likes: 5,
      replies: [
        {
          _id: 'rep-001',
          authorName: 'ASHA Anita',
          village: 'Gopalpur',
          content: 'Yes! Free water purification tablets and filter baskets are being provided to all registered families.',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        }
      ],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'post-002',
      authorName: 'Suresh Chandra',
      village: 'Bhimpur',
      content: 'Which scheme is best for free maternal checkups? My niece is 5 months pregnant.',
      likes: 3,
      replies: [],
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    }
  ],
  isLoading: false,
  setCamps: (camps) => set({ camps }),
  setSchemes: (schemes) => set({ schemes }),
  addSuccessStory: (story) =>
    set((state) => ({
      stories: [
        {
          ...story,
          _id: `story-${Date.now()}`,
        },
        ...state.stories,
      ],
    })),
  addOutbreakReport: (report) =>
    set((state) => ({
      outbreaks: [
        {
          ...report,
          _id: `out-${Date.now()}`,
          reportedAt: new Date().toISOString(),
          status: 'pending',
        },
        ...state.outbreaks,
      ],
    })),
  updateOutbreakStatus: (id, status) =>
    set((state) => ({
      outbreaks: state.outbreaks.map((ob) => (ob._id === id ? { ...ob, status } : ob)),
    })),
  addDiscussionPost: (post) =>
    set((state) => ({
      posts: [
        {
          ...post,
          _id: `post-${Date.now()}`,
          likes: 0,
          replies: [],
          createdAt: new Date().toISOString(),
        },
        ...state.posts,
      ],
    })),
  likeDiscussionPost: (id, isLiked = true) =>
    set((state) => ({
      posts: state.posts.map((p) => (p._id === id ? { ...p, likes: p.likes + (isLiked ? 1 : -1) } : p)),
    })),
  addDiscussionReply: (postId, reply) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p._id === postId
          ? {
              ...p,
              replies: [
                ...p.replies,
                {
                  ...reply,
                  _id: `rep-${Date.now()}`,
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : p
      ),
    })),
}))
