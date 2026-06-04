import { useState } from 'react'
import { motion } from 'framer-motion'
import { Package, Search, AlertTriangle, TrendingDown, TrendingUp, Plus, ArrowDownToLine, ArrowUpFromLine, Pill, Syringe, Thermometer, Droplets } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { Input } from '../components/ui/Input'
import { useUiStore } from '../store/uiStore'
import { useAuthStore } from '../store/authStore'
import { useInventoryRequestStore } from '../store/inventoryRequestStore'


type InventoryItem = {
  id: string
  name: string
  category: 'medicine' | 'vaccine' | 'equipment' | 'consumable'
  stock: number
  minStock: number
  unit: string
  expiresIn: string
  lastRestocked: string
}

const inventoryData: InventoryItem[] = [
  { id: 'i1', name: 'Paracetamol 500mg', category: 'medicine', stock: 240, minStock: 100, unit: 'tablets', expiresIn: '8 months', lastRestocked: '2026-05-20' },
  { id: 'i2', name: 'ORS Packets', category: 'medicine', stock: 45, minStock: 80, unit: 'packets', expiresIn: '12 months', lastRestocked: '2026-04-15' },
  { id: 'i3', name: 'BCG Vaccine', category: 'vaccine', stock: 18, minStock: 30, unit: 'vials', expiresIn: '3 months', lastRestocked: '2026-05-01' },
  { id: 'i4', name: 'Polio Drops (OPV)', category: 'vaccine', stock: 120, minStock: 50, unit: 'doses', expiresIn: '6 months', lastRestocked: '2026-05-28' },
  { id: 'i5', name: 'Digital Thermometer', category: 'equipment', stock: 8, minStock: 5, unit: 'units', expiresIn: 'N/A', lastRestocked: '2026-03-10' },
  { id: 'i6', name: 'Blood Glucose Strips', category: 'consumable', stock: 12, minStock: 50, unit: 'strips', expiresIn: '4 months', lastRestocked: '2026-04-20' },
  { id: 'i7', name: 'Iron + Folic Acid', category: 'medicine', stock: 300, minStock: 100, unit: 'tablets', expiresIn: '10 months', lastRestocked: '2026-05-25' },
  { id: 'i8', name: 'Surgical Gloves', category: 'consumable', stock: 150, minStock: 200, unit: 'pairs', expiresIn: '24 months', lastRestocked: '2026-05-15' },
  { id: 'i9', name: 'Tetanus Toxoid', category: 'vaccine', stock: 35, minStock: 20, unit: 'vials', expiresIn: '5 months', lastRestocked: '2026-05-10' },
  { id: 'i10', name: 'BP Monitor (Manual)', category: 'equipment', stock: 3, minStock: 3, unit: 'units', expiresIn: 'N/A', lastRestocked: '2026-02-20' },
]

const categoryIcons: Record<string, React.ElementType> = {
  medicine: Pill,
  vaccine: Syringe,
  equipment: Thermometer,
  consumable: Droplets,
}

const categoryColors: Record<string, string> = {
  medicine: 'bg-primary/15 text-primary',
  vaccine: 'bg-accent/15 text-accent',
  equipment: 'bg-warning/15 text-warning',
  consumable: 'bg-danger/15 text-danger',
}

