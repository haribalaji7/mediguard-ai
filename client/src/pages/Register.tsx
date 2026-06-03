import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Heart, ArrowRight, ArrowLeft, Check } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useUiStore } from '../store/uiStore'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'

type Role = 'patient' | 'worker'
type Step = 'form' | 'otp' | 'success'

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
]

export default function Register() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { register, isAuthenticated } = useAuthStore()
  const { addToast } = useUiStore()
  const [role, setRole] = useState<Role>('patient')
  const [step, setStep] = useState<Step>('form')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const [form, setForm] = useState({
    name: '', age: '', gender: '', village: '', district: '', state: '', phone: '', password: '', workerId: '',
  })
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const updateForm = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }))

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.name || form.name.length < 2) errs.name = 'Name is required'
    if (!form.age || Number(form.age) < 1 || Number(form.age) > 120) errs.age = 'Enter a valid age'
    if (!form.gender) errs.gender = 'Select gender'
    if (!form.village) errs.village = 'Village is required'
    if (!form.district) errs.district = 'District is required'
    if (!form.state) errs.state = 'State is required'
    if (!form.phone || form.phone.length !== 10) errs.phone = 'Enter a valid 10-digit phone'
    if (!form.password || form.password.length < 4) errs.password = 'Password (min 4 characters)'
    if (role === 'worker' && !form.workerId) errs.workerId = 'Worker ID is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)
    try {
      await register({
        name: form.name, age: Number(form.age), gender: form.gender as 'male' | 'female' | 'other',
        village: form.village, district: form.district, state: form.state,
        phone: form.phone, password: form.password, role,
        workerId: form.workerId || undefined,
      })
      setStep('otp')
    } catch {
      addToast('Registration failed. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`)
      next?.focus()
    }
  }

  const verifyOtp = () => {
    if (otp.every((d) => d !== '')) {
      addToast('Account created successfully!', 'success')
      setStep('success')
      setTimeout(() => navigate('/login'), 2000)
    } else {
      addToast('Please enter all 6 digits', 'error')
    }
  }

  return (
    <div className="min-h-[90vh] flex">
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary to-primary-dark items-center justify-center p-12">
        <div className="text-center text-white">
          <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <Heart size={40} className="text-white" />
          </div>
          <h2 className="font-display text-3xl font-bold mb-4">Join MediGuard AI</h2>
          <p className="text-white/80 max-w-sm">Start your health journey today. Free, private, and in your language.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {step === 'form' && (
            <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-sm">
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 lg:hidden">
                  <Heart size={28} className="text-primary" />
                </div>
                <h1 className="font-display text-2xl font-bold text-text-primary">{t('auth.register')}</h1>
              </div>

              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-6">
                <button onClick={() => setRole('patient')} className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${role === 'patient' ? 'bg-bg-card shadow-sm text-primary' : 'text-text-secondary'}`}>
                  {t('auth.asPatient')}
                </button>
                <button onClick={() => setRole('worker')} className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${role === 'worker' ? 'bg-bg-card shadow-sm text-primary' : 'text-text-secondary'}`}>
                  {t('auth.asWorker')}
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input label={t('auth.name')} value={form.name} onChange={(e) => updateForm('name', e.target.value)} error={errors.name} placeholder=" " />
                  <Input label={t('auth.age')} type="number" value={form.age} onChange={(e) => updateForm('age', e.target.value)} error={errors.age} placeholder=" " />
                </div>
                <Select label={t('auth.gender')} options={genderOptions} value={form.gender} onChange={(e) => updateForm('gender', e.target.value)} error={errors.gender} />
                <Input label={t('auth.village')} value={form.village} onChange={(e) => updateForm('village', e.target.value)} error={errors.village} placeholder=" " />
                <div className="grid grid-cols-2 gap-4">
                  <Input label={t('auth.district')} value={form.district} onChange={(e) => updateForm('district', e.target.value)} error={errors.district} placeholder=" " />
                  <Input label={t('auth.state')} value={form.state} onChange={(e) => updateForm('state', e.target.value)} error={errors.state} placeholder=" " />
                </div>
                <Input label={t('auth.phone')} type="tel" value={form.phone} onChange={(e) => updateForm('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} error={errors.phone} placeholder=" " />
                <Input label={t('auth.password')} type="password" value={form.password} onChange={(e) => updateForm('password', e.target.value)} error={errors.password} placeholder=" " />
                {role === 'worker' && (
                  <Input label={t('auth.workerId')} value={form.workerId} onChange={(e) => updateForm('workerId', e.target.value)} error={errors.workerId} placeholder=" " />
                )}
                <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
                  {t('auth.registerBtn')} <ArrowRight size={18} />
                </Button>
              </form>

              <p className="text-center mt-4 text-sm text-text-secondary">
                {t('auth.hasAccount')}{' '}
                <Link to="/login" className="text-primary font-semibold hover:underline">{t('auth.loginBtn')}</Link>
              </p>
            </motion.div>
          )}

          {step === 'otp' && (
            <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-sm text-center">
              <h2 className="font-display text-2xl font-bold text-text-primary mb-2">{t('auth.otpTitle')}</h2>
              <p className="text-text-secondary text-sm mb-6">{t('auth.otpSent', { phone: form.phone })}</p>
              <div className="flex gap-3 justify-center mb-6">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Backspace' && !digit && i > 0) document.getElementById(`otp-${i - 1}`)?.focus() }}
                    className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-border bg-bg-card text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    aria-label={`OTP digit ${i + 1}`}
                  />
                ))}
              </div>
              <Button fullWidth size="lg" onClick={verifyOtp}>
                Verify OTP <Check size={18} />
              </Button>
              <button onClick={() => setStep('form')} className="mt-4 text-sm text-text-secondary hover:text-primary flex items-center gap-1 mx-auto">
                <ArrowLeft size={14} /> Back to form
              </button>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm text-center">
              <div className="w-20 h-20 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-6">
                <Check size={40} className="text-success" />
              </div>
              <h2 className="font-display text-2xl font-bold text-text-primary mb-2">Registration Successful!</h2>
              <p className="text-text-secondary">Redirecting to login...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
