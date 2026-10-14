import type { AnalysisResult } from '../types'

const STAGES = [
  {
    key: 'know' as const,
    label: 'WHAT I KNOW',
    accent: 'from-blue-500/30 to-blue-600/10 border-blue-400/30',
    dot: 'bg-blue-400',
  },
  {
    key: 'assume' as const,
    label: 'WHAT I ASSUME',
    accent: 'from-violet-500/30 to-violet-600/10 border-violet-400/30',
    dot: 'bg-violet-400',
  },
  {
    key: 'missing' as const,
    label: 'WHAT I MAY BE MISSING',
    accent: 'from-fuchsia-500/25 to-pink-600/10 border-fuchsia-400/30',
    dot: 'bg-fuchsia-400',
  },
  {
    key: 'investigate' as const,
    label: 'WHAT I SHOULD INVESTIGATE',
    accent: 'from-cyan-500/25 to-teal-600/10 border-cyan-400/30',
    dot: 'bg-cyan-400',
  },
]

export function BlindSpotMap({ map }: { map: AnalysisResult['map'] }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-950/90 p-5 sm:p-8">
      <div className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="mb-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300/90">
          Blind Spot Map
        </p>
        <h3 className="mt-2 text-lg font-semibold text-white sm:text-xl">
          Trace what sits outside your current view
        </h3>
      </div>

      <div className="mx-auto flex max-w-2xl flex-col items-stretch gap-0">
        {STAGES.map((stage, index) => (
          <div key={stage.key} className="flex flex-col items-center">
            <div
              className={`w-full rounded-2xl border bg-gradient-to-br p-4 sm:p-5 ${stage.accent} animate-fade-up`}
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <div className="mb-3 flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${stage.dot} shadow-[0_0_12px_currentColor]`} />
                <h4 className="text-xs font-bold tracking-[0.16em] text-white sm:text-sm">
                  {stage.label}
                </h4>
              </div>
              <ul className="space-y-2">
                {map[stage.key].map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-slate-200/90">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/40" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            {index < STAGES.length - 1 && (
              <div className="flex flex-col items-center py-2">
                <div className="h-8 w-px bg-gradient-to-b from-white/40 to-white/10" />
                <span className="text-violet-300/80">↓</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
