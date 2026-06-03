import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Activity, Shield, Stethoscope, TrendingUp, TrendingDown, Search, Edit, Trash2, Plus, Check, X } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { classNames } from '../lib/utils'
import { useUiStore } from '../store/uiStore'

const mockUsers = [
  { id: 'u1', name: 'Sita Devi', role: 'patient' as const, phone: '9876543210', village: 'Ramnagar', status: 'active' as const, joined: '2026-01-15' },
  { id: 'u2', name: 'Anita Sharma', role: 'worker' as const, phone: '9876543211', workerId: 'ASHA-UP-4521', status: 'active' as const, joined: '2025-06-01' },
  { id: 'u3', name: 'Ram Prasad', role: 'patient' as const, phone: '9876543212', village: 'Bhimavaram', status: 'active' as const, joined: '2026-03-10' },
  { id: 'u4', name: 'Dr. Priya Singh', role: 'worker' as const, phone: '9876543213', workerId: 'DOC-MP-1024', status: 'suspended' as const, joined: '2025-01-20' },
  { id: 'u5', name: 'Admin User', role: 'admin' as const, phone: '9876543214', status: 'active' as const, joined: '2024-01-01' },
]

const mockHealthTips = [
  { id: 'ht-1', title: 'Wash hands with soap', category: 'Hygiene', language: 'EN', status: 'published' as const },
  { id: 'ht-2', title: 'Drink clean water', category: 'Nutrition', language: 'HI', status: 'published' as const },
  { id: 'ht-3', title: 'Walk every day', category: 'General', language: 'EN', status: 'draft' as const },
]

type Tab = 'overview' | 'users' | 'content' | 'health'

