import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, BookOpen, Bookmark, BookmarkCheck } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { ArticleCard } from '../components/features/ArticleCard'
import { Card } from '../components/ui/Card'
import { useEducationStore } from '../store/educationStore'
import { useDebounce } from '../hooks/useDebounce'
import { classNames } from '../lib/utils'

const categories = [
  { id: 'all', label: 'All' },
  { id: 'nutrition', label: 'Nutrition' },
  { id: 'hygiene', label: 'Hygiene' },
  { id: 'mental-health', label: 'Mental Health' },
  { id: 'mother-child', label: 'Mother & Child' },
  { id: 'chronic-disease', label: 'Chronic Disease' },
]

export default function Learn() {
  const { articles, bookmarkedIds, searchQuery, selectedCategory, setSearchQuery, setSelectedCategory, toggleBookmark } = useEducationStore()
  const debouncedSearch = useDebounce(searchQuery, 200)

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const matchesSearch = a.title.toLowerCase().includes(debouncedSearch.toLowerCase()) || a.content.toLowerCase().includes(debouncedSearch.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || a.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [articles, debouncedSearch, selectedCategory])

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-6">
        <div className="mb-6">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary">Health Education</h1>
          <p className="text-text-secondary text-sm mt-1">Learn about health in your language</p>
        </div>

        <div className="relative mb-6">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles and videos..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-bg-card text-text-primary text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            aria-label="Search articles"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={classNames(
                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                selectedCategory === cat.id
                  ? 'bg-primary text-white'
                  : 'bg-bg-card border border-border text-text-secondary hover:border-primary hover:text-primary',
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {bookmarkedIds.size > 0 && (
          <div className="mb-6">
            <h2 className="font-display text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
              <BookmarkCheck size={18} className="text-primary" /> Bookmarked
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.filter((a) => bookmarkedIds.has(a._id)).map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          </div>
        )}

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
            {filtered.map((article) => (
              <ArticleCard key={article._id} article={article} onClick={() => {}} />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  )
}
