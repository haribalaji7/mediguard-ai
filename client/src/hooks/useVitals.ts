import { useCallback } from 'react'
import { useHealthStore } from '../store/healthStore'
import { generateId } from '../lib/utils'
import type { VitalRecord } from '../types'

export function useVitals(patientId = 'user-001') {
  const { vitals, addVital } = useHealthStore()

  const recordVital = useCallback((data: Omit<VitalRecord, '_id' | 'patientId' | 'date'>) => {
    const newVital: VitalRecord = {
      _id: generateId(),
      patientId,
      ...data,
      date: new Date().toISOString(),
    }
    addVital(newVital)
    return newVital
  }, [patientId, addVital])

  const latestVital = vitals.length > 0 ? vitals[vitals.length - 1] : null

  return { vitals, recordVital, latestVital }
}
