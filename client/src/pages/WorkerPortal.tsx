import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Users, Activity, BarChart3, AlertTriangle, Download, Plus, Trash2, Stethoscope } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Modal } from '../components/ui/Modal'
import { ListSkeleton } from '../components/ui/Skeleton'
import { useDebounce } from '../hooks/useDebounce'
import { useUiStore } from '../store/uiStore'
import { classNames } from '../lib/utils'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const mockPatients = [
  { id: 'p1', name: 'Sita Devi', age: 34, village: 'Ramnagar', lastScreening: '2026-05-20', riskLevel: 'low' as const, phone: '9876543210' },
  { id: 'p2', name: 'Ram Prasad', age: 52, village: 'Bhimavaram', lastScreening: '2026-05-15', riskLevel: 'high' as const, phone: '9876543211' },
  { id: 'p3', name: 'Geeta Sharma', age: 28, village: 'Ramnagar', lastScreening: '2026-05-10', riskLevel: 'medium' as const, phone: '9876543212' },
  { id: 'p4', name: 'Mohan Lal', age: 45, village: 'Sitapur', lastScreening: '2026-04-28', riskLevel: 'emergency' as const, phone: '9876543213' },
  { id: 'p5', name: 'Lakshmi Devi', age: 60, village: 'Lakshmipur', lastScreening: '2026-05-01', riskLevel: 'low' as const, phone: '9876543214' },
]

const monthlyData = [
  { month: 'Jan', cases: 210 }, { month: 'Feb', cases: 245 }, { month: 'Mar', cases: 280 },
  { month: 'Apr', cases: 310 }, { month: 'May', cases: 342 }, { month: 'Jun', cases: 298 },
]

const diseaseDist = [
  { name: 'Diabetes', value: 35 }, { name: 'Hypertension', value: 28 },
  { name: 'Anemia', value: 20 }, { name: 'TB', value: 10 }, { name: 'Maternal', value: 7 },
]

const COLORS = ['#00B894', '#FF7675', '#FDCB6E', '#E74C3C', '#3498DB']

const villageData = [
  { village: 'Ramnagar', count: 342, risk: 'medium' as const }, { village: 'Bhimavaram', count: 289, risk: 'low' as const },
  { village: 'Sitapur', count: 198, risk: 'high' as const }, { village: 'Lakshmipur', count: 156, risk: 'medium' as const },
  { village: 'Gopalpur', count: 128, risk: 'emergency' as const },
]

