export interface DecisionInput {
  decision: string
  options: string
  factors: string
  currentThinking: string
  leaningReason: string
}

export interface AnalysisResult {
  decisionSummary: string
  blindSpots: string[]
  assumptions: string[]
  missingInformation: string[]
  risksTradeoffs: string[]
  alternativePerspectives: string[]
  reflectionQuestions: string[]
  map: {
    know: string[]
    assume: string[]
    missing: string[]
    investigate: string[]
  }
}

export interface ReflectionAnswers {
  [question: string]: string
}

export type AppStep =
  | 'landing'
  | 'decision'
  | 'analyzing'
  | 'analysis'
  | 'reflection'
  | 'summary'
