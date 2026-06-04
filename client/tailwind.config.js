/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--primary) / <alpha-value>)',
        'primary-dark': 'rgb(var(--primary-dark) / <alpha-value>)',
        'primary-light': 'rgb(var(--primary-light) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        'accent-gold': 'rgb(var(--accent-gold) / <alpha-value>)',
        'bg-base': 'rgb(var(--bg-base) / <alpha-value>)',
        'bg-card': 'rgb(var(--bg-card) / <alpha-value>)',
        'bg-dark': 'rgb(var(--bg-dark) / <alpha-value>)',
        'text-primary': 'rgb(var(--text-primary) / <alpha-value>)',
        'text-secondary': 'rgb(var(--text-secondary) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        danger: 'rgb(var(--danger) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
        glow: '0 0 20px rgba(0,184,148,0.25)',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(0,184,148,0.3)' },
          '50%': { boxShadow: '0 0 24px rgba(0,184,148,0.6)' },
        },
        'count-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' }
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(0.98)' }
        }
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'count-up': 'count-up 0.5s ease-out forwards',
        float: 'float 3s ease-in-out infinite',
        blob: 'blob 7s infinite',
        shimmer: 'shimmer 2s infinite',
        'gradient-x': 'gradient-x 3s ease infinite',
        'pulse-slow': 'pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
    },
  },
  plugins: [],
}
