import type { ReactNode } from 'react'
import { Eye } from 'lucide-react'

interface LayoutProps {
  children: ReactNode
  showNav?: boolean
  onLogoClick?: () => void
}

export function Layout({ children, showNav = true, onLogoClick }: LayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      {showNav && (
        <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <button
            type="button"
            onClick={onLogoClick}
            className="group flex items-center gap-2.5 transition"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/30">
              <Eye className="h-4 w-4 text-white" />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              BlindSpot<span className="text-violet-300"> AI</span>
            </span>
          </button>
          <span className="hidden text-xs font-medium uppercase tracking-[0.2em] text-slate-500 sm:block">
            Think beyond the obvious
          </span>
        </header>
      )}

      <main className="relative z-10">{children}</main>
    </div>
  )
}
