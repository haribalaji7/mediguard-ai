import type { User, ScreeningResult, VitalRecord, Article, HealthCamp, Hospital, GovernmentScheme, SuccessStory, Doctor, ChatMessage, SymptomAnalysis, AnalyticsData } from '../types'

export const mockUser: User = {
  _id: 'user-001',
  name: 'Sita Devi',
  phone: '9876543210',
  role: 'patient',
  age: 34,
  gender: 'female',
  village: 'Ramnagar',
  district: 'Sitapur',
  state: 'Uttar Pradesh',
  createdAt: '2025-01-15T00:00:00Z',
}

export const mockWorker: User = {
  _id: 'worker-001',
  name: 'Anita Sharma',
  phone: '9876543211',
  role: 'worker',
  workerId: 'ASHA-UP-4521',
  district: 'Sitapur',
  state: 'Uttar Pradesh',
  createdAt: '2024-06-01T00:00:00Z',
}

export const mockScreenings: ScreeningResult[] = [
  {
    _id: 'scr-001',
    patientId: 'user-001',
    type: 'diabetes',
    answers: { age: 34, bmi: 24.5, waist: 32, activity: 'moderate', diet: 'balanced', familyHistory: 'No' },
    riskScore: 18,
    riskLevel: 'low',
    resultData: { message: 'Low risk of developing type 2 diabetes within 10 years.' },
    createdAt: '2026-05-20T00:00:00Z',
  },
  {
    _id: 'scr-002',
    patientId: 'user-001',
    type: 'hypertension',
    answers: { saltIntake: 'moderate', exercise: 'weekly', stress: 'sometimes', sleep: 7, familyHistory: 'No' },
    riskScore: 25,
    riskLevel: 'low',
    resultData: { systolic: 118, diastolic: 76, message: 'Blood pressure is in normal range.' },
    createdAt: '2026-05-18T00:00:00Z',
  },
  {
    _id: 'scr-003',
    patientId: 'user-001',
    type: 'anemia',
    answers: { fatigue: 'Yes', pallor: 'No', breathlessness: 'No', coldHands: 'Yes', brittleNails: 'No' },
    riskScore: 40,
    riskLevel: 'medium',
    resultData: { message: 'Mild anemia suspected. Consider iron-rich diet and consult PHC.' },
    createdAt: '2026-05-10T00:00:00Z',
  },
]

export const mockVitals: VitalRecord[] = [
  { _id: 'vit-001', patientId: 'user-001', weight: 62, bpSystolic: 118, bpDiastolic: 76, glucose: 95, heartRate: 72, date: '2026-05-20T00:00:00Z' },
  { _id: 'vit-002', patientId: 'user-001', weight: 63, bpSystolic: 122, bpDiastolic: 80, glucose: 102, heartRate: 74, date: '2026-04-20T00:00:00Z' },
  { _id: 'vit-003', patientId: 'user-001', weight: 61, bpSystolic: 116, bpDiastolic: 74, glucose: 98, heartRate: 70, date: '2026-03-20T00:00:00Z' },
  { _id: 'vit-004', patientId: 'user-001', weight: 64, bpSystolic: 120, bpDiastolic: 78, glucose: 105, heartRate: 76, date: '2026-02-20T00:00:00Z' },
]

export const mockArticles: Article[] = [
  { _id: 'art-001', title: 'Understanding Diabetes: Signs and Prevention', content: 'Diabetes is a condition where blood sugar levels rise...', category: 'chronic-disease', language: 'en', readTime: 5, imageUrl: '/images/art-001.png' },
  { _id: 'art-002', title: 'Clean Water, Healthy Life', content: 'Access to clean drinking water is essential for preventing waterborne diseases...', category: 'hygiene', language: 'en', readTime: 3, imageUrl: '/images/art-002.png' },
  { _id: 'art-003', title: 'Nutrition for Pregnant Women', content: 'Proper nutrition during pregnancy is crucial for both mother and baby...', category: 'mother-child', language: 'en', readTime: 7, imageUrl: '/images/art-003.png' },
  { _id: 'art-004', title: 'Managing Stress in Daily Life', content: 'Stress can affect your physical and mental health. Here are simple ways to manage it...', category: 'mental-health', language: 'en', readTime: 4, imageUrl: '/images/art-004.png' },
  { _id: 'art-005', title: 'आहार और पोषण के टिप्स', content: 'अच्छे स्वास्थ्य के लिए संतुलित आहार जरूरी है...', category: 'nutrition', language: 'hi', readTime: 6, imageUrl: '/images/art-005.png' },
  { _id: 'art-006', title: 'TB: Symptoms and Treatment', content: 'Tuberculosis is a bacterial infection that mainly affects the lungs...', category: 'chronic-disease', language: 'en', readTime: 8, imageUrl: '/images/art-006.png' },
]

