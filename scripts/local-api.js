/**
 * Local dev API server — runs Vercel-style handlers on port 3000 so
 * `npm run dev` (Vite + proxy) can reach /api/* without `vercel dev`.
 */
import { createServer } from 'http'
import { loadEnv } from '../api/lib/env.js'

loadEnv()

const PORT = Number(process.env.API_PORT) || 3000

async function readRawBody(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  return Buffer.concat(chunks)
}

function attachQuery(req, query) {
  req.query = query
}

async function dispatch(req, res) {
  const url = new URL(req.url, `http://localhost:${PORT}`)
  const path = url.pathname
  const method = req.method

  try {
    // Static routes
    if (path === '/api/content' && method === 'GET') {
      const handler = (await import('../api/content.js')).default
      return handler(req, res)
    }

    if (path === '/api/auth/login' && method === 'POST') {
      const handler = (await import('../api/auth/login.js')).default
      return handler(req, res)
    }

    if (path === '/api/auth/logout' && method === 'POST') {
      const handler = (await import('../api/auth/logout.js')).default
      return handler(req, res)
    }

    if (path === '/api/auth/me' && method === 'GET') {
      const handler = (await import('../api/auth/me.js')).default
      return handler(req, res)
    }

    if (path === '/api/admin/upload' && method === 'POST') {
      const handler = (await import('../api/admin/upload.js')).default
      return handler(req, res)
    }

    // /api/admin/:resource/:id
    const itemMatch = path.match(/^\/api\/admin\/([^/]+)\/([^/]+)$/)
    if (itemMatch) {
      attachQuery(req, { resource: itemMatch[1], id: itemMatch[2] })
      const handler = (await import('../api/admin/[resource]/[id].js')).default
      return handler(req, res)
    }

    // /api/admin/:resource
    const listMatch = path.match(/^\/api\/admin\/([^/]+)$/)
    if (listMatch) {
      attachQuery(req, { resource: listMatch[1] })
      const handler = (await import('../api/admin/[resource].js')).default
      return handler(req, res)
    }

    res.statusCode = 404
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Not found', path }))
  } catch (err) {
    console.error(`[api] ${method} ${path}`, err)
    if (!res.headersSent) {
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: err.message || 'Internal server error' }))
    }
  }
}

const server = createServer(async (req, res) => {
  // Re-play body for handlers that read the stream (already consumed if we read here)
  // Handlers use readBody(req) on the stream — do not pre-read.
  await dispatch(req, res)
})

server.listen(PORT, () => {
  const db = process.env.DATABASE_URL || process.env.POSTGRES_URL
  console.log(`[api] Local API → http://localhost:${PORT}`)
  console.log(`[api] Database: ${db ? 'connected (URL set)' : 'MISSING — add DATABASE_URL to .env'}`)
  console.log(`[api] Auth: ${process.env.JWT_SECRET ? 'JWT_SECRET set' : 'MISSING JWT_SECRET'}`)
})
