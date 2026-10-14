import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import { handleAnalyzeRequest, isAnalyzePath } from './handleAnalyze.ts'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, '../dist')
const port = Number(process.env.PORT) || 5173

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
}

const server = http.createServer((req, res) => {
  if (isAnalyzePath(req.url)) {
    void handleAnalyzeRequest(req, res)
    return
  }

  if (!fs.existsSync(distDir)) {
    res.statusCode = 503
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Frontend build not found. Run npm run build.' }))
    return
  }

  const urlPath = decodeURIComponent((req.url ?? '/').split('?')[0] || '/')
  const safePath = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, '')
  let filePath = path.join(distDir, safePath)

  if (!path.extname(filePath) || !fs.existsSync(filePath)) {
    filePath = path.join(distDir, 'index.html')
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 404
      res.end('Not found')
      return
    }
    res.setHeader('Content-Type', MIME[path.extname(filePath)] ?? 'application/octet-stream')
    res.end(data)
  })
})

server.listen(port, '127.0.0.1', () => {
  console.log(`BlindSpot AI listening on http://127.0.0.1:${port}`)
})
