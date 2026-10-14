import type { AnalysisResult, DecisionInput } from '../types'

export const DEMO_DECISION: DecisionInput = {
  decision: 'Should I accept a 6-month internship?',
  options: 'Accept the internship / Continue focusing on college',
  factors: 'Stipend, location, industry experience, college schedule',
  currentThinking:
    'The stipend is good, the company is close to home, and it gives me industry experience.',
  leaningReason:
    'I feel ready to get real-world experience and the offer seems convenient enough that I would regret turning it down.',
}

export function generateMockAnalysis(input: DecisionInput): AnalysisResult {
  const isDemo =
    input.decision.toLowerCase().includes('internship') ||
    input.decision === DEMO_DECISION.decision

  if (isDemo) {
    return {
      decisionSummary:
        'You are weighing a 6-month internship against staying focused on college. Your current reasoning emphasizes stipend, proximity, and industry experience — strong surface signals — but several academic, mentorship, and long-term career factors remain underexamined.',
      blindSpots: [
        'Impact of a full-time internship on coursework, exams, and GPA over the next two semesters',
        'Quality and structure of mentorship — not just the existence of an internship title',
        'Whether this role aligns with the career path you want 2–3 years from now',
        'Opportunity cost: projects, research, clubs, or coursework you would pause',
        'How convertible or portable this experience is if you change industries later',
      ],
      assumptions: [
        'A good stipend means the opportunity is overall worth taking',
        'Being close to home automatically reduces stress and friction',
        'Any industry experience is equally valuable for your goals',
        'Your college schedule can absorb a 6-month commitment without major trade-offs',
        'You will still have comparable options later if you pass on this one',
      ],
      missingInformation: [
        'Weekly hours expected and flexibility around exams or deadlines',
        'Who you would report to and how often you would receive feedback',
        'Whether the role includes meaningful ownership or mostly support tasks',
        'How previous interns fared — conversions, recommendations, skill growth',
        'Exact academic policies for leave, attendance, and credit during internships',
      ],
      risksTradeoffs: [
        'Short-term career signal vs. possible academic disruption',
        'Convenience of location vs. stretch of joining a stronger but farther opportunity later',
        'Immediate income vs. unfinished learning and campus experiences',
        'Building one company’s context vs. staying optionality-open for exploration',
        'Burnout risk if you try to fully maintain both internship and college intensity',
      ],
      alternativePerspectives: [
        'A professor or academic advisor might prioritize continuity through a critical semester',
        'A career mentor might ask whether this company/role matches your intended specialty',
        'A peer who took a similar internship might highlight culture and learning pace over stipend',
        'Your future self might value depth of skill and recommendation letters more than proximity',
        'A recruiter might care less about “any internship” and more about relevant project outcomes',
      ],
      reflectionQuestions: [
        'If the stipend were average instead of good, would you still lean toward accepting?',
        'What would have to be true about mentorship and learning for this to feel like a clear yes?',
        'Which college obligations are non-negotiable over the next six months?',
        'What evidence would tell you this role accelerates — rather than just occupies — your career path?',
        'If you decline, what concrete plan would make you feel equally confident in six months?',
      ],
      map: {
        know: [
          'Stipend is attractive',
          'Company is close to home',
          'Role offers industry experience',
          'Options: accept vs. stay in college',
        ],
        assume: [
          'Proximity reduces overall friction',
          'Industry experience alone is enough upside',
          'College schedule can flex around the role',
          'This timing is roughly as good as later options',
        ],
        missing: [
          'Mentorship quality and feedback loops',
          'True weekly time load during exams',
          'Long-term career fit of the work',
          'Academic policy and grade impact',
        ],
        investigate: [
          'Talk to past interns about day-to-day reality',
          'Map internship hours against your semester calendar',
          'Ask for role scope, manager style, and success metrics',
          'Compare against one alternate path if you stay in college',
        ],
      },
    }
  }

  return {
    decisionSummary: `You are deciding: “${input.decision}.” Your current framing emphasizes ${input.factors || 'a few visible factors'}, and you are leaning based on: “${input.currentThinking || 'what feels most compelling right now'}.” The analysis below surfaces what may be underweighted.`,
    blindSpots: [
      'Factors outside your listed priorities that could change the outcome',
      'Second-order effects after the decision is made',
      'Whose advice or incentives are shaping what feels “obvious”',
      'Information you would only learn after committing',
      'Emotional drivers being framed as purely rational reasons',
    ],
    assumptions: [
      'The options you listed are the only realistic ones',
      'The factors you named are complete and correctly weighted',
      `Your current thinking (“${truncate(input.currentThinking)}”) captures the full picture`,
      'Conditions will stay roughly stable after you decide',
      'Waiting or gathering more data has little value',
    ],
    missingInformation: [
      'Hard constraints vs. preferences among your important factors',
      'Evidence that would falsify your current leaning',
      'Perspectives from people affected by — but not deciding — this choice',
      'Base rates or precedents for similar decisions',
      'Exit ramps if the chosen path underperforms',
    ],
    risksTradeoffs: [
      'Speed of deciding vs. quality of information',
      'Optimizing for one factor may worsen others you care about',
      'Reversibility: how costly is it to unwind this choice?',
      'Identity and reputation effects beyond the immediate outcome',
      'Opportunity cost of not pursuing the alternative option',
    ],
    alternativePerspectives: [
      'Someone optimizing for long-term optionality might weigh differently',
      'A risk-averse advisor might stress downside protection first',
      'A growth-oriented peer might prioritize learning over comfort',
      'A future-you lens: which regret feels harder to live with?',
      'An outsider with no stake might question your default framing',
    ],
    reflectionQuestions: [
      'Which of your stated factors is doing the most work in your leaning — and is that justified?',
      'What would someone who disagrees with you say you are overlooking?',
      'If you had to defend the opposite option for five minutes, what would you argue?',
      'What information, if learned this week, would most change your confidence?',
      'How will you know, three months from now, whether this was a sound process?',
    ],
    map: {
      know: splitList(input.factors, [
        'Your stated decision and options',
        'Your current leaning and rationale',
        'The factors you already named',
      ]),
      assume: [
        'Your framing of the options is complete',
        'Visible benefits outweigh hidden costs',
        'Your leaning reason generalizes beyond this moment',
      ],
      missing: [
        'Disconfirming evidence',
        'Stakeholder perspectives not yet heard',
        'Constraints you have not quantified',
        'Downstream consequences after choosing',
      ],
      investigate: [
        'List what would change your mind',
        'Pressure-test assumptions with one contrary source',
        'Compare options against a clear success definition',
        'Identify one reversible experiment before locking in',
      ],
    },
  }
}

function truncate(value: string, max = 80): string {
  const trimmed = value.trim()
  if (!trimmed) return 'your current view'
  return trimmed.length > max ? `${trimmed.slice(0, max)}…` : trimmed
}

function splitList(value: string, fallback: string[]): string[] {
  const parts = value
    .split(/[,/|]/)
    .map((part) => part.trim())
    .filter(Boolean)
  return parts.length ? parts.slice(0, 4) : fallback
}
