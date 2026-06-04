import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Award, Clock, CheckCircle2, Play, Lock, ChevronRight, Star, Users, FileText, TrendingUp } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { useUiStore } from '../store/uiStore'

type Course = {
  id: string
  title: string
  category: string
  duration: string
  modules: number
  completedModules: number
  status: 'completed' | 'in-progress' | 'locked'
  certification: boolean
  description: string
}

const courses: Course[] = [
  { id: 'c1', title: 'Community Health Assessment', category: 'Core Skills', duration: '4 hrs', modules: 8, completedModules: 8, status: 'completed', certification: true, description: 'Learn systematic village health assessment, household surveys, and population-level screening techniques for rural communities.' },
  { id: 'c2', title: 'Maternal & Child Health', category: 'Specialization', duration: '6 hrs', modules: 12, completedModules: 9, status: 'in-progress', certification: true, description: 'Comprehensive training on antenatal care, postnatal monitoring, immunization schedules, and high-risk pregnancy identification.' },
  { id: 'c3', title: 'Disease Surveillance & Reporting', category: 'Core Skills', duration: '3 hrs', modules: 6, completedModules: 6, status: 'completed', certification: true, description: 'Master outbreak detection, IDSP reporting protocols, and community-level disease pattern analysis.' },
  { id: 'c4', title: 'Digital Health Tools', category: 'Technology', duration: '2 hrs', modules: 5, completedModules: 3, status: 'in-progress', certification: false, description: 'Using MediGuard AI, mHealth apps, teleconsultation platforms, and digital record management effectively.' },
  { id: 'c5', title: 'Emergency First Response', category: 'Emergency', duration: '5 hrs', modules: 10, completedModules: 0, status: 'locked', certification: true, description: 'First aid, CPR, snakebite management, drowning response, and emergency referral protocols for remote areas.' },
  { id: 'c6', title: 'Mental Health Awareness', category: 'Specialization', duration: '3 hrs', modules: 7, completedModules: 0, status: 'locked', certification: false, description: 'Identifying depression, anxiety, substance abuse in rural populations and providing basic counseling support.' },
]

const certifications = [
  { name: 'Community Health Assessment', date: '2026-03-15', grade: 'A+', validUntil: '2028-03-15' },
  { name: 'Disease Surveillance & Reporting', date: '2026-05-01', grade: 'A', validUntil: '2028-05-01' },
]

