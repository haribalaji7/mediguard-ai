import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Heart, Phone, Lock, ArrowRight } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useUiStore } from '../store/uiStore'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

export default function Login() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuthStore()
  const { addToast } = useUiStore()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!phone || phone.length < 10) errs.phone = 'Enter a valid 10-digit phone number'
    if (!password || password.length < 4) errs.password = 'Password must be at least 4 characters'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)
    try {
      await login(phone, password)
      addToast('Welcome back!', 'success')
      navigate('/dashboard')
    } catch {
      addToast('Invalid credentials. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[90vh] flex">
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary to-primary-dark items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="particle" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, '--duration': `${5 + Math.random() * 8}s`, '--delay': `${Math.random() * 5}s` } as React.CSSProperties} />
          ))}
        </div>
        <div className="relative z-10 text-center text-white">
          <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <Heart size={40} className="text-white" />
          </div>
          <h2 className="font-display text-3xl font-bold mb-4">Welcome Back to MediGuard AI</h2>
          <p className="text-white/80 max-w-sm">Your AI-powered health companion. Continue your health journey where you left off.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 lg:hidden">
              <Heart size={28} className="text-primary" />
            </div>
            <h1 className="font-display text-2xl font-bold text-text-primary">{t('auth.login')}</h1>
            <p className="text-text-secondary text-sm mt-1">{t('auth.welcome')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label={t('auth.phone')}
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              error={errors.phone}
              placeholder=" "
              maxLength={10}
            />
            <Input
              label={t('auth.password')}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              placeholder=" "
            />
            <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
              {t('auth.loginBtn')} <ArrowRight size={18} />
            </Button>
          </form>

          <p className="text-center mt-6 text-sm text-text-secondary">
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              {t('auth.registerBtn')}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
