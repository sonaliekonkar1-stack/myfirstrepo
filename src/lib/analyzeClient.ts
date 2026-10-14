import type { AnalysisResult, DecisionInput } from '../types'

export interface ApiAnalysis {
  decisionSummary?: string
  blindSpots?: string[]
  assumptions?: string[]
  missingInformation?: string[]
  risksAndTradeoffs?: string[]
  alternativePerspectives?: string[]
  reflectionQuestions?: string[]
  cognitiveBiases?: string[]
  map?: {
    know?: string[]
    assume?: string[]
    missing?: string[]
    investigate?: string[]
  }
  error?: string
}

function strings(value?: string[]): string[] {
  return (value ?? []).filter((item) => typeof item === 'string' && item.trim().length > 0)
}

function splitFactors(value: string): string[] {
  return value
    .split(/[,/|]/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 4)
}

export function mapApiAnalysis(api: ApiAnalysis, input: DecisionInput): AnalysisResult {
  const assumptions = strings(api.assumptions)
  const biases = strings(api.cognitiveBiases).map((bias) =>
    bias.toLowerCase().startsWith('possible cognitive bias')
      ? bias
      : `Possible cognitive bias: ${bias}`,
  )
  const mergedAssumptions = [
    ...assumptions,
    ...biases.filter((bias) => !assumptions.includes(bias)),
  ]

  const know = strings(api.map?.know)
  const assume = strings(api.map?.assume)
  const missing = strings(api.map?.missing)
  const investigate = strings(api.map?.investigate)

  return {
    decisionSummary: api.decisionSummary?.trim() || `You are considering: “${input.decision}.”`,
    blindSpots: strings(api.blindSpots),
    assumptions: mergedAssumptions,
    missingInformation: strings(api.missingInformation),
    risksTradeoffs: strings(api.risksAndTradeoffs),
    alternativePerspectives: strings(api.alternativePerspectives),
    reflectionQuestions: strings(api.reflectionQuestions),
    map: {
      know:
        know.length > 0
          ? know
          : [
              input.decision,
              ...splitFactors(input.options),
              ...splitFactors(input.factors),
            ].filter(Boolean).slice(0, 5),
      assume: assume.length > 0 ? assume : mergedAssumptions.slice(0, 4),
      missing: missing.length > 0 ? missing : strings(api.missingInformation).slice(0, 4),
      investigate:
        investigate.length > 0
          ? investigate
          : strings(api.missingInformation)
              .slice(0, 4)
              .map((item) => `Investigate: ${item}`),
    },
  }
}

export async function requestAnalysis(input: DecisionInput): Promise<AnalysisResult> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      decision: input.decision,
      options: input.options,
      importantFactors: input.factors,
      currentLeaning: input.currentThinking,
      leaningReason: input.leaningReason,
    }),
  })

  let payload: ApiAnalysis
  try {
    payload = (await response.json()) as ApiAnalysis
  } catch {
    throw new Error('The analysis service returned an unreadable response.')
  }

  if (!response.ok) {
    throw new Error(payload.error || `Analysis failed (${response.status}).`)
  }

  if (!payload.decisionSummary && !payload.blindSpots?.length) {
    throw new Error('The analysis service returned empty results.')
  }

  return mapApiAnalysis(payload, input)
}