export default function Admin() {
  const { addToast } = useUiStore()
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [userSearch, setUserSearch] = useState('')
  const [showEditTip, setShowEditTip] = useState(false)
  const [selectedTip, setSelectedTip] = useState<typeof mockHealthTips[0] | null>(null)

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: Activity },
    { id: 'users' as Tab, label: 'Users', icon: Users },
    { id: 'content' as Tab, label: 'Content', icon: Shield },
    { id: 'health' as Tab, label: 'System Health', icon: Stethoscope },
  ]

  const filteredUsers = mockUsers.filter((u) =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()),
  )

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary mb-1">Admin Panel</h1>
        <p className="text-text-secondary text-sm mb-6">Platform management and oversight</p>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={classNames(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap',
                  activeTab === tab.id ? 'bg-primary text-white' : 'bg-bg-card border border-border text-text-secondary hover:border-primary',
                )}
              >
                <Icon size={16} /> {tab.label}
              </button>
            )
          })}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Total Users', value: '5,234', icon: Users, trend: '+12%', up: true },
                { label: 'Screenings Done', value: '12,847', icon: Activity, trend: '+18%', up: true },
                { label: 'Active Workers', value: '342', icon: Stethoscope, trend: '+5%', up: true },
                { label: 'Reports Generated', value: '847', icon: Shield, trend: '-3%', up: false },
              ].map((stat, i) => (
                <Card key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon size={20} className="text-primary" />
                    <span className={classNames('text-xs font-semibold flex items-center gap-0.5', stat.up ? 'text-success' : 'text-danger')}>
                      {stat.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {stat.trend}
                    </span>
                  </div>
                  <p className="text-2xl font-bold font-display text-text-primary">{stat.value}</p>
                  <p className="text-xs text-text-secondary">{stat.label}</p>
                </Card>
              ))}
            </div>
            <Card>
              <h3 className="font-semibold text-text-primary mb-4">Platform Activity (Last 30 Days)</h3>
              <div className="h-12 flex items-end gap-1">
                {[40, 65, 45, 80, 55, 70, 90, 60, 75, 50, 85, 62, 48, 72, 88, 95, 68, 42, 78, 92, 58, 82, 70, 85, 65, 90, 75, 60, 88, 72].map((h, i) => (
                  <div key={i} className="flex-1 bg-primary/30 rounded-t-sm hover:bg-primary/60 transition-colors" style={{ height: `${h}%` }} title={`Day ${i + 1}: ${h} actions`} />
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <div className="flex items-center gap-4 mb-4">
              <Input label="Search users..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} placeholder=" " className="flex-1" />
              <Button variant="primary" size="sm"><Plus size={16} /> Add User</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-text-secondary border-b border-border">
                    <th className="pb-3 font-semibold">Name</th>
                    <th className="pb-3 font-semibold">Role</th>
                    <th className="pb-3 font-semibold">Phone</th>
                    <th className="pb-3 font-semibold">Location</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="border-b border-border/50">
                      <td className="py-3 text-text-primary font-medium">{u.name}</td>
                      <td className="py-3">
                        <Badge variant={u.role === 'admin' ? 'info' : u.role === 'worker' ? 'success' : 'low'} size="sm">
                          {u.role}
                        </Badge>
                      </td>
                      <td className="py-3 text-text-secondary">{u.phone}</td>
                      <td className="py-3 text-text-secondary">{u.village || u.workerId || '-'}</td>
                      <td className="py-3">
                        <span className={classNames('flex items-center gap-1 text-xs font-medium', u.status === 'active' ? 'text-success' : 'text-danger')}>
                          {u.status === 'active' ? <Check size={12} /> : <X size={12} />} {u.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm"><Edit size={14} /></Button>
                          <Button variant="ghost" size="sm"><Trash2 size={14} className="text-danger" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-bold text-text-primary">Health Tips & Articles</h2>
              <Button variant="primary" size="sm" onClick={() => { setSelectedTip(null); setShowEditTip(true) }}>
                <Plus size={16} /> Add New
              </Button>
            </div>
            <div className="space-y-2">
              {mockHealthTips.map((tip) => (
                <Card key={tip.id} className="py-3 px-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-text-primary">{tip.title}</p>
                      <p className="text-xs text-text-secondary">{tip.category} · {tip.language}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={tip.status === 'published' ? 'success' : 'low'} size="sm">{tip.status}</Badge>
                      <Button variant="ghost" size="sm" onClick={() => { setSelectedTip(tip); setShowEditTip(true) }}><Edit size={14} /></Button>
                      <Button variant="ghost" size="sm"><Trash2 size={14} className="text-danger" /></Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'health' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="font-semibold text-text-primary mb-4">API Status</h3>
              <div className="space-y-3">
                {[
                  { name: 'Authentication API', status: 'operational', latency: '45ms' },
                  { name: 'Screening Service', status: 'operational', latency: '120ms' },
                  { name: 'AI/Gemini Service', status: 'degraded', latency: '2.1s' },
                  { name: 'Database (MongoDB)', status: 'operational', latency: '32ms' },
                  { name: 'Storage Service', status: 'operational', latency: '18ms' },
                ].map((svc) => (
                  <div key={svc.name} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-center gap-3">
                      <div className={classNames('w-2 h-2 rounded-full', svc.status === 'operational' ? 'bg-success' : 'bg-warning')} />
                      <span className="text-sm text-text-primary">{svc.name}</span>
                    </div>
                    <span className="text-xs text-text-secondary">{svc.latency}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <h3 className="font-semibold text-text-primary mb-4">System Stats</h3>
              <div className="space-y-4">
                {[
                  { label: 'Uptime', value: '99.97%' },
                  { label: 'Total API Calls (24h)', value: '48,392' },
                  { label: 'Avg Response Time', value: '187ms' },
                  { label: 'Error Rate', value: '0.02%' },
                  { label: 'Active Sessions', value: '1,247' },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">{stat.label}</span>
                    <span className="text-sm font-semibold text-text-primary">{stat.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>

      <Modal isOpen={showEditTip} onClose={() => setShowEditTip(false)} title={selectedTip ? 'Edit Content' : 'Add New Content'} size="lg">
        <div className="space-y-4">
          <Input label="Title" defaultValue={selectedTip?.title} placeholder=" " />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Category" defaultValue={selectedTip?.category} placeholder=" " />
            <Input label="Language" defaultValue={selectedTip?.language} placeholder=" " />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Content</label>
            <textarea rows={6} className="w-full p-4 rounded-xl border border-border bg-bg-card text-text-primary text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="Write content here..." />
          </div>
          <Button fullWidth onClick={() => { setShowEditTip(false); addToast('Content saved', 'success') }}>
            Save Content
          </Button>
        </div>
      </Modal>
    </PageTransition>
  )
}