export default function WorkerPortal() {
  const { addToast } = useUiStore()
  const [activeTab, setActiveTab] = useState<'patients' | 'analytics' | 'bulk' | 'alerts'>('patients')
  const [search, setSearch] = useState('')
  const [showBulk, setShowBulk] = useState(false)
  const [bulkRows, setBulkRows] = useState([{ name: '', age: '', village: '', symptoms: '' }])
  const debouncedSearch = useDebounce(search, 200)

  const filteredPatients = mockPatients.filter((p) =>
    p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || p.village.toLowerCase().includes(debouncedSearch.toLowerCase()),
  )

  const tabs = [
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
  ]

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary">Healthcare Worker Portal</h1>
            <p className="text-text-secondary text-sm mt-1">Manage patients and community health data</p>
          </div>
          <Button variant="primary" size="sm" onClick={() => setShowBulk(true)}>
            <Plus size={16} /> Bulk Entry
          </Button>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
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

        {activeTab === 'patients' && (
          <div>
            <Input label="Search patients by name or village..." value={search} onChange={(e) => setSearch(e.target.value)} placeholder=" " className="mb-4" />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-text-secondary border-b border-border">
                    <th className="pb-3 font-semibold">Name</th>
                    <th className="pb-3 font-semibold">Age</th>
                    <th className="pb-3 font-semibold">Village</th>
                    <th className="pb-3 font-semibold">Last Screening</th>
                    <th className="pb-3 font-semibold">Risk</th>
                    <th className="pb-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-8 text-text-secondary">No patients found</td></tr>
                  ) : (
                    filteredPatients.map((p) => (
                      <tr key={p.id} className="border-b border-border/50">
                        <td className="py-3 text-text-primary font-medium">{p.name}</td>
                        <td className="py-3 text-text-secondary">{p.age}</td>
                        <td className="py-3 text-text-secondary">{p.village}</td>
                        <td className="py-3 text-text-secondary">{p.lastScreening}</td>
                        <td className="py-3"><Badge variant={p.riskLevel}>{p.riskLevel.toUpperCase()}</Badge></td>
                        <td className="py-3"><Button variant="ghost" size="sm">View</Button></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Total Patients', value: '1,247', icon: Users, color: 'text-primary bg-primary/10' },
                { label: 'Total Screenings', value: '3,892', icon: Activity, color: 'text-accent bg-accent/10' },
                { label: 'This Month', value: '342', icon: BarChart3, color: 'text-success bg-success/10' },
                { label: 'High Risk', value: '48', icon: AlertTriangle, color: 'text-danger bg-danger/10' },
              ].map((stat, i) => (
                <Card key={i} className="text-center">
                  <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mx-auto mb-2`}>
                    <stat.icon size={18} />
                  </div>
                  <p className="text-2xl font-bold font-display text-text-primary">{stat.value}</p>
                  <p className="text-xs text-text-secondary">{stat.label}</p>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <h3 className="font-semibold text-text-primary mb-4">Monthly Screenings</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="month" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                      <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                      <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }} />
                      <Bar dataKey="cases" fill="#00B894" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              <Card>
                <h3 className="font-semibold text-text-primary mb-4">Disease Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={diseaseDist} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {diseaseDist.map((entry, i) => <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            <Card>
              <h3 className="font-semibold text-text-primary mb-4">Village-wise Screening Coverage</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-text-secondary border-b border-border">
                      <th className="pb-3 font-semibold">Village</th>
                      <th className="pb-3 font-semibold">Screened</th>
                      <th className="pb-3 font-semibold">Risk Level</th>
                      <th className="pb-3 font-semibold">Coverage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {villageData.map((v) => (
                      <tr key={v.village} className="border-b border-border/50">
                        <td className="py-3 text-text-primary font-medium">{v.village}</td>
                        <td className="py-3 text-text-secondary">{v.count}</td>
                        <td className="py-3"><Badge variant={v.risk}>{v.risk.toUpperCase()}</Badge></td>
                        <td className="py-3">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, (v.count / 400) * 100)}%` }} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-3">
            {mockPatients.filter((p) => p.riskLevel === 'high' || p.riskLevel === 'emergency').length === 0 ? (
              <Card className="text-center py-8">
                <p className="text-text-secondary">No high-risk alerts at this time.</p>
              </Card>
            ) : (
              mockPatients.filter((p) => p.riskLevel === 'high' || p.riskLevel === 'emergency').map((p) => (
                <Card key={p.id} variant={p.riskLevel === 'emergency' ? 'danger' : 'warning'}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-text-primary">{p.name}</p>
                      <p className="text-sm text-text-secondary">{p.village} · Age {p.age}</p>
                      <p className="text-sm text-text-secondary">Phone: {p.phone}</p>
                    </div>
                    <Badge variant={p.riskLevel} pulse>{p.riskLevel.toUpperCase()} RISK</Badge>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="primary" size="sm">Contact Patient</Button>
                    <Button variant="ghost" size="sm">View Record</Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        <Modal isOpen={showBulk} onClose={() => setShowBulk(false)} title="Bulk Screening Entry" size="xl">
          <div className="space-y-4">
            {bulkRows.map((row, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-end p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <div className="col-span-3">
                  <Input label="Name" value={row.name} onChange={(e) => { setBulkRows((prev) => prev.map((r, j) => j === i ? { ...r, name: e.target.value } : r)) }} placeholder=" " />
                </div>
                <div className="col-span-2">
                  <Input label="Age" type="number" value={row.age} onChange={(e) => { setBulkRows((prev) => prev.map((r, j) => j === i ? { ...r, age: e.target.value } : r)) }} placeholder=" " />
                </div>
                <div className="col-span-3">
                  <Input label="Village" value={row.village} onChange={(e) => { setBulkRows((prev) => prev.map((r, j) => j === i ? { ...r, village: e.target.value } : r)) }} placeholder=" " />
                </div>
                <div className="col-span-3">
                  <Input label="Symptoms" value={row.symptoms} onChange={(e) => { setBulkRows((prev) => prev.map((r, j) => j === i ? { ...r, symptoms: e.target.value } : r)) }} placeholder=" " />
                </div>
                <div className="col-span-1">
                  <button onClick={() => setBulkRows((r) => r.filter((_, j) => j !== i))} className="p-2 rounded-lg text-danger hover:bg-danger/10 transition-colors" aria-label="Remove row">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            <Button variant="ghost" onClick={() => setBulkRows((r) => [...r, { name: '', age: '', village: '', symptoms: '' }])}>
              <Plus size={16} /> Add Row
            </Button>
            <Button fullWidth onClick={() => { setShowBulk(false); addToast('Bulk entry submitted successfully', 'success') }}>
              Submit All Entries
            </Button>
          </div>
        </Modal>
      </div>
    </PageTransition>
  )
}
