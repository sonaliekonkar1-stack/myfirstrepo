import { ArrowRight, Sparkles } from 'lucide-react'
import { Layout } from '../components/Layout'
import { Button } from '../components/Button'
import { Card, SectionHeading } from '../components/Card'
import { Progress } from '../components/Progress'
import { useApp } from '../context/AppContext'
import type { DecisionInput } from '../types'

const FIELDS: {
  key: keyof DecisionInput
  label: string
  placeholder: string
  rows?: number
}[] = [
  {
    key: 'decision',
    label: 'Decision',
    placeholder: 'What decision are you facing?',
    rows: 2,
  },
  {
    key: 'options',
    label: 'Options',
    placeholder: 'What options are you considering?',
    rows: 2,
  },
  {
    key: 'factors',
    label: 'Important factors',
    placeholder: 'What matters most in this decision?',
    rows: 2,
  },
  {
    key: 'currentThinking',
    label: 'What you currently think',
    placeholder: 'Summarize your current reasoning…',
    rows: 3,
  },
  {
    key: 'leaningReason',
    label: 'Why you are leaning that way',
    placeholder: 'What makes one option feel more right right now?',
    rows: 3,
  },
]

export function DecisionPage() {
  const { decision, setDecision, loadDemo, startAnalysis, setStep, resetFlow } =
    useApp()

  const canAnalyze = decision.decision.trim().length > 0

  const updateField = (key: keyof DecisionInput, value: string) => {
    setDecision({ ...decision, [key]: value })
  }

  return (
    <Layout onLogoClick={resetFlow}>
      <div className="mx-auto w-full max-w-3xl px-5 pb-20 pt-2 sm:px-8">
        <Progress current={1} />

        <div className="animate-fade-up mb-8 text-center">
          <SectionHeading
            eyebrow="Step 1"
            title="Frame your decision"
            subtitle="Share how you see the choice today. BlindSpot AI will stress-test the gaps — not choose for you."
          />
        </div>

        <Card glow className="animate-fade-up">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-400">
              Need a starting point? Load the demo internship scenario.
            </p>
            <Button variant="secondary" onClick={loadDemo}>
              <Sparkles className="h-4 w-4 text-violet-300" />
              Try Demo Decision
            </Button>
          </div>

          <div className="space-y-5">
            {FIELDS.map((field) => (
              <label key={field.key} className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">
                  {field.label}
                </span>
                <textarea
                  value={decision[field.key]}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  rows={field.rows ?? 2}
                  className="w-full resize-y rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/20"
                />
              </label>
            ))}
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button variant="ghost" onClick={() => setStep('landing')}>
              Back
            </Button>
            <Button size="lg" disabled={!canAnalyze} onClick={startAnalysis}>
              Analyze Blind Spots
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  )
}
