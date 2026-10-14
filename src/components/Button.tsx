import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'md' | 'lg'
  children?: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60'

  const sizes = {
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  }

  const variants = {
    primary:
      'bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-600/25 hover:shadow-violet-500/40 hover:brightness-110',
    secondary:
      'border border-white/10 bg-white/5 text-slate-100 backdrop-blur hover:border-violet-400/40 hover:bg-white/10',
    ghost: 'text-slate-300 hover:bg-white/5 hover:text-white',
  }

  return (
    <button
      type="button"
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
