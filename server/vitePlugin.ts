import type { Plugin } from 'vite'
import { handleAnalyzeRequest, isAnalyzePath } from './handleAnalyze.ts'

export function geminiApiPlugin(): Plugin {
  return {
    name: 'blindspot-gemini-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!isAnalyzePath(req.url)) {
          next()
          return
        }
        void handleAnalyzeRequest(req, res)
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!isAnalyzePath(req.url)) {
          next()
          return
        }
        void handleAnalyzeRequest(req, res)
      })
    },
  }
}
