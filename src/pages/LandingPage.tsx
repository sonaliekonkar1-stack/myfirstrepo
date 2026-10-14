import { ArrowRight, Sparkles, ScanSearch, ShieldAlert, Lightbulb } from 'lucide-react'
import { Layout } from '../components/Layout'
import { Button } from '../components/Button'
import { useApp } from '../context/AppContext'

const FEATURES = [
  {
    icon: ScanSearch,
    title: 'Surface blind spots',
    text: 'Reveal assumptions and overlooked factors before they shape your choice.',
  },
  {
    icon: ShieldAlert,
    title: 'Map risks & trade-offs',
    text: 'See tensions between options without being told what to choose.',
  },
  {
    icon: Lightbulb,
    title: 'Reflect, then decide',
    text: 'Answer targeted questions that sharpen your thinking — the decision stays yours.',
  },
]

export function LandingPage() {
  const { setStep, resetFlow } = useApp()

  return (
    <Layout
      onLogoClick={() => {
        resetFlow()
        setStep('landing')
      }}
    >
      <section className="mx-auto flex min-h-[calc(100vh-88px)] w-full max-w-6xl flex-col justify-center px-5 pb-16 pt-6 sm:px-8">
        <div className="animate-fade-up mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-1.5 text-xs font-medium text-violet-200">
            <Sparkles className="h-3.5 w-3.5" />
            AI thinking companion
          </div>

          <h1 className="bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-4xl font-semibold leading-[1.1] tracking-tight text-transparent sm:text-5xl md:text-6xl">
            See What You Might Be Missing.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
            An AI thinking companion that helps you uncover assumptions, risks and
            overlooked perspectives before you make important decisions.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" onClick={() => setStep('decision')}>
              Analyze My Decision
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => {
                setStep('decision')
              }}
            >
              Start with a blank decision
            </Button>
          </div>

          <p className="mt-5 text-sm text-slate-500">
            We never make the decision for you — we help you think more clearly.
          </p>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <div
              key={feature.title}
              className="animate-fade-up rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm"
              style={{ animationDelay: `${150 + index * 100}ms` }}
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/30 to-blue-500/20 text-violet-200">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  )
}