export const mockCamps: HealthCamp[] = [
  { _id: 'camp-001', title: 'Free Health Checkup Camp', date: '2026-06-15T09:00:00Z', location: 'Ramnagar Community Center', services: ['Blood Pressure', 'Blood Sugar', 'BMI', 'Eye Checkup'], description: 'Free general health checkup for all villagers.', organizer: 'PHC Sitapur', lat: 27.6050, lng: 80.8050 },
  { _id: 'camp-002', title: 'Mother & Child Health Camp', date: '2026-06-22T10:00:00Z', location: 'Ramnagar Primary School', services: ['Antenatal Checkup', 'Child Vaccination', 'Nutrition Advice'], description: 'Special camp for pregnant women and children under 5.', organizer: 'ICDS Department', lat: 27.6120, lng: 80.7980 },
  { _id: 'camp-003', title: 'Eye & Dental Checkup Camp', date: '2026-07-05T09:00:00Z', location: 'Bhimavaram PHC', services: ['Eye Test', 'Dental Checkup', 'Glass Prescription'], description: 'Free eye and dental checkup camp.', organizer: 'District Health Department', lat: 16.5449, lng: 81.5222 },
]

export const mockHospitals: Hospital[] = [
  { _id: 'hosp-001', name: 'Ramnagar Primary Health Center (PHC)', location: 'Ramnagar Main Road', type: 'Primary Health Center', lat: 27.6010, lng: 80.8020, phone: '05862-234567', availableServices: ['General OPD', 'Maternal Care', 'Vaccination', 'Basic Diagnostics'] },
  { _id: 'hosp-002', name: 'Sitapur District Hospital', location: 'District Hospital Road, Sitapur', type: 'District Hospital', lat: 27.5700, lng: 80.6800, phone: '05862-220011', availableServices: ['Emergency Care', 'Inpatient Ward', 'Specialized Surgery', 'Advanced Diagnostics'] },
  { _id: 'hosp-003', name: 'Bhimavaram General Hospital', location: 'Bhimavaram Bypass Road', type: 'General Hospital', lat: 16.5400, lng: 81.5200, phone: '08816-224466', availableServices: ['Emergency Care', 'OPD', 'Cardiology', 'Pediatrics'] },
]

export const mockSchemes: GovernmentScheme[] = [
  { _id: 'sch-001', name: 'Ayushman Bharat - PM-JAY', description: 'Health insurance cover of ₹5 lakh per family per year for secondary and tertiary care hospitalization.', eligibility: 'All families listed in SECC database as deprived', benefits: 'Cashless treatment at empaneled hospitals', applyUrl: 'https://pmjay.gov.in' },
  { _id: 'sch-002', name: 'Janani Suraksha Yojana', description: 'Cash assistance to pregnant women from Below Poverty Line families for institutional delivery.', eligibility: 'BPL pregnant women, 19+ years', benefits: '₹1400 in rural areas, ₹1000 in urban areas', applyUrl: 'https://nhm.gov.in' },
  { _id: 'sch-003', name: 'PM Jan Aushadhi Yojana', description: 'Provides quality generic medicines at affordable prices through dedicated stores.', eligibility: 'All citizens', benefits: 'Medicines at 50-90% lower prices', applyUrl: 'https://janaushadhi.gov.in' },
  { _id: 'sch-004', name: 'Pradhan Mantri Matru Vandana Yojana', description: 'Cash incentive of ₹5000 for first live birth to compensate for wage loss.', eligibility: 'Pregnant women 19+, first child', benefits: '₹5000 in three installments', applyUrl: 'https://wcd.nic.in' },
]

