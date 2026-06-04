import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, BookOpen, Bookmark, BookmarkCheck, TrendingUp, Clock, Eye, X, Volume2, Sparkles } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { ArticleCard } from '../components/features/ArticleCard'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { useEducationStore } from '../store/educationStore'
import { useUiStore } from '../store/uiStore'
import { useDebounce } from '../hooks/useDebounce'
import { classNames } from '../lib/utils'
import type { Article } from '../types'

const categories = [
  { id: 'all', label: 'All', emoji: '📚' },
  { id: 'nutrition', label: 'Nutrition', emoji: '🥗' },
  { id: 'hygiene', label: 'Hygiene', emoji: '🧼' },
  { id: 'mental-health', label: 'Mental Health', emoji: '🧠' },
  { id: 'mother-child', label: 'Mother & Child', emoji: '👶' },
  { id: 'chronic-disease', label: 'Chronic Disease', emoji: '💊' },
]

export default function Learn() {
  const { articles, bookmarkedIds, searchQuery, selectedCategory, setSearchQuery, setSelectedCategory, toggleBookmark } = useEducationStore()
  const { addToast } = useUiStore()
  const debouncedSearch = useDebounce(searchQuery, 200)

  // Article preview modal state
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const matchesSearch = a.title.toLowerCase().includes(debouncedSearch.toLowerCase()) || a.content.toLowerCase().includes(debouncedSearch.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || a.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [articles, debouncedSearch, selectedCategory])

  // Reading time estimation
  const getReadingTime = (content: string) => {
    const words = content.split(/\s+/).length
    return Math.max(1, Math.ceil(words / 200))
  }

  // Text-to-speech for articles
  const handleReadAloud = (article: Article) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }
    const utterance = new SpeechSynthesisUtterance(`${article.title}. ${article.content}`)
    utterance.lang = 'en-IN'
    utterance.rate = 0.9
    utterance.onend = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utterance)
    setIsSpeaking(true)
  }

  const handleCloseArticle = () => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
    setSelectedArticle(null)
  }

  // Trending articles (top 3 by view count or first 3)
  const trendingArticles = useMemo(() => articles.slice(0, 3), [articles])

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-6">

        {/* Premium gradient header */}
        <div className="mb-6 bg-gradient-to-r from-primary/10 via-accent-gold/5 to-bg-card border border-border/60 rounded-3xl p-6 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary flex items-center gap-2">
                <BookOpen className="text-primary" size={24} /> Health Education
              </h1>
              <p className="text-text-secondary text-sm mt-1">Learn about health in your language — articles, videos & tips</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-bg-card rounded-xl border border-border px-3 py-2 text-center">
                <p className="text-lg font-bold text-primary font-display">{articles.length}</p>
                <p className="text-[9px] text-text-secondary font-semibold uppercase tracking-wider">Articles</p>
              </div>
              <div className="bg-bg-card rounded-xl border border-border px-3 py-2 text-center">
                <p className="text-lg font-bold text-accent-gold font-display">{bookmarkedIds.size}</p>
                <p className="text-[9px] text-text-secondary font-semibold uppercase tracking-wider">Bookmarked</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search bar with glass effect */}
        <div className="relative mb-5">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles, topics, and health tips..."
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-border bg-bg-card text-text-primary text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
            aria-label="Search articles"
          />
        </div>

        {/* Category pills with emojis */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={classNames(
                'px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5',
                selectedCategory === cat.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-bg-card border border-border text-text-secondary hover:border-primary hover:text-primary',
              )}
            >
              <span className="text-base">{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Trending Section */}
        {selectedCategory === 'all' && !searchQuery && (
          <div className="mb-6">
            <h2 className="font-display text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
              <TrendingUp size={18} className="text-accent-gold" /> Trending Now
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {trendingArticles.map((article, i) => (
                <motion.button
                  key={article._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => setSelectedArticle(article)}
                  className="bg-gradient-to-br from-primary/5 to-bg-card border border-border rounded-2xl p-4 text-left hover:shadow-card-hover transition-all group"
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">#{i + 1} Trending</span>
                  </div>
                  <h3 className="font-semibold text-sm text-text-primary group-hover:text-primary transition-colors line-clamp-2 mb-1">{article.title}</h3>
                  <div className="flex items-center gap-2 text-[10px] text-text-secondary">
                    <Clock size={10} /> {getReadingTime(article.content)} min read
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Bookmarked section */}
        {bookmarkedIds.size > 0 && (
          <div className="mb-6">
            <h2 className="font-display text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
              <BookmarkCheck size={18} className="text-primary" /> Bookmarked
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.filter((a) => bookmarkedIds.has(a._id)).map((article) => (
                <ArticleCard key={article._id} article={article} onClick={() => setSelectedArticle(article)} />
              ))}
            </div>
          </div>
        )}

        {/* Main content grid */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-text-primary">
            {selectedCategory === 'all' ? 'All Content' : categories.find((c) => c.id === selectedCategory)?.label}
          </h2>
          <span className="text-sm text-text-secondary">{filtered.length} items</span>
        </div>

        {filtered.length === 0 ? (
          <Card className="text-center py-12">
            <BookOpen size={48} className="text-text-secondary/30 mx-auto mb-3" />
            <p className="text-text-secondary font-medium">No content found</p>
            <p className="text-sm text-text-secondary mt-1">Try adjusting your search or filters</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((article, i) => (
              <motion.div
                key={article._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <ArticleCard article={article} onClick={() => setSelectedArticle(article)} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Article Preview Modal */}
        <Modal isOpen={!!selectedArticle} onClose={handleCloseArticle} title={selectedArticle?.title || ''} size="lg">
          {selectedArticle && (
            <div className="space-y-4">
              {/* Meta info bar */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary">
                <span className="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full uppercase">{selectedArticle.category}</span>
                <span className="flex items-center gap-1"><Clock size={11} /> {getReadingTime(selectedArticle.content)} min read</span>
                {selectedArticle.language && <span className="bg-border/40 px-2 py-0.5 rounded-full">{selectedArticle.language}</span>}
              </div>

              {/* Content */}
              <div className="prose prose-sm max-w-none text-text-primary leading-relaxed text-sm">
                {selectedArticle.content.split('\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-3 border-t border-border/40">
                <Button
                  variant={bookmarkedIds.has(selectedArticle._id) ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => {
                    toggleBookmark(selectedArticle._id)
                    addToast(bookmarkedIds.has(selectedArticle._id) ? 'Bookmark removed' : 'Bookmarked!', 'success')
                  }}
                >
                  {bookmarkedIds.has(selectedArticle._id) ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                  {bookmarkedIds.has(selectedArticle._id) ? 'Bookmarked' : 'Bookmark'}
                </Button>
                <Button
                  variant={isSpeaking ? 'danger' : 'secondary'}
                  size="sm"
                  onClick={() => handleReadAloud(selectedArticle)}
                >
                  <Volume2 size={14} />
                  {isSpeaking ? 'Stop Reading' : 'Read Aloud'}
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </PageTransition>
  )
}
