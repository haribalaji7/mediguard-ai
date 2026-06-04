import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { VitalRecord } from '../../types'

interface VitalChartProps {
  vitals: VitalRecord[]
  dataKey: 'weight' | 'bpSystolic' | 'bpDiastolic' | 'glucose' | 'heartRate'
  label: string
  unit: string
  color?: string
}

export function VitalChart({ vitals, dataKey, label, unit, color = '#00B894' }: VitalChartProps) {
  // Sort vitals by date ascending so progress flows left to right
  const sortedVitals = [...vitals].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const data = sortedVitals.map((v) => ({
    date: new Date(v.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    value: v[dataKey],
    bpSystolic: v.bpSystolic,
    bpDiastolic: v.bpDiastolic,
    weight: v.weight,
    glucose: v.glucose,
    heartRate: v.heartRate
  }))

  const isBP = dataKey === 'bpSystolic' || dataKey === 'bpDiastolic'

  const filteredData = data.filter(d => isBP ? (d.bpSystolic != null && d.bpDiastolic != null) : d.value != null)

  if (filteredData.length === 0) {
    return (
      <div className="text-center py-8 text-text-secondary text-sm">
        No {label} data recorded yet. Start tracking your vitals!
      </div>
    )
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0.0}/>
            </linearGradient>
            {isBP && (
              <>
                <linearGradient id="colorSystolic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorDiastolic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0}/>
                </linearGradient>
              </>
            )}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
            axisLine={{ stroke: 'var(--border)' }}
            tickLine={{ stroke: 'var(--border)' }}
          />
          <YAxis 
            tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} 
            unit={unit}
            axisLine={{ stroke: 'var(--border)' }}
            tickLine={{ stroke: 'var(--border)' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              fontSize: '13px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            }}
          />
          <Legend 
            verticalAlign="top" 
            height={36} 
            iconType="circle"
            wrapperStyle={{ fontSize: '12px', paddingBottom: '10px' }} 
          />
          {isBP ? (
            <>
              <Area
                name="Systolic BP (High)"
                type="monotone"
                dataKey="bpSystolic"
                stroke="#EF4444"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorSystolic)"
                dot={{ fill: '#EF4444', strokeWidth: 1.5, r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Area
                name="Diastolic BP (Low)"
                type="monotone"
                dataKey="bpDiastolic"
                stroke="#3B82F6"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorDiastolic)"
                dot={{ fill: '#3B82F6', strokeWidth: 1.5, r: 3 }}
                activeDot={{ r: 5 }}
              />
            </>
          ) : (
            <Area
              name={label}
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorValue)"
              dot={{ fill: color, strokeWidth: 1.5, r: 3 }}
              activeDot={{ r: 5 }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
