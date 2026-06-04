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
  const { login, isAuthenticated, user } = useAuthStore()
  const { addToast } = useUiStore()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loginRole, setLoginRole] = useState<'patient' | 'worker'>('patient')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'worker' || user.role === 'admin') {
        navigate('/worker')
      } else {
        navigate('/dashboard')
      }
    }
  }, [isAuthenticated, user, navigate])

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
      await login(phone, password, loginRole)
      addToast('Welcome back!', 'success')
    } catch {
      addToast('Invalid credentials. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[90vh] flex">
      <div className="hidden lg:flex w-1/2 bg-bg-base items-center justify-center p-12 relative overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-bg-base to-accent/10" />
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-primary/20 rounded-full blur-[100px] mix-blend-multiply animate-blob" />
        <div className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] bg-accent/20 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-2000" />
        
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="particle" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, '--duration': `${6 + Math.random() * 6}s`, '--delay': `${Math.random() * 4}s` } as React.CSSProperties} />
          ))}
        </div>

        {/* Floating Glassmorphism Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, type: 'spring' }}
          className="relative z-10 w-full max-w-md perspective-1000"
        >
          <div className="bg-bg-card/40 backdrop-blur-3xl border border-white/20 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden transform rotate-y-minus-5 hover:rotate-y-0 transition-transform duration-500">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/30 blur-[50px] rounded-full" />
            
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary to-accent p-[1px] mb-8 shadow-glow mx-auto">
              <div className="w-full h-full bg-bg-card/80 backdrop-blur-xl rounded-2xl flex items-center justify-center">
                <Heart size={36} className="text-primary animate-pulse" />
              </div>
            </div>
            
            <h2 className="font-display text-4xl font-extrabold mb-4 text-text-primary text-center leading-tight">
              Welcome back to <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">MediGuard AI</span>
            </h2>
            <p className="text-text-secondary text-center text-lg max-w-[280px] mx-auto font-medium">
              Your intelligent health companion for a better tomorrow.
            </p>
          </div>
        </motion.div>
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
            <h1 className="font-display text-2xl font-bold text-text-primary">
              {loginRole === 'worker' ? 'Worker Portal Login' : t('auth.login')}
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              {loginRole === 'worker' ? 'Secure access for healthcare professionals' : t('auth.welcome')}
            </p>
          </div>

          {/* Role Toggle */}
          <div className="flex bg-bg-card border border-border p-1 rounded-xl mb-6 relative">
            <button
              onClick={() => setLoginRole('patient')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all z-10 ${
                loginRole === 'patient' ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Patient
            </button>
            <button
              onClick={() => setLoginRole('worker')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all z-10 ${
                loginRole === 'worker' ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Healthcare Worker
            </button>
            
            {/* Animated Slider Background */}
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-primary/10 rounded-lg transition-transform duration-300 ease-out`}
              style={{ transform: loginRole === 'patient' ? 'translateX(0)' : 'translateX(calc(100% + 8px))' }}
            />
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
              {loginRole === 'worker' ? 'Access Portal' : t('auth.loginBtn')} <ArrowRight size={18} />
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
