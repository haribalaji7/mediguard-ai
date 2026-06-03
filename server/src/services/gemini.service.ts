import { GoogleGenerativeAI } from '@google/generative-ai'

const SYSTEM_PROMPT = `You are MediGuard AI's AI health assistant designed for rural India. 
Analyze the symptoms provided and return a JSON response with:
{
  possible_conditions: [{name, likelihood_percent, description}],
  urgency_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY',
  recommended_action: string (plain language, no jargon),
  home_care_tips: string[],
  when_to_seek_help: string,
  disclaimer: string
}
Use simple language understandable to someone with Class 5 education.
Do NOT use medical jargon. Always recommend seeing a real doctor.
Return ONLY valid JSON, no markdown formatting.`

function getFallbackAnalysis(symptoms: { bodyArea: string; symptomType: string; duration: string; severity: number; description: string }) {
  const { bodyArea, symptomType, severity, duration } = symptoms
  let urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY' = 'LOW'
  if (severity >= 8) urgency = 'EMERGENCY'
  else if (severity >= 6) urgency = 'HIGH'
  else if (severity >= 4) urgency = 'MEDIUM'

  const isLongDuration = duration.toLowerCase().includes('week') || duration.toLowerCase().includes('month')

  return {
    possible_conditions: [
      { name: `${bodyArea} concern`, likelihood_percent: 50, description: `You reported ${symptomType?.toLowerCase() || 'symptoms'} in the ${bodyArea?.toLowerCase() || 'body'}.` },
      { name: 'General health issue', likelihood_percent: 30, description: 'Common health condition that may require medical attention.' },
    ],
    urgency_level: isLongDuration ? 'MEDIUM' : urgency,
    recommended_action: urgency === 'EMERGENCY' ? 'Visit the nearest hospital immediately.' : urgency === 'HIGH' ? 'Visit your PHC within 24 hours.' : urgency === 'MEDIUM' ? 'Consult your doctor within this week.' : 'Monitor symptoms. Rest and stay hydrated.',
    home_care_tips: ['Get plenty of rest', 'Drink ORS solution or clean water', 'Eat light, easily digestible food', 'Avoid heavy physical work'],
    when_to_seek_help: 'If symptoms worsen or do not improve in 3 days, visit a doctor.',
    disclaimer: 'This is an AI-based preliminary assessment and NOT a medical diagnosis. Please consult a qualified doctor.',
  }
}

export async function analyzeSymptoms(symptoms: { bodyArea: string; symptomType: string; duration: string; severity: number; description: string }) {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    console.log('GEMINI_API_KEY not set, using fallback analysis')
    return getFallbackAnalysis(symptoms)
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `${SYSTEM_PROMPT}\n\nSymptoms: ${JSON.stringify(symptoms)}`
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim()
    return JSON.parse(cleaned)
  } catch (error) {
    console.error('Gemini API error, using fallback:', error)
    return getFallbackAnalysis(symptoms)
  }
}

export async function assessRisk(patientData: Record<string, unknown>) {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    const yesCount = Object.values(patientData).filter((v) => v === 'Yes' || v === 'yes').length
    const total = Object.keys(patientData).length || 1
    const score = Math.round((yesCount / total) * 100)
    return { riskScore: score, riskLevel: score > 60 ? 'high' : score > 30 ? 'medium' : 'low' }
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `Analyze this health screening data and return a JSON with riskScore (0-100) and riskLevel (low/medium/high/emergency): ${JSON.stringify(patientData)}`
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim()
    return JSON.parse(cleaned)
  } catch (error) {
    console.error('Gemini risk assessment error, using fallback:', error)
    return { riskScore: 30, riskLevel: 'medium' }
  }
}
