import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  glow?: boolean
}

export function Card({ children, className = '', glow = false }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-xl backdrop-blur-md sm:p-6 ${
        glow ? 'shadow-violet-500/10' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
}) {
  return (
    <div className="mb-5">
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-300/80">
          {eyebrow}
        </p>
      )}
      <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
        {title}
      </h2>
      {subtitle && <p className="mt-2 text-sm leading-relaxed text-slate-400">{subtitle}</p>}
    </div>
  )
}
