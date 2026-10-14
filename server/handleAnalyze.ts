import type { IncomingMessage, ServerResponse } from 'node:http'
import { generateAnalysis, publicAnalysisJson, type AnalyzePayload } from './gemini.ts'

function readJsonBody(req: IncomingMessage): Promise<AnalyzePayload> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => {
      chunks.push(chunk)
      const size = chunks.reduce((n, c) => n + c.length, 0)
      if (size > 200_000) {
        reject(new Error('Request body too large.'))
        req.destroy()
      }
    })
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8')
        resolve(raw ? (JSON.parse(raw) as AnalyzePayload) : {})
      } catch {
        reject(new Error('Invalid JSON body.'))
      }
    })
    req.on('error', reject)
  })
}

function send(res: ServerResponse, status: number, body: unknown) {
  const json = JSON.stringify(body)
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(json)
}

export async function handleAnalyzeRequest(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return
  }

  if (req.method !== 'POST') {
    send(res, 405, { error: 'Method not allowed. Use POST.' })
    return
  }

  let payload: AnalyzePayload
  try {
    payload = await readJsonBody(req)
  } catch (err) {
    send(res, 400, {
      error: err instanceof Error ? err.message : 'Invalid request body.',
    })
    return
  }

  const decision = payload.decision?.trim()
  if (!decision) {
    send(res, 400, { error: 'A decision is required.' })
    return
  }

  try {
    const analysis = await generateAnalysis({
      decision,
      options: payload.options,
      importantFactors: payload.importantFactors,
      currentLeaning: payload.currentLeaning,
      leaningReason: payload.leaningReason,
    })
    send(res, 200, publicAnalysisJson(analysis))
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Analysis failed.'
    const status = message.includes('GEMINI_API_KEY') ? 500 : 502
    send(res, status, { error: message })
  }
}

export function isAnalyzePath(url?: string): boolean {
  if (!url) return false
  const path = url.split('?')[0]
  return path === '/api/analyze' || path === '/api/analyze/'
}
