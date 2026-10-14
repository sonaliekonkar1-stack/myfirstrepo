import {
  AlertTriangle,
  ArrowRight,
  EyeOff,
  HelpCircle,
  Info,
  Scale,
  Users,
} from 'lucide-react'
import { Layout } from '../components/Layout'
import { Button } from '../components/Button'
import { Card, SectionHeading } from '../components/Card'
import { Progress } from '../components/Progress'
import { BlindSpotMap } from '../components/BlindSpotMap'
import { useApp } from '../context/AppContext'

export function AnalyzingPage() {
  const { resetFlow, analysisError, startAnalysis, setStep } = useApp()

  if (analysisError) {
    return (
      <Layout onLogoClick={resetFlow}>
        <div className="mx-auto flex min-h-[70vh] w-full max-w-lg flex-col items-center justify-center px-5 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-rose-400/30 bg-rose-500/10 text-rose-200">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-semibold text-white">Analysis didn’t complete</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">{analysisError}</p>
          <p className="mt-2 text-xs text-slate-500">
            Mock data was not used. Retry when the service is available.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button variant="secondary" onClick={() => setStep('decision')}>
              Edit Decision
            </Button>
            <Button onClick={startAnalysis}>Retry Analysis</Button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout onLogoClick={resetFlow}>
      <div className="mx-auto flex min-h-[70vh] w-full max-w-lg flex-col items-center justify-center px-5 text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 animate-pulse rounded-full bg-violet-500/30 blur-2xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-violet-400/30 bg-slate-900">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-400/20 border-t-violet-400" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-white">Scanning for blind spots…</h2>
        <p className="mt-3 text-sm text-slate-400">
          Mapping assumptions, gaps, risks, and alternate lenses on your reasoning.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {['Assumptions', 'Missing info', 'Trade-offs', 'Perspectives'].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Layout>
  )
}

function ListCard({
  icon: Icon,
  title,
  items,
  accent,
}: {
  icon: typeof EyeOff
  title: string
  items: string[]
  accent: string
}) {
  return (
    <Card className="h-full animate-fade-up">
      <div className="mb-4 flex items-center gap-3">
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${accent}`}>
          <Icon className="h-4 w-4" />
        </span>
        <h3 className="font-semibold text-white">{title}</h3>
      </div>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-slate-300">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400/70" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}

export function AnalysisPage() {
  const { analysis, decision, setStep, resetFlow } = useApp()

  if (!analysis) {
    return (
      <Layout onLogoClick={resetFlow}>
        <div className="mx-auto max-w-lg px-5 py-24 text-center">
          <p className="text-slate-400">No analysis yet. Start by framing a decision.</p>
          <Button className="mt-6" onClick={() => setStep('decision')}>
            Go to Decision
          </Button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout onLogoClick={resetFlow}>
      <div className="mx-auto w-full max-w-6xl px-5 pb-24 pt-2 sm:px-8">
        <Progress current={2} />

        <div className="mb-8 animate-fade-up text-center">
          <SectionHeading
            eyebrow="Step 2 · Analysis"
            title="Your Blind Spot Dashboard"
            subtitle="Insights to widen your view — not a recommendation on what to choose."
          />
        </div>

        <Card glow className="mb-6 animate-fade-up">
          <SectionHeading eyebrow="Decision Summary" title={decision.decision || 'Your decision'} />
          <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
            {analysis.decisionSummary}
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-500">Options</p>
              <p className="mt-1 text-sm text-slate-200">{decision.options || '—'}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-500">Current thinking</p>
              <p className="mt-1 text-sm text-slate-200">{decision.currentThinking || '—'}</p>
            </div>
          </div>
        </Card>

        <div className="mb-6">
          <BlindSpotMap map={analysis.map} />
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <ListCard
            icon={EyeOff}
            title="Possible Blind Spots"
            items={analysis.blindSpots}
            accent="bg-violet-500/20 text-violet-200"
          />
          <ListCard
            icon={Info}
            title="Assumptions"
            items={analysis.assumptions}
            accent="bg-blue-500/20 text-blue-200"
          />
          <ListCard
            icon={HelpCircle}
            title="Missing Information"
            items={analysis.missingInformation}
            accent="bg-fuchsia-500/20 text-fuchsia-200"
          />
          <ListCard
            icon={AlertTriangle}
            title="Risks & Trade-offs"
            items={analysis.risksTradeoffs}
            accent="bg-amber-500/20 text-amber-200"
          />
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <ListCard
            icon={Users}
            title="Alternative Perspectives"
            items={analysis.alternativePerspectives}
            accent="bg-cyan-500/20 text-cyan-200"
          />
          <Card className="animate-fade-up">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-200">
                <Scale className="h-4 w-4" />
              </span>
              <h3 className="font-semibold text-white">Reflection Questions</h3>
            </div>
            <ol className="space-y-3">
              {analysis.reflectionQuestions.map((q, i) => (
                <li key={q} className="flex gap-3 text-sm leading-relaxed text-slate-300">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/5 text-xs font-semibold text-violet-300">
                    {i + 1}
                  </span>
                  <span>{q}</span>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Button variant="ghost" onClick={() => setStep('decision')}>
            Edit Decision
          </Button>
          <Button size="lg" onClick={() => setStep('reflection')}>
            Reflect on These Questions
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Layout>
  )
}
