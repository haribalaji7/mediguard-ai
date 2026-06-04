import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

export function Footer() {
  const { user } = useAuthStore()

  return (
    <footer className="bg-bg-dark text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <Heart size={20} className="text-white" />
              </div>
              <span className="font-display text-xl font-bold text-white">MediGuard AI</span>
            </div>
            <p className="text-white/60 text-sm max-w-md leading-relaxed">
              Bridging the gap between first symptom and first diagnosis. 
              Making quality healthcare accessible to every village in India.
            </p>
          </div>
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Quick Links</h4>
            <div className="space-y-2.5">
              <Link to="/symptom-checker" className="block text-sm text-white/60 hover:text-white transition-colors">Symptom Checker</Link>
              <Link to="/screening" className="block text-sm text-white/60 hover:text-white transition-colors">Health Screening</Link>
              <Link to="/consult" className="block text-sm text-white/60 hover:text-white transition-colors">Consult Doctor</Link>
              <Link to="/learn" className="block text-sm text-white/60 hover:text-white transition-colors">Health Education</Link>
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold text-white mb-4">For Partners</h4>
            <div className="space-y-2.5">
              {(!user || user.role === 'worker' || user.role === 'admin') && (
                <Link to="/worker" className="block text-sm text-white/60 hover:text-white transition-colors">Healthcare Workers</Link>
              )}
              <Link to="/community" className="block text-sm text-white/60 hover:text-white transition-colors">NGO Partners</Link>
              <a href="#contact" className="block text-sm text-white/60 hover:text-white transition-colors">Contact Us</a>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">© 2026 MediGuard AI. Made with ❤️ for Rural India.</p>
          <div className="flex gap-4 text-xs text-white/40">
            <a href="#privacy" className="hover:text-white/60 transition-colors">Privacy</a>
            <a href="#terms" className="hover:text-white/60 transition-colors">Terms</a>
            <a href="#accessibility" className="hover:text-white/60 transition-colors">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