export const mockStories: SuccessStory[] = [
  { _id: 'st-001', name: 'Rajesh Kumar', village: 'Ramnagar', story: 'MediGuard AI helped me identify early signs of diabetes. I changed my diet and lifestyle. Now my blood sugar is under control without medication.' },
  { _id: 'st-002', name: 'Meena Patel', village: 'Bhimavaram', story: 'I was feeling weak all the time. The AI symptom checker suggested I might be anemic. I visited the PHC and got treatment. Now I feel much better.' },
  { _id: 'st-003', name: 'Sunita Verma', village: 'Sitapur', story: 'During my pregnancy, I used the maternal health check module. It gave me helpful tips and reminded me about vaccinations. My baby is healthy!' },
]

export const mockDoctors: Doctor[] = [
  { _id: 'doc-001', name: 'Dr. Priya Singh', specialty: 'General Medicine', languages: ['Hindi', 'English'], rating: 4.8, availableToday: true },
  { _id: 'doc-002', name: 'Dr. Rajesh Gupta', specialty: 'Pediatrics', languages: ['Hindi', 'English'], rating: 4.6, availableToday: true },
  { _id: 'doc-003', name: 'ASHA Sangeeta Devi', specialty: 'Community Health', languages: ['Hindi', 'Bhojpuri'], rating: 4.9, availableToday: true },
  { _id: 'doc-004', name: 'Dr. Lakshmi Narayan', specialty: 'Gynecology', languages: ['Telugu', 'English'], rating: 4.7, availableToday: false },
]

export const mockChatMessages: ChatMessage[] = [
  { id: 'msg-1', role: 'bot', content: 'Namaste! I am MediGuard AI\'s AI health assistant. I\'m here to help you understand your symptoms. Shall we begin?', timestamp: Date.now() - 300000 },
  { id: 'msg-2', role: 'user', content: 'Yes, I have a headache and fever since 2 days', timestamp: Date.now() - 240000 },
  { id: 'msg-3', role: 'bot', content: 'Thank you. Let me ask you a few questions to understand better. Where exactly is the pain?', timestamp: Date.now() - 180000 },
]

export const mockSymptomAnalysis: SymptomAnalysis = {
  possible_conditions: [
    { name: 'Common Cold / Viral Fever', likelihood_percent: 65, description: 'A viral infection causing runny nose, sore throat, fever and body aches.' },
    { name: 'Sinustis', likelihood_percent: 20, description: 'Inflammation of the sinuses causing headache, facial pressure and congestion.' },
    { name: 'Dengue Fever', likelihood_percent: 10, description: 'A mosquito-borne viral infection causing high fever, severe headache and joint pain.' },
  ],
  urgency_level: 'MEDIUM',
  recommended_action: 'Visit your nearest Primary Health Center (PHC) within 24 hours. Drink plenty of fluids and rest.',
  home_care_tips: ['Take paracetamol for fever (if temperature > 101°F)', 'Drink ORS solution or coconut water to stay hydrated', 'Rest in a cool, ventilated room', 'Eat light, easily digestible food like khichdi or dal rice'],
  when_to_seek_help: 'If fever crosses 103°F, if you have difficulty breathing, or if symptoms worsen after 3 days.',
  disclaimer: 'This is an AI-based preliminary assessment and NOT a medical diagnosis. Please consult a qualified doctor for proper diagnosis and treatment.',
}

