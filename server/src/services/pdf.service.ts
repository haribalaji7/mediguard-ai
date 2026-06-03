import PDFDocument from 'pdfkit'
import path from 'path'
import fs from 'fs'

/**
 * Generates a health summary PDF for a patient.
 * Note: For Indian language text (Hindi, Tamil, Telugu, Bengali),
 * place a Unicode-capable font (e.g., NotoSans-Regular.ttf from
 * https://fonts.google.com/noto/specimen/Noto+Sans) in server/assets/fonts/
 * and it will be used automatically.
 */
export function generateHealthSummaryPdf(patientData: Record<string, unknown>): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    try {
      const doc = new PDFDocument()
      const chunks: Uint8Array[] = []

      // Register Unicode font if available (for Indian language support)
      const fontPath = path.resolve(__dirname, '../../assets/fonts/NotoSans-Regular.ttf')
      if (fs.existsSync(fontPath)) {
        doc.registerFont('NotoSans', fontPath)
        doc.font('NotoSans')
      }
      
      doc.on('data', (chunk) => {
        chunks.push(chunk)
      })
      
      doc.on('end', () => {
        resolve(Buffer.concat(chunks))
      })
      
      doc.fontSize(20).text('MediGuard AI - Health Summary Report', { align: 'center' })
      doc.moveDown()
      
      doc.fontSize(14).text(`Patient: ${patientData.name || 'Unknown'}`)
      doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`)
      doc.moveDown()
      
      doc.fontSize(16).text('--- Screening Results ---', { underline: true })
      if (patientData.screenings && Array.isArray(patientData.screenings)) {
        for (const s of patientData.screenings as Record<string, unknown>[]) {
          doc.fontSize(12).text(`Type: ${s.type}, Score: ${s.riskScore}, Level: ${s.riskLevel}`)
        }
      }
      
      doc.moveDown()
      doc.fontSize(16).text('--- Vitals ---', { underline: true })
      if (patientData.vitals && Array.isArray(patientData.vitals)) {
        for (const v of patientData.vitals as Record<string, unknown>[]) {
          const parts: string[] = []
          if (v.weight) parts.push(`Weight: ${v.weight}kg`)
          if (v.bpSystolic) parts.push(`BP: ${v.bpSystolic}/${v.bpDiastolic}`)
          if (v.glucose) parts.push(`Glucose: ${v.glucose}`)
          if (parts.length > 0) {
            doc.fontSize(12).text(parts.join(', '))
          }
        }
      }
      
      doc.moveDown()
      doc.fontSize(12).text('Disclaimer: This is a computer-generated report.')
      doc.text('Always consult a qualified doctor for medical advice.')
      
      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}