export default function WorkerInventory() {
  const { addToast } = useUiStore()
  const { user } = useAuthStore()
  const { addRequest } = useInventoryRequestStore()
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState<'all' | 'medicine' | 'vaccine' | 'equipment' | 'consumable'>('all')
  const [additionalItems, setAdditionalItems] = useState('')
  const [urgencyNotes, setUrgencyNotes] = useState('');
  const [showRestock, setShowRestock] = useState(false);

  const lowStock = inventoryData.filter(i => i.stock < i.minStock)
  const filtered = inventoryData
    .filter(i => catFilter === 'all' || i.category === catFilter)
    .filter(i => i.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-6">

        {/* Hero Header */}
        <div className="relative mb-8 p-6 sm:p-8 rounded-[2rem] bg-gradient-to-br from-bg-card/80 to-bg-card/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,184,148,0.1)] overflow-hidden">
          <div className="absolute top-0 left-0 w-[350px] h-[350px] bg-warning/10 rounded-full blur-[80px] -translate-y-1/3 -translate-x-1/4 pointer-events-none animate-pulse-slow" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-warning to-accent-gold p-[2px] shadow-[0_0_20px_rgba(253,203,110,0.3)]">
                <div className="w-full h-full bg-bg-card/90 rounded-2xl flex items-center justify-center">
                  <Package size={28} className="text-warning" />
                </div>
              </div>
              <div>
                <h1 className="font-display text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-warning to-accent-gold">
                  Medical Inventory
                </h1>
                <p className="text-text-secondary font-medium mt-0.5">Track supplies, vaccines & equipment across your facility</p>
              </div>
            </div>
            <div className="flex gap-3">
              {lowStock.length > 0 && (
                <Badge variant="emergency" pulse>
                  <AlertTriangle size={14} className="mr-1" /> {lowStock.length} Low Stock
                </Badge>
              )}
              <Button size="lg" className="shadow-[0_0_20px_rgba(253,203,110,0.25)] bg-warning hover:bg-warning/90 border-warning text-white" onClick={() => setShowRestock(true)}>
                <ArrowDownToLine size={18} /> Restock Request
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Items', value: inventoryData.length.toString(), icon: Package, color: 'from-primary to-accent', trend: null },
            { label: 'Low Stock', value: lowStock.length.toString(), icon: TrendingDown, color: 'from-danger to-warning', trend: 'critical' },
            { label: 'Well Stocked', value: (inventoryData.length - lowStock.length).toString(), icon: TrendingUp, color: 'from-success to-primary', trend: 'good' },
            { label: 'Categories', value: '4', icon: Pill, color: 'from-accent to-primary', trend: null },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="relative overflow-hidden border-white/10 bg-bg-card/60 backdrop-blur-md">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`} />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-extrabold font-display text-text-primary">{stat.value}</p>
                    <p className="text-sm font-semibold text-text-primary mt-1">{stat.label}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.trend === 'critical' ? 'bg-danger/15 text-danger' : stat.trend === 'good' ? 'bg-success/15 text-success' : 'bg-primary/15 text-primary'}`}>
                    <stat.icon size={20} />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Search + Category Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search medicines, vaccines, equipment..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-bg-card/50 backdrop-blur-md border border-white/20 text-text-primary placeholder:text-text-secondary/60 focus:border-primary/50 focus:outline-none transition-colors text-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {(['all', 'medicine', 'vaccine', 'equipment', 'consumable'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setCatFilter(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                  catFilter === cat ? 'bg-primary text-white shadow-glow' : 'bg-bg-card border border-border text-text-secondary hover:border-primary/50'
                }`}
              >
                {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Inventory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {filtered.map((item, i) => {
            const Icon = categoryIcons[item.category]
            const isLow = item.stock < item.minStock
            const stockPercent = Math.min(100, (item.stock / item.minStock) * 100)
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04, type: 'spring', stiffness: 300, damping: 24 }}
              >
                <Card className={`relative overflow-hidden bg-bg-card/60 backdrop-blur-md border-white/10 hover:shadow-card-hover transition-all ${isLow ? 'ring-1 ring-danger/30' : ''}`}>
                  {isLow && <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-danger to-warning animate-pulse" />}
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${categoryColors[item.category]}`}>
                      <Icon size={22} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-text-primary truncate">{item.name}</h3>
                        {isLow && <Badge variant="emergency" size="sm">LOW</Badge>}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-text-secondary mb-3">
                        <span className="capitalize">{item.category}</span>
                        <span>·</span>
                        <span>Expires: {item.expiresIn}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="w-full bg-border/40 rounded-full h-2">
                            <div
                              className={`h-full rounded-full transition-all ${isLow ? 'bg-gradient-to-r from-danger to-warning' : 'bg-gradient-to-r from-primary to-accent'}`}
                              style={{ width: `${stockPercent}%` }}
                            />
                          </div>
                        </div>
                        <span className={`text-sm font-bold ${isLow ? 'text-danger' : 'text-text-primary'}`}>
                          {item.stock} <span className="font-normal text-text-secondary text-xs">/ {item.minStock} {item.unit}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <Card className="text-center py-12 bg-bg-card/60 backdrop-blur-md border-white/10">
            <Package size={48} className="text-text-secondary/30 mx-auto mb-4" />
            <p className="text-text-secondary font-medium">No items match your search.</p>
          </Card>
        )}

        {/* Restock Modal */}
        <Modal isOpen={showRestock} onClose={() => setShowRestock(false)} title="Submit Restock Request" size="lg">
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-warning/10 border border-warning/20 text-sm text-text-primary mb-2">
              <strong className="text-warning">⚠️ Low Stock Items:</strong>
              <ul className="mt-2 space-y-1">
                {lowStock.map(item => (
                  <li key={item.id} className="flex items-center justify-between">
                    <span>{item.name}</span>
                    <span className="text-danger font-semibold">{item.stock} / {item.minStock} {item.unit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Input label="Additional Items (comma separated)" placeholder=" " value={additionalItems} onChange={e => setAdditionalItems(e.target.value)} />
<Input label="Urgency Notes" placeholder=" " value={urgencyNotes} onChange={e => setUrgencyNotes(e.target.value)} />
<Button fullWidth onClick={() => {
  const items = [...lowStock.map(i => i.name), ...additionalItems.split(',').map(s => s.trim()).filter(Boolean)];
  addRequest({
    requester: {
      id: user?.id ?? '',
      name: user?.name ?? '',
      role: user?.role ?? 'worker',
      phone: user?.phone ?? '',
    },
    items,
    notes: urgencyNotes,
  });
  setAdditionalItems('');
  setUrgencyNotes('');
  setShowRestock(false);
  addToast('Restock request submitted to District HQ!', 'success');
}}>
  <ArrowUpFromLine size={18} /> Submit Request
</Button>

          </div>
        </Modal>
      </div>
    </PageTransition>
  )
}
