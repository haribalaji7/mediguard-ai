import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, MapPin, Shield, Megaphone, Quote, AlertTriangle, 
  Send, Heart, MessageSquare, Plus, Award, Activity, 
  CheckCircle, HelpCircle, ChevronDown, ChevronUp,
  Phone, Siren, BarChart3, ThumbsUp, Ambulance, Pill, Baby, Flame
} from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { CampCard } from '../components/features/CampCard'
import { SchemeCard } from '../components/features/SchemeCard'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { Input } from '../components/ui/Input'
import { useCommunityStore } from '../store/communityStore'
import { useUiStore } from '../store/uiStore'
import { useAuthStore } from '../store/authStore'

export default function Community() {
  const { 
    camps, schemes, stories, outbreaks, posts, 
    addOutbreakReport, addSuccessStory, addDiscussionPost, 
    likeDiscussionPost, addDiscussionReply 
  } = useCommunityStore()
  const { addToast } = useUiStore()
  const { user } = useAuthStore()

  // Tabs
  const [activeTab, setActiveTab] = useState<'camps' | 'discussions' | 'stories' | 'outbreaks' | 'emergency' | 'polls'>('camps')

  // Polls state
  const [pollVotes, setPollVotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('mediguard-poll-votes')
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  const healthPolls = [
    {
      id: 'poll-1',
      question: 'What is the biggest health challenge in your village?',
      options: [
        { id: 'a', label: 'Clean Drinking Water', votes: 47 },
        { id: 'b', label: 'Lack of Nearby Doctors', votes: 62 },
        { id: 'c', label: 'Expensive Medicines', votes: 38 },
        { id: 'd', label: 'Malaria / Dengue Outbreaks', votes: 29 },
      ],
    },
    {
      id: 'poll-2',
      question: 'How often do you visit a doctor for checkups?',
      options: [
        { id: 'a', label: 'Monthly', votes: 12 },
        { id: 'b', label: 'Every 3-6 months', votes: 34 },
        { id: 'c', label: 'Only when sick', votes: 78 },
        { id: 'd', label: 'Never / Very rarely', votes: 41 },
      ],
    },
    {
      id: 'poll-3',
      question: 'Which government health scheme has helped you the most?',
      options: [
        { id: 'a', label: 'Ayushman Bharat (PM-JAY)', votes: 55 },
        { id: 'b', label: 'Janani Suraksha Yojana', votes: 22 },
        { id: 'c', label: 'PM Jan Aushadhi', votes: 18 },
        { id: 'd', label: 'None / Not Aware', votes: 45 },
      ],
    },
  ]

  const handlePollVote = (pollId: string, optionId: string) => {
    if (pollVotes[pollId]) {
      addToast('You have already voted on this poll.', 'info')
      return
    }
    const updated = { ...pollVotes, [pollId]: optionId }
    setPollVotes(updated)
    localStorage.setItem('mediguard-poll-votes', JSON.stringify(updated))
    addToast('Your vote has been recorded!', 'success')
  }

  const emergencyContacts = [
    { name: 'National Emergency', number: '112', icon: Siren, color: 'bg-red-500', description: 'Police, Fire, Ambulance' },
    { name: 'Ambulance Service', number: '108', icon: Ambulance, color: 'bg-orange-500', description: 'Free 24/7 Emergency Transport' },
    { name: 'Health Helpline', number: '104', icon: Phone, color: 'bg-blue-500', description: 'Medical Advice & Info' },
    { name: 'Women Helpline', number: '181', icon: Shield, color: 'bg-purple-500', description: 'Domestic Violence & Safety' },
    { name: 'Child Helpline', number: '1098', icon: Baby, color: 'bg-pink-500', description: 'Child Abuse & Protection' },
    { name: 'Poison Info Centre', number: '1800-11-6117', icon: Pill, color: 'bg-emerald-500', description: 'AIIMS Poison Helpline (Toll-Free)' },
    { name: 'Disaster Mgmt', number: '1078', icon: Flame, color: 'bg-amber-500', description: 'NDMA Disaster Response' },
    { name: 'Mental Health', number: '08046110007', icon: Heart, color: 'bg-teal-500', description: 'iCall Psychosocial Helpline' },
  ]

  // Modals state
  const [showReport, setShowReport] = useState(false)
  const [showAddPost, setShowAddPost] = useState(false)
  const [showAddStory, setShowAddStory] = useState(false)

  // Forms state
  const [reportForm, setReportForm] = useState({ condition: '', village: '', cases: '', date: '' })
  const [postForm, setPostForm] = useState({ content: '', authorName: user?.name || '', village: user?.village || '' })
  const [storyForm, setStoryForm] = useState({ story: '', name: user?.name || '', village: user?.village || '' })

  // Replies panel toggle state (postId -> boolean)
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({})
  const [replyInput, setReplyInput] = useState<Record<string, string>>({})

  // Toggling Likes state
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('mediguard-liked-posts')
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  const handleLikePost = (postId: string) => {
    const isAlreadyLiked = !!likedPosts[postId]
    const nextLiked = !isAlreadyLiked
    setLikedPosts((prev) => {
      const updated = { ...prev, [postId]: nextLiked }
      localStorage.setItem('mediguard-liked-posts', JSON.stringify(updated))
      return updated
    })
    likeDiscussionPost(postId, nextLiked)
    if (nextLiked) {
      addToast('Question liked!', 'success')
    } else {
      addToast('Removed like.', 'info')
    }
  }

  const handleReport = () => {
    if (!reportForm.condition.trim() || !reportForm.village.trim() || !reportForm.cases || !reportForm.date) {
      addToast('Please fill in all fields.', 'error')
      return
    }
    addOutbreakReport({
      condition: reportForm.condition,
      village: reportForm.village,
      cases: parseInt(reportForm.cases, 10) || 0,
      date: reportForm.date,
    })
    addToast('Outbreak report submitted anonymously. Health authorities notified.', 'success')
    setShowReport(false)
    setReportForm({ condition: '', village: '', cases: '', date: '' })
  }

  const handleCreatePost = () => {
    if (!postForm.content.trim()) {
      addToast('Please write a message first.', 'error')
      return
    }
    addDiscussionPost({
      content: postForm.content,
      authorName: postForm.authorName.trim() || 'Anonymous User',
      village: postForm.village.trim() || 'Rural Resident',
    })
    addToast('Discussion post published successfully.', 'success')
    setShowAddPost(false)
    setPostForm({ content: '', authorName: user?.name || '', village: user?.village || '' })
  }

  const handleCreateStory = () => {
    if (!storyForm.story.trim() || !storyForm.name.trim() || !storyForm.village.trim()) {
      addToast('Please write your story, name, and village.', 'error')
      return
    }
    addSuccessStory({
      story: storyForm.story,
      name: storyForm.name,
      village: storyForm.village,
    })
    addToast('Thank you for sharing your success story!', 'success')
    setShowAddStory(false)
    setStoryForm({ story: '', name: user?.name || '', village: user?.village || '' })
  }

  const handleAddReply = (postId: string) => {
    const text = replyInput[postId] || ''
    if (!text.trim()) {
      addToast('Please type a reply.', 'error')
      return
    }
    addDiscussionReply(postId, {
      content: text,
      authorName: user?.name || 'Anonymous User',
      village: user?.village || 'Community Member',
    })
    setReplyInput((prev) => ({ ...prev, [postId]: '' }))
    addToast('Reply posted successfully.', 'success')
  }

  const toggleReplies = (postId: string) => {
    setExpandedReplies((prev) => ({ ...prev, [postId]: !prev[postId] }))
  }

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-6">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 bg-gradient-to-r from-primary/10 via-accent-gold/5 to-bg-card border border-border/60 p-6 rounded-3xl backdrop-blur-md">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary flex items-center gap-2">
              <Users className="text-primary" /> Community Board
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              Participate in health discussions, search nearby camps, and view disease outbreaks.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Button variant="danger" size="sm" onClick={() => setShowReport(true)} className="shadow-lg shadow-danger/10">
              <AlertTriangle size={15} /> Report Outbreak
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 border-b border-border/80 pb-3 mb-6 scrollbar-none">
          {[
            { id: 'camps', label: 'Camps & Schemes', icon: MapPin },
            { id: 'discussions', label: 'Discussion Board', icon: MessageSquare },
            { id: 'stories', label: 'Success Stories', icon: Award },
            { id: 'outbreaks', label: 'Outbreak Alerts', icon: Activity },
            { id: 'emergency', label: '🆘 SOS Helplines', icon: Siren },
            { id: 'polls', label: 'Health Polls', icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon
            const isSelected = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                  isSelected
                    ? 'bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]'
                    : 'text-text-secondary hover:text-text-primary hover:bg-border/20'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Content Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* 1. HEALTH CAMPS & SCHEMES */}
            {activeTab === 'camps' && (
              <div className="space-y-8">
                <div>
                  <h2 className="font-display text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                    <MapPin size={18} className="text-primary" /> Healthcare Camps Near You
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {camps.length === 0 ? (
                      <Card className="text-center py-8 col-span-full">
                        <Users size={32} className="text-text-secondary/30 mx-auto mb-2" />
                        <p className="text-text-secondary text-sm">No camps active at this moment.</p>
                      </Card>
                    ) : (
                      camps.map((camp) => <CampCard key={camp._id} camp={camp} />)
                    )}
                  </div>
                </div>

                <div className="border-t border-border/60 pt-6">
                  <h2 className="font-display text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                    <Shield size={18} className="text-accent-gold" /> Active Government Welfare Schemes
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {schemes.length === 0 ? (
                      <Card className="text-center py-8 col-span-full">
                        <Shield size={32} className="text-text-secondary/30 mx-auto mb-2" />
                        <p className="text-text-secondary text-sm">No government schemes listed yet.</p>
                      </Card>
                    ) : (
                      schemes.map((scheme) => <SchemeCard key={scheme._id} scheme={scheme} />)
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 2. DISCUSSION BOARD */}
            {activeTab === 'discussions' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-bold text-text-primary flex items-center gap-2">
                    <HelpCircle size={18} className="text-primary" /> Patient Q&A & Support Board
                  </h2>
                  <Button size="sm" onClick={() => setShowAddPost(true)}>
                    <Plus size={15} /> Ask a Question
                  </Button>
                </div>

                <div className="space-y-4">
                  {posts.map((post) => (
                    <Card key={post._id} className="p-5 border-l-4 border-l-primary hover:shadow-card-hover transition-all">
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <div>
                          <span className="font-bold text-sm text-text-primary">{post.authorName}</span>
                          <span className="text-xs text-text-secondary ml-2 bg-border/40 px-2 py-0.5 rounded-full">
                            {post.village}
                          </span>
                        </div>
                        <span className="text-[11px] text-text-secondary">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-text-primary text-sm leading-relaxed mb-4">{post.content}</p>

                      <div className="flex items-center gap-4 text-xs font-semibold text-text-secondary border-t border-border/40 pt-3">
                        <button
                          onClick={() => handleLikePost(post._id)}
                          className={`flex items-center gap-1.5 hover:text-danger transition-colors ${
                            likedPosts[post._id] ? 'text-danger font-bold' : 'text-text-secondary'
                          }`}
                        >
                          <Heart 
                            size={14} 
                            className={likedPosts[post._id] ? 'text-danger fill-danger' : 'text-danger/70 fill-danger/10'} 
                          />
                          <span>{post.likes} Likes</span>
                        </button>
                        <button
                          onClick={() => toggleReplies(post._id)}
                          className="flex items-center gap-1.5 hover:text-primary transition-colors"
                        >
                          <MessageSquare size={14} />
                          <span>{post.replies.length} Replies</span>
                          {expandedReplies[post._id] ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>
                      </div>

                      {/* Expandable replies panel */}
                      {expandedReplies[post._id] && (
                        <div className="mt-4 pl-4 border-l-2 border-border space-y-3 bg-bg-base/30 p-3 rounded-xl">
                          {post.replies.map((reply) => (
                            <div key={reply._id} className="text-xs text-text-secondary">
                              <div className="flex justify-between font-semibold mb-1">
                                <span className="text-text-primary">{reply.authorName} ({reply.village})</span>
                                <span>{new Date(reply.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p className="bg-bg-card p-2 rounded-lg border border-border/40 text-text-primary">{reply.content}</p>
                            </div>
                          ))}
                          <div className="flex items-center gap-2 mt-2 pt-2">
                            <input
                              type="text"
                              value={replyInput[post._id] || ''}
                              onChange={(e) => setReplyInput((prev) => ({ ...prev, [post._id]: e.target.value }))}
                              placeholder="Write a helpful answer..."
                              className="flex-1 text-xs bg-bg-card border border-border rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:border-primary"
                            />
                            <button
                              onClick={() => handleAddReply(post._id)}
                              className="p-2 rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors"
                            >
                              <Send size={12} />
                            </button>
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* 3. SUCCESS STORIES */}
            {activeTab === 'stories' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-bold text-text-primary flex items-center gap-2">
                    <Award size={18} className="text-primary" /> Inspiring Recovery Stories
                  </h2>
                  <Button size="sm" onClick={() => setShowAddStory(true)}>
                    <Plus size={15} /> Write Your Story
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stories.map((story) => (
                    <motion.div
                      key={story._id}
                      layout
                      className="bg-bg-card rounded-2xl border border-border shadow-card p-5 hover:shadow-card-hover transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                          <Quote size={18} className="text-primary" />
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed mb-4 font-serif">
                          "{story.story}"
                        </p>
                      </div>
                      <div className="flex items-center justify-between border-t border-border/40 pt-3">
                        <div>
                          <p className="text-sm font-bold text-text-primary">{story.name}</p>
                          <p className="text-xs text-text-secondary">{story.village}</p>
                        </div>
                        <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-bold">
                          Verified Recovery
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. OUTBREAK REPORTS */}
            {activeTab === 'outbreaks' && (
              <div className="space-y-4">
                <h2 className="font-display text-lg font-bold text-text-primary flex items-center gap-2">
                  <Activity size={18} className="text-danger" /> Community-reported Health Alerts Log
                </h2>

                <div className="overflow-hidden border border-border rounded-2xl shadow-card bg-bg-card">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-bg-base border-b border-border text-xs font-semibold text-text-secondary uppercase">
                          <th className="px-5 py-3.5">Disease / Alert</th>
                          <th className="px-5 py-3.5">Village / Area</th>
                          <th className="px-5 py-3.5 text-center">Cases</th>
                          <th className="px-5 py-3.5">Report Date</th>
                          <th className="px-5 py-3.5 text-right">Verification Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60 text-sm">
                        {outbreaks.map((ob) => {
                          const statusColors = {
                            pending: 'bg-danger/10 text-danger border-danger/20',
                            reviewed: 'bg-accent-gold/10 text-accent-gold border-accent-gold/20',
                            resolved: 'bg-success/10 text-success border-success/20',
                          }
                          const statusLabel = {
                            pending: 'Active Alert',
                            reviewed: 'Investigating',
                            resolved: 'Resolved & Monitored',
                          }

                          return (
                            <tr key={ob._id} className="hover:bg-bg-base/30 transition-colors">
                              <td className="px-5 py-4 font-semibold text-text-primary">{ob.condition}</td>
                              <td className="px-5 py-4 text-text-secondary">{ob.village}</td>
                              <td className="px-5 py-4 text-center font-bold text-text-primary">{ob.cases}</td>
                              <td className="px-5 py-4 text-text-secondary">
                                {new Date(ob.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                              </td>
                              <td className="px-5 py-4 text-right">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusColors[ob.status]}`}>
                                  {ob.status === 'resolved' ? <CheckCircle size={12} /> : <Activity size={12} />}
                                  {statusLabel[ob.status]}
                                </span>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 5. EMERGENCY SOS HELPLINES */}
            {activeTab === 'emergency' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-red-500/10 via-orange-500/5 to-bg-card border border-red-500/20 rounded-2xl p-5">
                  <h2 className="font-display text-lg font-bold text-text-primary flex items-center gap-2 mb-1">
                    <Siren size={20} className="text-red-500" /> Emergency SOS Helplines
                  </h2>
                  <p className="text-xs text-text-secondary">
                    Tap any number below to instantly call for help. These are official Government of India toll-free numbers available 24/7.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {emergencyContacts.map((contact) => {
                    const Icon = contact.icon
                    return (
                      <motion.a
                        key={contact.number}
                        href={`tel:${contact.number}`}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="group bg-bg-card rounded-2xl border border-border shadow-card p-4 hover:shadow-card-hover transition-all cursor-pointer block"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-xl ${contact.color} flex items-center justify-center shrink-0 shadow-lg`}>
                            <Icon size={18} className="text-white" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-sm text-text-primary truncate">{contact.name}</h3>
                            <p className="text-[10px] text-text-secondary">{contact.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-bg-base rounded-xl px-3 py-2.5 border border-border/60 group-hover:border-primary/40 transition-colors">
                          <span className="font-mono text-lg font-bold text-text-primary tracking-wider">{contact.number}</span>
                          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-md group-hover:shadow-green-500/30 transition-shadow">
                            <Phone size={14} className="text-white" />
                          </div>
                        </div>
                      </motion.a>
                    )
                  })}
                </div>

                <div className="bg-bg-card rounded-2xl border border-border p-4 text-xs text-text-secondary flex items-start gap-2">
                  <AlertTriangle size={14} className="text-accent-gold shrink-0 mt-0.5" />
                  <span>
                    <strong>Important:</strong> These numbers work across all telecom networks in India. For village-level emergencies, 
                    also contact your nearest ASHA worker or Primary Health Centre (PHC). If calling from a mobile, ensure you have 
                    network coverage or try moving to an open area.
                  </span>
                </div>
              </div>
            )}

            {/* 6. COMMUNITY HEALTH POLLS */}
            {activeTab === 'polls' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-bold text-text-primary flex items-center gap-2">
                    <BarChart3 size={18} className="text-primary" /> Community Health Polls
                  </h2>
                  <span className="text-[10px] text-text-secondary bg-border/40 px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider">
                    {Object.keys(pollVotes).length} / {healthPolls.length} Voted
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {healthPolls.map((poll) => {
                    const hasVoted = !!pollVotes[poll.id]
                    const userVote = pollVotes[poll.id]
                    const totalVotes = poll.options.reduce((sum, o) => sum + o.votes + (userVote === o.id ? 1 : 0), 0)

                    return (
                      <Card key={poll.id} className="p-5 hover:shadow-card-hover transition-all">
                        <h3 className="font-semibold text-sm text-text-primary mb-4 leading-snug">{poll.question}</h3>
                        <div className="space-y-2.5">
                          {poll.options.map((option) => {
                            const adjustedVotes = option.votes + (userVote === option.id ? 1 : 0)
                            const pct = totalVotes > 0 ? Math.round((adjustedVotes / totalVotes) * 100) : 0
                            const isSelected = userVote === option.id

                            return (
                              <button
                                key={option.id}
                                onClick={() => handlePollVote(poll.id, option.id)}
                                disabled={hasVoted}
                                className={`w-full text-left rounded-xl border p-3 transition-all relative overflow-hidden ${
                                  isSelected
                                    ? 'border-primary bg-primary/5'
                                    : hasVoted
                                      ? 'border-border bg-bg-base cursor-default'
                                      : 'border-border bg-bg-card hover:border-primary/50 hover:bg-primary/5 cursor-pointer'
                                }`}
                              >
                                {/* Animated fill bar */}
                                {hasVoted && (
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pct}%` }}
                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                    className={`absolute inset-y-0 left-0 rounded-xl ${
                                      isSelected ? 'bg-primary/15' : 'bg-border/30'
                                    }`}
                                  />
                                )}
                                <div className="relative flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    {hasVoted && isSelected && (
                                      <ThumbsUp size={13} className="text-primary shrink-0" />
                                    )}
                                    <span className={`text-xs font-semibold ${
                                      isSelected ? 'text-primary' : 'text-text-primary'
                                    }`}>
                                      {option.label}
                                    </span>
                                  </div>
                                  {hasVoted && (
                                    <span className={`text-xs font-bold shrink-0 ${
                                      isSelected ? 'text-primary' : 'text-text-secondary'
                                    }`}>
                                      {pct}%
                                    </span>
                                  )}
                                </div>
                              </button>
                            )
                          })}
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/40">
                          <span className="text-[10px] text-text-secondary">
                            {totalVotes} total votes
                          </span>
                          {hasVoted && (
                            <span className="text-[10px] text-primary font-bold flex items-center gap-1">
                              <CheckCircle size={11} /> You voted
                            </span>
                          )}
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* MODAL 1: REPORT OUTBREAK */}
        <Modal isOpen={showReport} onClose={() => setShowReport(false)} title="Report a Health Outbreak" size="lg">
          <p className="text-sm text-text-secondary mb-4">
            This report is completely anonymous. It alerts community healthcare workers immediately.
          </p>
          <div className="space-y-4">
            <Input label="Disease / Condition Name" value={reportForm.condition} onChange={(e) => setReportForm((p) => ({ ...p, condition: e.target.value }))} placeholder="e.g. Sudden Diarrhea Cluster" />
            <Input label="Village Name" value={reportForm.village} onChange={(e) => setReportForm((p) => ({ ...p, village: e.target.value }))} placeholder="e.g. Gopalpur" />
            <Input label="Approximate number of cases" type="number" value={reportForm.cases} onChange={(e) => setReportForm((p) => ({ ...p, cases: e.target.value }))} placeholder="e.g. 5" />
            <Input label="Date of first case" type="date" value={reportForm.date} onChange={(e) => setReportForm((p) => ({ ...p, date: e.target.value }))} placeholder=" " />
            <Button fullWidth onClick={handleReport}>
              <Send size={16} /> Submit Anonymous Report
            </Button>
          </div>
        </Modal>

        {/* MODAL 2: ASK A QUESTION */}
        <Modal isOpen={showAddPost} onClose={() => setShowAddPost(false)} title="Ask a Community Question" size="lg">
          <p className="text-sm text-text-secondary mb-4">
            Post your queries about camps, health cards, or general health concerns.
          </p>
          <div className="space-y-4">
            <textarea
              value={postForm.content}
              onChange={(e) => setPostForm((p) => ({ ...p, content: e.target.value }))}
              placeholder="What would you like to ask or share?"
              rows={4}
              className="w-full rounded-xl bg-bg-base border border-border p-3 text-sm text-text-primary focus:outline-none focus:border-primary"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Your Name (Optional)" value={postForm.authorName} onChange={(e) => setPostForm((p) => ({ ...p, authorName: e.target.value }))} placeholder="Anonymous" />
              <Input label="Village (Optional)" value={postForm.village} onChange={(e) => setPostForm((p) => ({ ...p, village: e.target.value }))} placeholder="Rural Area" />
            </div>
            <Button fullWidth onClick={handleCreatePost}>
              <Send size={16} /> Publish Post
            </Button>
          </div>
        </Modal>

        {/* MODAL 3: SHARE SUCCESS STORY */}
        <Modal isOpen={showAddStory} onClose={() => setShowAddStory(false)} title="Share Your Success Story" size="lg">
          <p className="text-sm text-text-secondary mb-4">
            Inspire other rural families with your medical recovery or healthy habit updates.
          </p>
          <div className="space-y-4">
            <textarea
              value={storyForm.story}
              onChange={(e) => setStoryForm((p) => ({ ...p, story: e.target.value }))}
              placeholder="Tell the community how you recovered, which doctor helped you, or which camp you visited..."
              rows={4}
              className="w-full rounded-xl bg-bg-base border border-border p-3 text-sm text-text-primary focus:outline-none focus:border-primary"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Your Name" value={storyForm.name} onChange={(e) => setStoryForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Sita Devi" />
              <Input label="Village Name" value={storyForm.village} onChange={(e) => setStoryForm((p) => ({ ...p, village: e.target.value }))} placeholder="e.g. Ramnagar" />
            </div>
            <Button fullWidth onClick={handleCreateStory}>
              <Send size={16} /> Publish Success Story
            </Button>
          </div>
        </Modal>

      </div>
    </PageTransition>
  )
}