export default function WorkerTraining() {
  const { addToast } = useUiStore()
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [activeTab, setActiveTab] = useState<'courses' | 'certifications' | 'leaderboard'>('courses')

  const completedCount = courses.filter(c => c.status === 'completed').length
  const inProgressCount = courses.filter(c => c.status === 'in-progress').length
  const totalHours = courses.filter(c => c.status === 'completed').reduce((acc, c) => acc + parseInt(c.duration), 0)

  const leaderboard = [
    { rank: 1, name: 'Priya Sharma', score: 98, courses: 6, badge: '🥇' },
    { rank: 2, name: 'You', score: 92, courses: 4, badge: '🥈', isYou: true },
    { rank: 3, name: 'Anil Kumar', score: 88, courses: 5, badge: '🥉' },
    { rank: 4, name: 'Meena Devi', score: 85, courses: 4, badge: '' },
    { rank: 5, name: 'Ravi Shankar', score: 82, courses: 3, badge: '' },
  ]

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-6">

        {/* Hero Header */}
        <div className="relative mb-8 p-6 sm:p-8 rounded-[2rem] bg-gradient-to-br from-bg-card/80 to-bg-card/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,184,148,0.1)] overflow-hidden">
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/15 rounded-full blur-[80px] translate-y-1/3 translate-x-1/4 pointer-events-none animate-pulse-slow" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-accent p-[2px] shadow-glow">
                <div className="w-full h-full bg-bg-card/90 rounded-2xl flex items-center justify-center">
                  <Award size={28} className="text-primary" />
                </div>
              </div>
              <div>
                <h1 className="font-display text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  Training & Certification
                </h1>
                <p className="text-text-secondary font-medium mt-0.5">Upskill, earn certifications & climb the leaderboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-2xl font-extrabold font-display text-primary">{totalHours}h</p>
                <p className="text-xs text-text-secondary">Learning hours</p>
              </div>
              <div className="w-px h-10 bg-border/50" />
              <div className="text-right">
                <p className="text-2xl font-extrabold font-display text-accent">{certifications.length}</p>
                <p className="text-xs text-text-secondary">Certifications</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Completed', value: completedCount.toString(), icon: CheckCircle2, color: 'from-success to-primary' },
            { label: 'In Progress', value: inProgressCount.toString(), icon: Play, color: 'from-primary to-accent' },
            { label: 'Certifications', value: certifications.length.toString(), icon: Award, color: 'from-accent-gold to-warning' },
            { label: 'District Rank', value: '#2', icon: TrendingUp, color: 'from-accent to-primary' },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="relative overflow-hidden border-white/10 bg-bg-card/60 backdrop-blur-md">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`} />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-extrabold font-display text-text-primary">{stat.value}</p>
                    <p className="text-sm font-semibold text-text-primary mt-1">{stat.label}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <stat.icon size={20} />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {([
            { id: 'courses', label: '📚 Courses', icon: BookOpen },
            { id: 'certifications', label: '🏆 Certifications', icon: Award },
            { id: 'leaderboard', label: '🏅 Leaderboard', icon: Users },
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id ? 'bg-primary text-white shadow-glow' : 'bg-bg-card border border-border text-text-secondary hover:border-primary/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course, i) => {
              const progress = course.modules > 0 ? (course.completedModules / course.modules) * 100 : 0
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, type: 'spring', stiffness: 300, damping: 24 }}
                >
                  <Card className={`relative overflow-hidden bg-bg-card/60 backdrop-blur-md border-white/10 hover:shadow-card-hover transition-all cursor-pointer group ${course.status === 'locked' ? 'opacity-60' : ''}`}
                    onClick={() => course.status !== 'locked' && setSelectedCourse(course)}
                  >
                    <div className={`absolute top-0 left-0 right-0 h-1 ${
                      course.status === 'completed' ? 'bg-success' : course.status === 'in-progress' ? 'bg-gradient-to-r from-primary to-accent' : 'bg-border/40'
                    }`} />
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {course.status === 'locked' && <Lock size={14} className="text-text-secondary" />}
                          <h3 className="font-display text-base font-bold text-text-primary group-hover:text-primary transition-colors">{course.title}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{course.category}</span>
                          <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
                          <span>{course.modules} modules</span>
                        </div>
                      </div>
                      {course.certification && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent-gold/15 flex items-center justify-center" title="Certification available">
                          <Award size={16} className="text-accent-gold" />
                        </div>
                      )}
                    </div>
                    {course.status !== 'locked' && (
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex-1">
                          <div className="w-full bg-border/40 rounded-full h-2">
                            <div
                              className={`h-full rounded-full transition-all ${course.status === 'completed' ? 'bg-success' : 'bg-gradient-to-r from-primary to-accent'}`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-text-secondary">{Math.round(progress)}%</span>
                        {course.status === 'completed' && <CheckCircle2 size={16} className="text-success" />}
                      </div>
                    )}
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Certifications Tab */}
        {activeTab === 'certifications' && (
          <div className="space-y-4">
            {certifications.length === 0 ? (
              <Card className="text-center py-12 bg-bg-card/60 backdrop-blur-md border-white/10">
                <Award size={48} className="text-text-secondary/30 mx-auto mb-4" />
                <p className="text-text-secondary">Complete courses to earn certifications.</p>
              </Card>
            ) : (
              certifications.map((cert, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card className="bg-bg-card/60 backdrop-blur-md border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-gold to-warning" />
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-accent-gold/20 to-warning/20 flex items-center justify-center flex-shrink-0">
                        <Award size={32} className="text-accent-gold" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-lg font-bold text-text-primary">{cert.name}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-text-secondary mt-1">
                          <span>Earned: {cert.date}</span>
                          <span>·</span>
                          <span>Grade: <span className="text-primary font-bold">{cert.grade}</span></span>
                          <span>·</span>
                          <span>Valid until: {cert.validUntil}</span>
                        </div>
                      </div>
                      <Badge variant="success">VERIFIED</Badge>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <Card className="bg-bg-card/60 backdrop-blur-md border-white/10 overflow-hidden">
            <h3 className="font-display text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
              <Users size={18} className="text-primary" /> District Leaderboard
            </h3>
            <div className="space-y-2">
              {leaderboard.map((entry, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, type: 'spring', stiffness: 300, damping: 24 }}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                    entry.isYou ? 'bg-primary/10 border border-primary/30 ring-1 ring-primary/20' : 'bg-bg-base/50 border border-border/30 hover:bg-white/5'
                  }`}
                >
                  <span className="text-2xl font-extrabold font-display w-8 text-center">
                    {entry.badge || entry.rank}
                  </span>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${
                    entry.rank <= 3 ? 'bg-gradient-to-br from-accent-gold to-warning shadow-md' : 'bg-gradient-to-br from-primary to-accent'
                  }`}>
                    {entry.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold ${entry.isYou ? 'text-primary' : 'text-text-primary'}`}>
                      {entry.name} {entry.isYou && <span className="text-xs font-normal text-text-secondary">(You)</span>}
                    </p>
                    <p className="text-xs text-text-secondary">{entry.courses} courses completed</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-extrabold font-display text-text-primary">{entry.score}</p>
                    <p className="text-xs text-text-secondary">points</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        )}

        {/* Course Detail Modal */}
        <Modal isOpen={selectedCourse !== null} onClose={() => setSelectedCourse(null)} title={selectedCourse?.title || ''} size="lg">
          {selectedCourse && (
            <div className="space-y-4">
              <p className="text-text-secondary leading-relaxed">{selectedCourse.description}</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-xl bg-bg-base/50 border border-border/30">
                  <p className="text-lg font-bold text-text-primary">{selectedCourse.modules}</p>
                  <p className="text-xs text-text-secondary">Modules</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-bg-base/50 border border-border/30">
                  <p className="text-lg font-bold text-text-primary">{selectedCourse.duration}</p>
                  <p className="text-xs text-text-secondary">Duration</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-bg-base/50 border border-border/30">
                  <p className="text-lg font-bold text-primary">{Math.round((selectedCourse.completedModules / selectedCourse.modules) * 100)}%</p>
                  <p className="text-xs text-text-secondary">Progress</p>
                </div>
              </div>
              <div className="w-full bg-border/40 rounded-full h-3">
                <div
                  className={`h-full rounded-full transition-all ${selectedCourse.status === 'completed' ? 'bg-success' : 'bg-gradient-to-r from-primary to-accent'}`}
                  style={{ width: `${(selectedCourse.completedModules / selectedCourse.modules) * 100}%` }}
                />
              </div>
              <Button
                fullWidth
                onClick={() => { setSelectedCourse(null); addToast(selectedCourse.status === 'completed' ? 'Reviewing course materials...' : 'Resuming course...', 'info') }}
              >
                {selectedCourse.status === 'completed' ? (
                  <><FileText size={18} /> Review Materials</>
                ) : (
                  <><Play size={18} /> Continue Learning</>
                )}
              </Button>
            </div>
          )}
        </Modal>
      </div>
    </PageTransition>
  )
}
