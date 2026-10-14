import { GoogleGenAI, Type } from '@google/genai'

const SYSTEM_INSTRUCTION = `You are BlindSpot AI, a thinking companion — never a decision maker.

Your job is to help the user examine their reasoning about a decision they are considering.
You uncover what they may be missing so they can think more clearly.

PRODUCT RULES (strict):
- NEVER tell the user what decision to make.
- NEVER recommend, rank, or pick an option.
- NEVER use language like: "you should choose", "accept the internship", "reject the internship", "the best option is", "I recommend", "go with", "don't take".
- Do not imply a preferred outcome. The final decision remains entirely with the user.
- Distinguish facts the user stated from assumptions they may be making.
- Communicate uncertainty. If something is unknown, say so — never invent facts, statistics, quotes, or details the user did not provide.
- Analysis must be fully specific to THIS user's decision, options, factors, and reasoning. Do not reuse generic internship (or any other template) content unless the user actually provided that decision.
- Identify justified cognitive biases only when they plausibly apply to the stated reasoning. Name the bias and why it might apply here. Do not force a list of unrelated biases.

COVER these lenses:
- Blind spots (overlooked factors, unstated conflicts, second-order effects)
- Assumptions (including fact vs assumption)
- Missing information (what would reduce uncertainty)
- Risks and trade-offs (tensions, not a verdict)
- Alternative perspectives (other stakeholders or future-self views)
- Justified cognitive biases (woven into assumptions and/or blind spots as labeled items)
- Thoughtful reflection questions (open, non-leading — they must not smuggle in an answer)

OUTPUT: valid JSON only matching the schema. Be concrete and decision-specific. 4–6 items per list.`

const stringArray = {
  type: Type.ARRAY,
  items: { type: Type.STRING },
}

export const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    decisionSummary: {
      type: Type.STRING,
      description:
        'Neutral 2–4 sentence recap of the decision and how the user currently frames it. No recommendation.',
    },
    blindSpots: stringArray,
    assumptions: stringArray,
    missingInformation: stringArray,
    risksAndTradeoffs: stringArray,
    alternativePerspectives: stringArray,
    reflectionQuestions: stringArray,
    cognitiveBiases: stringArray,
    map: {
      type: Type.OBJECT,
      properties: {
        know: stringArray,
        assume: stringArray,
        missing: stringArray,
        investigate: stringArray,
      },
      required: ['know', 'assume', 'missing', 'investigate'],
    },
  },
  required: [
    'decisionSummary',
    'blindSpots',
    'assumptions',
    'missingInformation',
    'risksAndTradeoffs',
    'alternativePerspectives',
    'reflectionQuestions',
    'cognitiveBiases',
    'map',
  ],
}

export interface AnalyzePayload {
  decision?: string
  options?: string
  importantFactors?: string
  currentLeaning?: string
  leaningReason?: string
}

export interface GeminiAnalysis {
  decisionSummary: string
  blindSpots: string[]
  assumptions: string[]
  missingInformation: string[]
  risksAndTradeoffs: string[]
  alternativePerspectives: string[]
  reflectionQuestions: string[]
  cognitiveBiases?: string[]
  map?: {
    know: string[]
    assume: string[]
    missing: string[]
    investigate: string[]
  }
}

function buildUserPrompt(input: AnalyzePayload): string {
  return `Analyze this decision for blind spots. Do not decide for the user.

Decision:
${input.decision?.trim() || '(not provided)'}

Options:
${input.options?.trim() || '(not provided)'}

Important factors:
${input.importantFactors?.trim() || '(not provided)'}

What the user currently thinks (current leaning):
${input.currentLeaning?.trim() || '(not provided)'}

Why they are leaning that way:
${input.leaningReason?.trim() || '(not provided)'}

Return JSON only.`
}

function extractText(response: unknown): string {
  const r = response as { text?: string; candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }
  if (typeof r.text === 'string' && r.text.trim()) return r.text
  const parts = r.candidates?.[0]?.content?.parts
  if (Array.isArray(parts)) {
    return parts.map((p) => p.text ?? '').join('')
  }
  return ''
}

function parseJson(raw: string): GeminiAnalysis {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
  const parsed = JSON.parse(cleaned) as GeminiAnalysis
  if (!parsed || typeof parsed.decisionSummary !== 'string') {
    throw new Error('Model returned an unexpected analysis shape.')
  }
  return parsed
}

const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-flash-latest']

export async function generateAnalysis(input: AnalyzePayload): Promise<GeminiAnalysis> {
  const apiKey = process.env.GEMINI_API_KEY?.trim()
  if (!apiKey) {
    throw new Error('Server is missing GEMINI_API_KEY. Add it to your .env file.')
  }

  const ai = new GoogleGenAI({ apiKey })
  const contents = buildUserPrompt(input)
  let lastError: unknown

  for (const model of MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.6,
          responseMimeType: 'application/json',
          responseSchema: ANALYSIS_SCHEMA,
        },
      })
      const text = extractText(response)
      if (!text.trim()) {
        throw new Error('Empty model response.')
      }
      return parseJson(text)
    } catch (err) {
      lastError = err
    }
  }

  const message =
    lastError instanceof Error ? lastError.message : 'Gemini request failed.'
  throw new Error(message)
}

export function publicAnalysisJson(full: GeminiAnalysis) {
  return {
    decisionSummary: full.decisionSummary,
    blindSpots: asStringArray(full.blindSpots),
    assumptions: asStringArray(full.assumptions),
    missingInformation: asStringArray(full.missingInformation),
    risksAndTradeoffs: asStringArray(full.risksAndTradeoffs),
    alternativePerspectives: asStringArray(full.alternativePerspectives),
    reflectionQuestions: asStringArray(full.reflectionQuestions),
    cognitiveBiases: asStringArray(full.cognitiveBiases),
    map: {
      know: asStringArray(full.map?.know),
      assume: asStringArray(full.map?.assume),
      missing: asStringArray(full.map?.missing),
      investigate: asStringArray(full.map?.investigate),
    },
  }
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
}
