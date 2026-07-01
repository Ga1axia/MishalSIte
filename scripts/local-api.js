/**
 * Local dev API server — uses the same router as the Vercel catch-all function.
 */
import { createServer } from 'http'
import { loadEnv } from '../api/lib/env.js'
import { prepareDatabase } from '../api/lib/db.js'
import { routeApi, segmentsFromUrl } from '../api/lib/router.js'

loadEnv()

const PORT = Number(process.env.API_PORT) || 3000

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`)
  const segments = segmentsFromUrl(url.pathname)
  try {
    await prepareDatabase()
    await routeApi(req, res, segments)
  } catch (err) {
    console.error(`[api] ${req.method} ${url.pathname}`, err)
    if (!res.headersSent) {
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: err.message || 'Internal server error' }))
    }
  }
})

server.listen(PORT, () => {
  const db = process.env.DATABASE_URL || process.env.POSTGRES_URL
  console.log(`[api] Local API → http://localhost:${PORT}`)
  console.log(`[api] Database: ${db ? 'connected (URL set)' : 'MISSING — add DATABASE_URL to .env'}`)
  console.log(`[api] Auth: ${process.env.JWT_SECRET ? 'JWT_SECRET set' : 'MISSING JWT_SECRET'}`)
})
