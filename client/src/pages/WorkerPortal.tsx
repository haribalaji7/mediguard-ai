import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Users, Activity, BarChart3, AlertTriangle, AlertOctagon, Download, Plus, Trash2, Stethoscope, Phone, Mic } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Modal } from '../components/ui/Modal'

import { useDebounce } from '../hooks/useDebounce'
import { useUiStore } from '../store/uiStore'
import { useCommunityStore } from '../store/communityStore'
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
  const { outbreaks, updateOutbreakStatus } = useCommunityStore()
  const [activeTab, setActiveTab] = useState<'patients' | 'analytics' | 'bulk' | 'alerts' | 'outbreaks'>('patients')
  const [search, setSearch] = useState('')
  const [showBulk, setShowBulk] = useState(false)
  const [bulkRows, setBulkRows] = useState([{ name: '', age: '', village: '', symptoms: '' }])
  const debouncedSearch = useDebounce(search, 200)

  // Call & Patient record states
  const [selectedPatient, setSelectedPatient] = useState<typeof mockPatients[number] | null>(null)
  const [activeCall, setActiveCall] = useState<{ name: string; phone: string } | null>(null)
  const [callDuration, setCallDuration] = useState<number>(0)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (activeCall) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    } else {
      setCallDuration(0)
      setIsMuted(false)
    }
    return () => clearInterval(interval)
  }, [activeCall])

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  const filteredPatients = mockPatients.filter((p) =>
    p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || p.village.toLowerCase().includes(debouncedSearch.toLowerCase()),
  )

  const tabs = [
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
    { id: 'outbreaks', label: 'Outbreak Reports', icon: AlertOctagon },
  ]

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-6">
        <div className="relative mb-8 p-6 sm:p-8 rounded-[2rem] bg-gradient-to-br from-bg-card/80 to-bg-card/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,184,148,0.1)] overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none animate-pulse-slow" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/3 pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }} />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-accent p-[2px] shadow-glow">
                <div className="w-full h-full bg-bg-card/90 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Stethoscope size={32} className="text-primary animate-pulse" />
                </div>
              </div>
              <div>
                <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  Command Center
                </h1>
                <p className="text-text-secondary font-medium mt-1">
                  Good Morning. You have <span className="text-danger font-bold">2 high-risk alerts</span> requiring attention today.
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" className="bg-bg-base/50 backdrop-blur-md border-white/20 hover:border-primary/50" onClick={() => setActiveTab('alerts')}>
                <AlertTriangle size={18} className="text-warning mr-2" /> View Alerts
              </Button>
              <Button size="lg" className="shadow-glow" onClick={() => setShowBulk(true)}>
                <Plus size={18} /> Bulk Entry
              </Button>
            </div>
          </div>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
              <Input 
                label="Search Patients"
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                placeholder="Search patients by name or village..." 
                className="pl-12 py-3 rounded-2xl bg-bg-card/50 backdrop-blur-md border-white/20 shadow-sm focus:bg-bg-card transition-colors"
                autoComplete="off"
              />
            </div>
            
            <div className="bg-bg-card/40 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden shadow-card">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-bg-card/60 backdrop-blur-md border-b border-white/10">
                    <tr className="text-left text-text-secondary">
                      <th className="py-4 px-6 font-semibold uppercase tracking-wider text-xs">Patient Profile</th>
                      <th className="py-4 px-6 font-semibold uppercase tracking-wider text-xs">Village</th>
                      <th className="py-4 px-6 font-semibold uppercase tracking-wider text-xs">Last Screening</th>
                      <th className="py-4 px-6 font-semibold uppercase tracking-wider text-xs">Risk Level</th>
                      <th className="py-4 px-6 font-semibold uppercase tracking-wider text-xs text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.length === 0 ? (
                      <tr><td colSpan={5} className="text-center py-12 text-text-secondary">No patients found</td></tr>
                    ) : (
                      filteredPatients.map((p, i) => (
                        <motion.tr 
                          key={p.id} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05, type: 'spring', stiffness: 300, damping: 24 }}
                          className="border-b border-border/30 hover:bg-white/5 transition-colors group"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md ${
                                p.riskLevel === 'high' || p.riskLevel === 'emergency' ? 'bg-gradient-to-br from-danger to-warning' : 'bg-gradient-to-br from-primary to-accent'
                              }`}>
                                {p.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-text-primary font-bold">{p.name}</p>
                                <p className="text-xs text-text-secondary">Age: {p.age}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-text-secondary font-medium">{p.village}</td>
                          <td className="py-4 px-6 text-text-secondary">{p.lastScreening}</td>
                          <td className="py-4 px-6">
                            <Badge variant={p.riskLevel} pulse={p.riskLevel === 'emergency' || p.riskLevel === 'high'}>
                              {p.riskLevel.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              onClick={() => setSelectedPatient(p)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity bg-bg-card/80 backdrop-blur border-border"
                            >
                              View Profile
                            </Button>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
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
                          <div className="w-full bg-border/40 rounded-full h-2">
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
                    <Button variant="primary" size="sm" onClick={() => setActiveCall({ name: p.name, phone: p.phone })}>Contact Patient</Button>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedPatient(p)}>View Record</Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === 'outbreaks' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display text-lg font-bold text-text-primary">Community Outbreak Reports</h2>
              <Badge variant="emergency">{outbreaks.filter(o => o.status === 'pending').length} Pending Review</Badge>
            </div>
            {outbreaks.length === 0 ? (
              <Card className="text-center py-8">
                <p className="text-text-secondary">No outbreak reports submitted yet.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {outbreaks.map((ob) => (
                  <Card
                    key={ob._id}
                    className="relative overflow-hidden border border-border hover:shadow-card transition-all"
                  >
                    <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                      ob.status === 'pending' ? 'bg-danger' : ob.status === 'reviewed' ? 'bg-warning' : 'bg-success'
                    }`} />
                    
                    <div className="flex items-start justify-between gap-4 pt-2">
                      <div>
                        <h3 className="font-semibold text-base text-text-primary">{ob.condition}</h3>
                        <p className="text-sm text-text-secondary mt-1">Village: <span className="font-medium text-text-primary">{ob.village}</span></p>
                        <p className="text-xs text-text-secondary mt-0.5">Reported date: {ob.date}</p>
                        <p className="text-[11px] text-text-secondary italic mt-1">Submitted: {new Date(ob.reportedAt).toLocaleString()}</p>
                      </div>
                      
                      <div className="text-right flex flex-col items-end gap-2">
                        <Badge variant={ob.cases >= 10 ? 'emergency' : 'medium'}>
                          {ob.cases} Cases
                        </Badge>
                        <Badge variant={ob.status === 'pending' ? 'emergency' : ob.status === 'reviewed' ? 'medium' : 'success'}>
                          {ob.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-border/50">
                      <span className="text-xs text-text-secondary">Mark as:</span>
                      <div className="flex gap-1.5">
                        {ob.status !== 'reviewed' && (
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            className="text-xs py-1"
                            onClick={() => {
                              updateOutbreakStatus(ob._id, 'reviewed');
                              addToast('Report status updated to Under Review.', 'info');
                            }}
                          >
                            Reviewing
                          </Button>
                        )}
                        {ob.status !== 'resolved' && (
                          <Button 
                            variant="primary" 
                            size="sm" 
                            className="text-xs py-1 bg-success hover:bg-success-dark text-white border-success"
                            onClick={() => {
                              updateOutbreakStatus(ob._id, 'resolved');
                              addToast('Report status updated to Resolved.', 'success');
                            }}
                          >
                            Resolve
                          </Button>
                        )}
                        {ob.status === 'resolved' && (
                          <span className="text-xs font-semibold text-success flex items-center gap-1">
                            ✓ Action Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        <Modal isOpen={showBulk} onClose={() => setShowBulk(false)} title="Bulk Screening Entry" size="xl">
          <div className="space-y-4">
            {bulkRows.map((row, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-end p-3 rounded-xl bg-border/20">
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

        {/* Call Modal */}
        <Modal isOpen={activeCall !== null} onClose={() => { setActiveCall(null); setCallDuration(0); }} title="Outgoing Voice Call" size="sm">
          {activeCall && (
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center animate-ping absolute inset-0 opacity-40" />
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center relative">
                  <Phone size={32} className="text-primary" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-text-primary">{activeCall.name}</h3>
                <p className="text-sm text-text-secondary mt-1">{activeCall.phone}</p>
                <p className="text-xs text-primary font-semibold tracking-wide uppercase mt-2 animate-pulse">
                  {callDuration === 0 ? 'Connecting via Telephony...' : `On Call: ${formatDuration(callDuration)}`}
                </p>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setIsMuted(!isMuted)} 
                  className={`p-3 rounded-full border transition-all ${
                    isMuted ? 'bg-warning/20 border-warning text-warning' : 'bg-bg-card border-border text-text-secondary hover:border-primary/50'
                  }`}
                  title="Mute"
                >
                  <Mic size={18} />
                </button>
                <button 
                  onClick={() => {
                    const finalDuration = formatDuration(callDuration);
                    setActiveCall(null);
                    addToast(`Call ended. Duration: ${finalDuration}`, 'info');
                    setCallDuration(0);
                  }} 
                  className="p-3 rounded-full bg-danger hover:bg-danger-dark text-white border-danger transition-all shadow-lg shadow-danger/20"
                  title="Hang Up"
                >
                  <Phone size={18} className="rotate-135" />
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Patient Health Record Modal */}
        <Modal isOpen={selectedPatient !== null} onClose={() => setSelectedPatient(null)} title={`Patient Health Record - ${selectedPatient?.name || ''}`} size="lg">
          {selectedPatient && (
            <div className="space-y-4">
              <div className="flex justify-between items-start border-b border-border/50 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-text-primary">{selectedPatient.name}</h3>
                  <p className="text-sm text-text-secondary">Age: {selectedPatient.age} · Village: {selectedPatient.village}</p>
                  <p className="text-xs text-text-secondary mt-1">Phone: {selectedPatient.phone}</p>
                </div>
                <Badge variant={selectedPatient.riskLevel} pulse>
                  {selectedPatient.riskLevel.toUpperCase()} RISK
                </Badge>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-text-primary uppercase tracking-wider">Screening History</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <Card className="p-3 bg-bg-card border border-border">
                    <span className="text-xs text-text-secondary block">Blood Pressure</span>
                    <span className="text-base font-bold text-text-primary">
                      {selectedPatient.riskLevel === 'high' || selectedPatient.riskLevel === 'emergency' ? '145/95 mmHg' : '120/80 mmHg'}
                    </span>
                    <Badge variant={selectedPatient.riskLevel === 'high' || selectedPatient.riskLevel === 'emergency' ? 'high' : 'success'} size="sm" className="mt-1">
                      {selectedPatient.riskLevel === 'high' || selectedPatient.riskLevel === 'emergency' ? 'Prehypertension' : 'Normal'}
                    </Badge>
                  </Card>

                  <Card className="p-3 bg-bg-card border border-border">
                    <span className="text-xs text-text-secondary block">Random Blood Sugar</span>
                    <span className="text-base font-bold text-text-primary">
                      {selectedPatient.riskLevel === 'emergency' ? '280 mg/dL' : selectedPatient.riskLevel === 'high' ? '180 mg/dL' : '110 mg/dL'}
                    </span>
                    <Badge variant={selectedPatient.riskLevel === 'emergency' ? 'emergency' : selectedPatient.riskLevel === 'high' ? 'high' : 'success'} size="sm" className="mt-1">
                      {selectedPatient.riskLevel === 'emergency' ? 'Critical (Diabetic)' : selectedPatient.riskLevel === 'high' ? 'Elevated' : 'Normal'}
                    </Badge>
                  </Card>

                  <Card className="p-3 bg-bg-card border border-border">
                    <span className="text-xs text-text-secondary block">Hemoglobin (Hb)</span>
                    <span className="text-base font-bold text-text-primary">
                      {selectedPatient.riskLevel === 'high' ? '9.5 g/dL' : '13.2 g/dL'}
                    </span>
                    <Badge variant={selectedPatient.riskLevel === 'high' ? 'high' : 'success'} size="sm" className="mt-1">
                      {selectedPatient.riskLevel === 'high' ? 'Mild Anemia' : 'Normal'}
                    </Badge>
                  </Card>

                  <Card className="p-3 bg-bg-card border border-border">
                    <span className="text-xs text-text-secondary block font-medium">Last Screening Date</span>
                    <span className="text-sm font-semibold text-text-primary mt-1 block">
                      {selectedPatient.lastScreening}
                    </span>
                  </Card>
                </div>
              </div>

              <div className="pt-3 border-t border-border/50 flex gap-2">
                <Button variant="primary" fullWidth onClick={() => { setSelectedPatient(null); addToast('Report generated successfully!', 'success'); }}>
                  Download PDF Report
                </Button>
                <Button variant="secondary" onClick={() => setSelectedPatient(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </PageTransition>
  )
}
