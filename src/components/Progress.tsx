interface ProgressProps {
  current: number
  total?: number
  labels?: string[]
}

const DEFAULT_LABELS = ['Decide', 'Analyze', 'Reflect', 'Summarize']

export function Progress({ current, total = 4, labels = DEFAULT_LABELS }: ProgressProps) {
  return (
    <div className="mx-auto mb-8 w-full max-w-3xl">
      <div className="flex items-center justify-between gap-2">
        {Array.from({ length: total }).map((_, index) => {
          const step = index + 1
          const active = step <= current
          return (
            <div key={step} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex w-full items-center">
                <div
                  className={`h-2 w-full rounded-full transition-all duration-500 ${
                    active
                      ? 'bg-gradient-to-r from-violet-500 to-blue-500 shadow-sm shadow-violet-500/40'
                      : 'bg-white/10'
                  }`}
                />
              </div>
              <span
                className={`text-[10px] font-medium uppercase tracking-wider sm:text-xs ${
                  active ? 'text-violet-200' : 'text-slate-500'
                }`}
              >
                {labels[index]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
