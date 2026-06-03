import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { VitalRecord } from '../../types'

interface VitalChartProps {
  vitals: VitalRecord[]
  dataKey: 'weight' | 'bpSystolic' | 'bpDiastolic' | 'glucose' | 'heartRate'
  label: string
  unit: string
  color?: string
}

export function VitalChart({ vitals, dataKey, label, unit, color = '#00B894' }: VitalChartProps) {
  const data = vitals
    .filter((v) => v[dataKey] != null)
    .map((v) => ({ date: new Date(v.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), value: v[dataKey] }))

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-text-secondary text-sm">
        No {label} data recorded yet. Start tracking your vitals!
      </div>
    )
  }

  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
          <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} unit={unit} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              fontSize: '13px',
            }}
            formatter={(value: number) => [`${value}${unit}`, label]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.5}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
