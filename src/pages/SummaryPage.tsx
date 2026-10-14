import { RotateCcw } from 'lucide-react'
import { Layout } from '../components/Layout'
import { Button } from '../components/Button'
import { Card, SectionHeading } from '../components/Card'
import { Progress } from '../components/Progress'
import { useApp } from '../context/AppContext'

export function SummaryPage() {
  const { analysis, decision, reflectionAnswers, setStep, resetFlow } = useApp()

  if (!analysis) {
    return (
      <Layout onLogoClick={resetFlow}>
        <div className="mx-auto max-w-lg px-5 py-24 text-center">
          <p className="text-slate-400">No summary available yet.</p>
          <Button className="mt-6" onClick={() => setStep('landing')}>
            Back Home
          </Button>
        </div>
      </Layout>
    )
  }

  const answered = Object.entries(reflectionAnswers).filter(
    (entry): entry is [string, string] => entry[1].trim().length > 0,
  )
  const discovered = [
    ...analysis.blindSpots.slice(0, 2),
    ...analysis.assumptions.slice(0, 2),
  ]
  const stillUnknown = analysis.missingInformation.slice(0, 4)
  const investigate = analysis.map.investigate

  return (
    <Layout onLogoClick={resetFlow}>
      <div className="mx-auto w-full max-w-4xl px-5 pb-24 pt-2 sm:px-8">
        <Progress current={4} />

        <div className="mb-8 animate-fade-up text-center">
          <SectionHeading
            eyebrow="Step 4 · Summary"
            title="Your reflection snapshot"
            subtitle="A clearer map of the decision — still entirely in your hands."
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card glow className="animate-fade-up md:col-span-2">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-violet-300">
              What I Started With
            </h3>
            <p className="text-lg font-medium text-white">{decision.decision}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Options</p>
                <p className="mt-1 text-sm text-slate-300">{decision.options || '—'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Initial thinking</p>
                <p className="mt-1 text-sm text-slate-300">
                  {decision.currentThinking || '—'}
                </p>
              </div>
            </div>
          </Card>

          <Card className="animate-fade-up">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-blue-300">
              What I Discovered
            </h3>
            <ul className="space-y-2.5">
              {discovered.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-slate-300">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                  {item}
                </li>
              ))}
              {answered.length > 0 && (
                <li className="flex gap-2 text-sm text-slate-300">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                  You reflected on {answered.length} question
                  {answered.length === 1 ? '' : 's'} in your own words
                </li>
              )}
            </ul>
          </Card>

          <Card className="animate-fade-up">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-fuchsia-300">
              What I Still Don't Know
            </h3>
            <ul className="space-y-2.5">
              {stillUnknown.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-slate-300">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-fuchsia-400" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="animate-fade-up md:col-span-2">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-cyan-300">
              What I Should Investigate
            </h3>
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {investigate.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-slate-300">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          {answered.length > 0 && (
            <Card className="animate-fade-up md:col-span-2">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
                Your reflections
              </h3>
              <div className="space-y-4">
                {answered.map(([question, answer]) => (
                  <div
                    key={question}
                    className="rounded-xl border border-white/5 bg-slate-950/40 p-4"
                  >
                    <p className="text-sm font-medium text-slate-200">{question}</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">{answer}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="mt-10 animate-fade-up rounded-2xl border border-violet-400/20 bg-gradient-to-r from-violet-600/20 via-blue-600/10 to-transparent p-8 text-center">
          <p className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Your decision is still yours.
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400">
            BlindSpot AI surfaced gaps and questions. What you choose next — and why —
            remains entirely up to you.
          </p>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Button variant="ghost" onClick={() => setStep('reflection')}>
            Back to Reflection
          </Button>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="secondary" onClick={() => setStep('analysis')}>
              Revisit Analysis
            </Button>
            <Button
              onClick={() => {
                resetFlow()
                setStep('decision')
              }}
            >
              <RotateCcw className="h-4 w-4" />
              Analyze Another Decision
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
