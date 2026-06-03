import { useEffect, useState } from 'react'
import { animate, useMotionValue, useTransform, motion } from 'framer-motion'

interface CountUpProps {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
  formatter?: (n: number) => string
}

export function CountUp({ end, duration = 2, suffix = '', prefix = '', className, formatter }: CountUpProps) {
  const count = useMotionValue(0)
  const [display, setDisplay] = useState('0')
  const rounded = useTransform(count, (v) => {
    return formatter ? formatter(v) : Math.round(v).toLocaleString('en-IN')
  })

  useEffect(() => {
    const unsub = rounded.on('change', (v) => setDisplay(v))
    const controls = animate(count, end, { duration, ease: 'easeOut' })
    return () => { unsub(); controls.stop() }
  }, [end, count, duration, rounded])

  return (
    <motion.span className={className}>
      {prefix}{display}{suffix}
    </motion.span>
  )
}
