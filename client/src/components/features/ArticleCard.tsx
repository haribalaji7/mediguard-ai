import { motion } from 'framer-motion'
import { BookOpen, Clock, Bookmark, BookmarkCheck, Play } from 'lucide-react'
import { useEducationStore } from '../../store/educationStore'
import { classNames, truncate } from '../../lib/utils'
import type { Article } from '../../types'

interface ArticleCardProps {
  article: Article
  onClick?: () => void
}

const categoryLabels: Record<string, string> = {
  nutrition: 'Nutrition',
  hygiene: 'Hygiene',
  'mental-health': 'Mental Health',
  'mother-child': 'Mother & Child',
  'chronic-disease': 'Chronic Disease',
}

export function ArticleCard({ article, onClick }: ArticleCardProps) {
  const { bookmarkedIds, toggleBookmark } = useEducationStore()
  const isBookmarked = bookmarkedIds.has(article._id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-card rounded-2xl border border-border shadow-card overflow-hidden hover:shadow-card-hover transition-all group cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative">
        {article.isVideo ? (
          <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play size={24} className="text-white ml-0.5" />
          </div>
        ) : (
          <BookOpen size={40} className="text-primary/40" />
        )}
        <button
          onClick={(e) => { e.stopPropagation(); toggleBookmark(article._id) }}
          className="absolute top-3 right-3 p-2 rounded-lg bg-black/20 hover:bg-black/40 transition-colors backdrop-blur-sm"
          aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          {isBookmarked ? <BookmarkCheck size={16} className="text-white" /> : <Bookmark size={16} className="text-white/70" />}
        </button>
        <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-medium rounded-full bg-black/30 text-white backdrop-blur-sm">
          {categoryLabels[article.category] || article.category}
        </span>
        {article.language !== 'en' && (
          <span className="absolute bottom-3 right-3 px-2 py-0.5 text-[10px] font-bold rounded bg-black/30 text-white">
            {article.language.toUpperCase()}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-text-primary mb-1.5 line-clamp-2">{article.title}</h3>
        <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
          {truncate(article.content, 100)}
        </p>
        <div className="flex items-center gap-3 mt-3 text-xs text-text-secondary">
          <span className="flex items-center gap-1">
            <Clock size={12} /> {article.readTime} min read
          </span>
        </div>
      </div>
    </motion.div>
  )
}
