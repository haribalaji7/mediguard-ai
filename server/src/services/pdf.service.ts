export function generateHealthSummaryPdf(patientData: Record<string, unknown>): Buffer {
  const lines = [
    'MediGuard AI - Health Summary Report',
    '================================',
    '',
    `Patient: ${patientData.name || 'Unknown'}`,
    `Generated: ${new Date().toLocaleDateString('en-IN')}`,
    '',
    '--- Screening Results ---',
  ]

  if (patientData.screenings && Array.isArray(patientData.screenings)) {
    for (const s of patientData.screenings as Record<string, unknown>[]) {
      lines.push(`Type: ${s.type}, Score: ${s.riskScore}, Level: ${s.riskLevel}`)
    }
  }

  lines.push('', '--- Vitals ---')
  if (patientData.vitals && Array.isArray(patientData.vitals)) {
    for (const v of patientData.vitals as Record<string, unknown>[]) {
      const parts: string[] = []
      if (v.weight) parts.push(`Weight: ${v.weight}kg`)
      if (v.bpSystolic) parts.push(`BP: ${v.bpSystolic}/${v.bpDiastolic}`)
      if (v.glucose) parts.push(`Glucose: ${v.glucose}`)
      lines.push(parts.join(', '))
    }
  }

  lines.push('', 'Disclaimer: This is a computer-generated report.')
  lines.push('Always consult a qualified doctor for medical advice.')

  return Buffer.from(lines.join('\n'))
}
