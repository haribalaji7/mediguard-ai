import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { classNames } from '../../lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helperText?: string
}

export function Input({ label, error, helperText, type, className, id, ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [focused, setFocused] = useState(false)
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-')
  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type

  return (
    <div className="relative">
      <div className={classNames(
        'relative border rounded-xl transition-all duration-200 bg-bg-card',
        focused ? 'border-primary ring-2 ring-primary/20' : error ? 'border-danger' : 'border-border',
        'group',
      )}>
        <input
          id={inputId}
          type={inputType}
          onFocus={(e) => { setFocused(true); props.onFocus?.(e) }}
          onBlur={(e) => { setFocused(false); props.onBlur?.(e) }}
          className={classNames(
            'block w-full px-4 pt-5 pb-2 bg-transparent border-none outline-none text-text-primary font-body text-base peer',
            isPassword ? 'pr-12' : '',
            className || '',
          )}
          placeholder=" "
          aria-label={label}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        <label
          htmlFor={inputId}
          className={classNames(
            'absolute left-4 top-4 text-text-secondary font-body transition-all duration-200 pointer-events-none',
            'peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:translate-y-0',
            'peer-focus:text-sm peer-focus:-top-2.5 peer-focus:translate-y-0 peer-focus:text-primary',
            'peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:translate-y-0',
          )}
        >
          {label}
        </label>
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors p-1"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-sm text-danger" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-text-secondary">{helperText}</p>
      )}
    </div>
  )
}
