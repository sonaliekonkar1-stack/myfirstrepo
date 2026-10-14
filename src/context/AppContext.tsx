import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { DEMO_DECISION } from '../data/mockAnalysis'
import { requestAnalysis } from '../lib/analyzeClient'
import type {
  AnalysisResult,
  AppStep,
  DecisionInput,
  ReflectionAnswers,
} from '../types'

interface AppContextValue {
  step: AppStep
  setStep: (step: AppStep) => void
  decision: DecisionInput
  setDecision: (decision: DecisionInput) => void
  analysis: AnalysisResult | null
  analysisError: string | null
  reflectionAnswers: ReflectionAnswers
  setReflectionAnswer: (question: string, answer: string) => void
  loadDemo: () => void
  startAnalysis: () => void
  resetFlow: () => void
}

const emptyDecision: DecisionInput = {
  decision: '',
  options: '',
  factors: '',
  currentThinking: '',
  leaningReason: '',
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [step, setStepState] = useState<AppStep>('landing')
  const [decision, setDecision] = useState<DecisionInput>(emptyDecision)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [reflectionAnswers, setReflectionAnswers] = useState<ReflectionAnswers>({})
  const requestId = useRef(0)

  const setStep = useCallback((next: AppStep) => {
    setStepState(next)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  const loadDemo = useCallback(() => {
    setDecision(DEMO_DECISION)
  }, [])

  const startAnalysis = useCallback(() => {
    const snapshot = decision
    const id = ++requestId.current
    setAnalysisError(null)
    setAnalysis(null)
    setReflectionAnswers({})
    setStepState('analyzing')

    void requestAnalysis(snapshot)
      .then((result) => {
        if (id !== requestId.current) return
        setAnalysis(result)
        setAnalysisError(null)
        setStepState('analysis')
      })
      .catch((err: unknown) => {
        if (id !== requestId.current) return
        setAnalysis(null)
        setAnalysisError(
          err instanceof Error
            ? err.message
            : 'Analysis failed. Please try again.',
        )
      })
  }, [decision])

  const setReflectionAnswer = useCallback((question: string, answer: string) => {
    setReflectionAnswers((prev: ReflectionAnswers) => ({ ...prev, [question]: answer }))
  }, [])

  const resetFlow = useCallback(() => {
    requestId.current += 1
    setStepState('landing')
    setDecision(emptyDecision)
    setAnalysis(null)
    setAnalysisError(null)
    setReflectionAnswers({})
  }, [])

  const value = useMemo(
    () => ({
      step,
      setStep,
      decision,
      setDecision,
      analysis,
      analysisError,
      reflectionAnswers,
      setReflectionAnswer,
      loadDemo,
      startAnalysis,
      resetFlow,
    }),
    [
      step,
      setStep,
      decision,
      analysis,
      analysisError,
      reflectionAnswers,
      setReflectionAnswer,
      loadDemo,
      startAnalysis,
      resetFlow,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