export const mockAnalytics: AnalyticsData = {
  totalPatients: 1247,
  totalScreenings: 3892,
  screeningsThisMonth: 342,
  diseaseDistribution: [
    { name: 'Diabetes', value: 35 },
    { name: 'Hypertension', value: 28 },
    { name: 'Anemia', value: 20 },
    { name: 'TB', value: 10 },
    { name: 'Maternal', value: 7 },
  ],
  monthlyScreenings: [
    { month: 'Jan', count: 210 },
    { month: 'Feb', count: 245 },
    { month: 'Mar', count: 280 },
    { month: 'Apr', count: 310 },
    { month: 'May', count: 342 },
    { month: 'Jun', count: 298 },
  ],
  villageData: [
    { village: 'Ramnagar', count: 342, riskLevel: 'medium' },
    { village: 'Bhimavaram', count: 289, riskLevel: 'low' },
    { village: 'Sitapur', count: 198, riskLevel: 'high' },
    { village: 'Lakshmipur', count: 156, riskLevel: 'medium' },
    { village: 'Devendranagar', count: 134, riskLevel: 'low' },
    { village: 'Gopalpur', count: 128, riskLevel: 'emergency' },
  ],
}

export const screeningQuestions = {
  diabetes: [
    { id: 'age', question: 'What is your age?', type: 'number', options: null },
    { id: 'bmi', question: 'What is your BMI? (Weight in kg / Height in m²)', type: 'number', options: null },
    { id: 'waist', question: 'Waist circumference (in inches):', type: 'number', options: null },
    { id: 'activity', question: 'How much physical activity do you get?', type: 'select', options: ['Sedentary (mostly sitting)', 'Light (walking occasionally)', 'Moderate (daily chores + walking)', 'Active (regular exercise)'] },
    { id: 'diet', question: 'How would you describe your diet?', type: 'select', options: ['Mostly fried/oily food', 'Mixed diet', 'Balanced with vegetables', 'Healthy with fruits & vegetables'] },
    { id: 'veggies', question: 'Do you eat vegetables daily?', type: 'select', options: ['Rarely', 'Sometimes', 'Most days', 'Every day'] },
    { id: 'meds', question: 'Are you on any blood pressure medication?', type: 'select', options: ['Yes', 'No'] },
    { id: 'bloodSugar', question: 'Have you ever had high blood sugar?', type: 'select', options: ['Yes', 'No', "Don't know"] },
    { id: 'familyDiabetes', question: 'Has anyone in your immediate family (parents/siblings) had diabetes?', type: 'select', options: ['Yes', 'No', "Don't know"] },
    { id: 'familyHistory', question: 'Has anyone in your extended family had diabetes?', type: 'select', options: ['Yes', 'No', "Don't know"] },
  ],
  hypertension: [
    { id: 'age', question: 'What is your age?', type: 'number', options: null },
    { id: 'saltIntake', question: 'How much salt do you consume?', type: 'select', options: ['Very high (pickles, papad daily)', 'High (salty snacks often)', 'Moderate', 'Low (avoid salt)'] },
    { id: 'exercise', question: 'How often do you exercise?', type: 'select', options: ['Never', 'Once a week', '2-3 times a week', 'Daily'] },
    { id: 'stress', question: 'How often do you feel stressed?', type: 'select', options: ['Always', 'Often', 'Sometimes', 'Rarely'] },
    { id: 'sleep', question: 'How many hours do you sleep daily?', type: 'number', options: null },
    { id: 'smoking', question: 'Do you smoke or use tobacco?', type: 'select', options: ['Yes, regularly', 'Occasionally', 'No', 'Quit'] },
    { id: 'alcohol', question: 'Do you consume alcohol?', type: 'select', options: ['Daily', 'Weekly', 'Occasionally', 'Never'] },
    { id: 'familyBP', question: 'Family history of high BP?', type: 'select', options: ['Yes', 'No', "Don't know"] },
    { id: 'headache', question: 'Do you get frequent headaches?', type: 'select', options: ['Daily', 'Weekly', 'Sometimes', 'Rarely'] },
    { id: 'dizziness', question: 'Do you feel dizzy or lightheaded?', type: 'select', options: ['Often', 'Sometimes', 'Rarely', 'Never'] },
  ],
  tb: [
    { id: 'cough', question: 'Have you had a cough for more than 2 weeks?', type: 'select', options: ['Yes', 'No'] },
    { id: 'fever', question: 'Have you had fever for more than 2 weeks?', type: 'select', options: ['Yes', 'No'] },
    { id: 'nightSweats', question: 'Do you have night sweats (waking up drenched in sweat)?', type: 'select', options: ['Yes', 'No'] },
    { id: 'weightLoss', question: 'Have you lost weight without trying in the last month?', type: 'select', options: ['Yes', 'No'] },
    { id: 'chestPain', question: 'Do you have chest pain or difficulty breathing?', type: 'select', options: ['Yes', 'No'] },
    { id: 'appetite', question: 'Have you lost your appetite?', type: 'select', options: ['Yes', 'No'] },
    { id: 'contact', question: 'Have you been in contact with a known TB patient?', type: 'select', options: ['Yes', 'No', "Don't know"] },
  ],
  anemia: [
    { id: 'fatigue', question: 'Do you feel tired or weak most of the time?', type: 'select', options: ['Yes', 'No'] },
    { id: 'pallor', question: 'Do your palms or inner eyelids look pale?', type: 'select', options: ['Yes', 'No', "Don't know"] },
    { id: 'breathlessness', question: 'Do you feel short of breath after mild activity?', type: 'select', options: ['Yes', 'No'] },
    { id: 'coldHands', question: 'Do your hands and feet feel cold often?', type: 'select', options: ['Yes', 'No'] },
    { id: 'brittleNails', question: 'Are your nails brittle or spoon-shaped?', type: 'select', options: ['Yes', 'No'] },
    { id: 'dizziness', question: 'Do you feel dizzy or lightheaded frequently?', type: 'select', options: ['Yes', 'No'] },
    { id: 'heartbeat', question: 'Do you feel your heart racing or pounding?', type: 'select', options: ['Yes', 'No'] },
    { id: 'headache', question: 'Do you get frequent headaches?', type: 'select', options: ['Yes', 'No'] },
    { id: 'pica', question: 'Do you crave eating non-food items like mud, chalk, or ice?', type: 'select', options: ['Yes', 'No'] },
    { id: 'menstruation', question: 'For women: Is your menstrual bleeding heavy?', type: 'select', options: ['Yes', 'No', 'Not applicable'] },
  ],
  maternal: [
    { id: 'weeks', question: 'How many weeks pregnant are you?', type: 'number', options: null },
    { id: 'age', question: 'What is your age?', type: 'number', options: null },
    { id: 'pregnancyNum', question: 'Which pregnancy is this?', type: 'select', options: ['First', 'Second', 'Third', 'Fourth or more'] },
    { id: 'previousComplications', question: 'Did you have complications in previous pregnancies?', type: 'select', options: ['Yes', 'No', 'First pregnancy'] },
    { id: 'swelling', question: 'Do you have swelling in hands, feet, or face?', type: 'select', options: ['Yes', 'No'] },
    { id: 'headache', question: 'Do you have severe or persistent headaches?', type: 'select', options: ['Yes', 'No'] },
    { id: 'vision', question: 'Have you had blurred vision?', type: 'select', options: ['Yes', 'No'] },
    { id: 'bleeding', question: 'Any vaginal bleeding?', type: 'select', options: ['Yes', 'No'] },
    { id: 'movement', question: 'Is the baby moving normally?', type: 'select', options: ['Yes', 'No', "Don't know"] },
    { id: 'vaccination', question: 'Have you received your tetanus vaccination?', type: 'select', options: ['Yes', 'No', "Don't know"] },
  ],
}

export const healthTips = [
  { id: 'tip-1', title: 'Wash your hands with soap', description: 'Always wash hands before eating and after using the toilet. This prevents many diseases.', icon: 'Hand' },
  { id: 'tip-2', title: 'Drink clean water', description: 'Boil water or use a filter before drinking. Contaminated water causes diarrhea and other illnesses.', icon: 'Droplets' },
  { id: 'tip-3', title: 'Eat green vegetables', description: 'Include leafy greens like spinach, fenugreek in your daily meals. They are rich in iron and vitamins.', icon: 'Leaf' },
  { id: 'tip-4', title: 'Walk every day', description: 'At least 30 minutes of walking daily keeps your heart healthy and controls blood sugar.', icon: 'Footprints' },
  { id: 'tip-5', title: 'Get enough sleep', description: 'Adults need 7-8 hours of sleep. Good sleep helps your body fight infections.', icon: 'Moon' },
]
