import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { classNames } from '../../lib/utils'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: { value: string; label: string }[]
  error?: string
}

export function Select({ label, options, error, className, id, ...props }: SelectProps) {
  const [focused, setFocused] = useState(false)
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="relative">
      <div className={classNames(
        'relative border rounded-xl transition-all duration-200 bg-bg-card',
        focused ? 'border-primary ring-2 ring-primary/20' : error ? 'border-danger' : 'border-border',
      )}>
        <select
          id={inputId}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={classNames(
            'block w-full px-4 pt-5 pb-2 bg-transparent border-none outline-none text-text-primary font-body text-base appearance-none cursor-pointer',
            className || '',
          )}
          aria-label={label}
          {...props}
        >
          <option value="" disabled>Select...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <label
          htmlFor={inputId}
          className="absolute left-4 -top-2.5 text-sm text-primary font-body transition-all duration-200"
        >
          {label}
        </label>
        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-danger" role="alert">{error}</p>
      )}
    </div>
  )
}
