import { ArrowRight } from 'lucide-react'
import { Layout } from '../components/Layout'
import { Button } from '../components/Button'
import { Card, SectionHeading } from '../components/Card'
import { Progress } from '../components/Progress'
import { useApp } from '../context/AppContext'

export function ReflectionPage() {
  const {
    analysis,
    reflectionAnswers,
    setReflectionAnswer,
    setStep,
    resetFlow,
  } = useApp()

  if (!analysis) {
    return (
      <Layout onLogoClick={resetFlow}>
        <div className="mx-auto max-w-lg px-5 py-24 text-center">
          <p className="text-slate-400">Complete an analysis first to reflect.</p>
          <Button className="mt-6" onClick={() => setStep('decision')}>
            Start Decision
          </Button>
        </div>
      </Layout>
    )
  }

  const questions = analysis.reflectionQuestions.slice(0, 5)

  return (
    <Layout onLogoClick={resetFlow}>
      <div className="mx-auto w-full max-w-3xl px-5 pb-24 pt-2 sm:px-8">
        <Progress current={3} />

        <div className="mb-8 animate-fade-up text-center">
          <SectionHeading
            eyebrow="Step 3 · Reflection"
            title="Sit with the hard questions"
            subtitle="Write freely. There are no right answers — only clearer thinking."
          />
        </div>

        <div className="space-y-4">
          {questions.map((question, index) => (
            <Card key={question} className="animate-fade-up">
              <label className="block">
                <div className="mb-3 flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-500/20 text-xs font-bold text-violet-200">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium leading-relaxed text-slate-100 sm:text-base">
                    {question}
                  </span>
                </div>
                <textarea
                  value={reflectionAnswers[question] ?? ''}
                  onChange={(e) => setReflectionAnswer(question, e.target.value)}
                  placeholder="Write your reflection…"
                  rows={3}
                  className="w-full resize-y rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/20"
                />
              </label>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Button variant="ghost" onClick={() => setStep('analysis')}>
            Back to Analysis
          </Button>
          <Button size="lg" onClick={() => setStep('summary')}>
            See My Summary
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Layout>
  )
}
