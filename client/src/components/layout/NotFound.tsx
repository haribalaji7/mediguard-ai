import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'
import { Button } from '../ui/Button'

export function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <div className="text-8xl font-display font-bold text-primary/20 mb-4">404</div>
        <h1 className="font-display text-3xl font-bold text-text-primary mb-3">Page Not Found</h1>
        <p className="text-text-secondary mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back to your health journey.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => window.history.back()} variant="secondary">
            <ArrowLeft size={18} />
            Go Back
          </Button>
          <Link to="/">
            <Button variant="primary">
              <Home size={18} />
              Go Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
