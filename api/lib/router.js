import { handleUpload as handleBlobUpload } from '@vercel/blob/client'
import { getSql } from './db.js'
import { buildPublicPayload } from './transform.js'
import { json, readBody } from './http.js'
import {
  checkCredentials,
  setAuthCookie,
  signToken,
  clearAuthCookie,
  requireAdmin,
} from './auth.js'
import {
  getResource,
  listResource,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
} from './crud.js'
import { loadEnv } from './env.js'

loadEnv()

function segmentsFromQuery(query) {
  const raw = query.path
  if (!raw) return []
  if (Array.isArray(raw)) return raw.filter(Boolean)
  return String(raw).split('/').filter(Boolean)
}

function resolveSegments(req) {
  const fromQuery = segmentsFromQuery(req.query)
  if (fromQuery.length) return fromQuery

  const urlStr = req.url || ''
  try {
    const url = new URL(urlStr, 'https://localhost')
    const pathParam = url.searchParams.get('path')
    if (pathParam) return pathParam.split('/').filter(Boolean)
    const fromPath = segmentsFromUrl(url.pathname)
    if (fromPath.length && fromPath[0] !== 'handler') return fromPath
  } catch {
    /* ignore malformed URLs */
  }
  return []
}

async function handleContent(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return json(res, 405, { error: 'Method not allowed' })
  }
  try {
    const sql = getSql()
    const [artists, works, exhibitions, events, opportunities, galleryRows] = await Promise.all([
      sql`SELECT * FROM artists ORDER BY name`,
      sql`SELECT * FROM works ORDER BY id`,
      sql`SELECT * FROM exhibitions ORDER BY start_date DESC`,
      sql`SELECT * FROM events ORDER BY date ASC`,
      sql`SELECT * FROM opportunities ORDER BY deadline ASC`,
      sql`SELECT * FROM gallery_settings WHERE id = 1`,
    ])
    const payload = buildPublicPayload({
      artists,
      works,
      exhibitions,
      events,
      opportunities,
      gallery: galleryRows[0] ?? null,
    })
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
    return json(res, 200, payload)
  } catch (err) {
    console.error('GET /api/content', err)
    const msg = err.message?.includes('not set') ? err.message : 'Failed to load content'
    return json(res, 500, { error: msg })
  }
}

async function handleLogin(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return json(res, 405, { error: 'Method not allowed' })
  }
  try {
    const body = await readBody(req)
    const { username, password } = body
    if (!checkCredentials(username, password)) {
      return json(res, 401, { error: 'Invalid credentials' })
    }
    const token = await signToken(username)
    setAuthCookie(res, token)
    return json(res, 200, { ok: true, username })
  } catch (err) {
    console.error('POST /api/auth/login', err)
    return json(res, 500, { error: 'Login failed' })
  }
}

async function handleLogout(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return json(res, 405, { error: 'Method not allowed' })
  }
  clearAuthCookie(res)
  return json(res, 200, { ok: true })
}

async function handleMe(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return json(res, 405, { error: 'Method not allowed' })
  }
  const admin = await requireAdmin(req)
  if (!admin) return json(res, 401, { error: 'Not authenticated' })
  return json(res, 200, { ok: true, username: admin.sub })
}

async function handleUpload(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return json(res, 405, { error: 'Method not allowed' })
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return json(res, 500, { error: 'BLOB_READ_WRITE_TOKEN is not configured' })
  }
  try {
    const body = await readBody(req)
    const jsonResponse = await handleBlobUpload({
      body,
      request: req,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      onBeforeGenerateToken: async () => {
        const admin = await requireAdmin(req)
        if (!admin) throw new Error('Not authenticated')
        return {
          allowedContentTypes: [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
            'image/avif',
          ],
          maximumSizeInBytes: 15 * 1024 * 1024,
        }
      },
      onUploadCompleted: async () => {
        // URL is returned to the browser; nothing else to persist here.
      },
    })
    return json(res, 200, jsonResponse)
  } catch (err) {
    console.error('POST /api/admin/upload', err)
    const msg = err.message || 'Upload failed'
    if (msg === 'Not authenticated') return json(res, 401, { error: msg })
    return json(res, 400, { error: msg })
  }
}

async function handleAdminList(req, res, resource) {
  const admin = await requireAdmin(req)
  if (!admin) return json(res, 401, { error: 'Not authenticated' })
  const config = getResource(resource)
  if (!config) return json(res, 404, { error: 'Unknown resource' })
  if (config.singleton && req.method !== 'GET') {
    return json(res, 400, { error: 'Use PUT /api/admin/gallery/1 to update gallery settings' })
  }
  try {
    if (req.method === 'GET') {
      const items = await listResource(resource)
      return json(res, 200, { items })
    }
    if (req.method === 'POST') {
      if (config.singleton) return json(res, 405, { error: 'Gallery cannot be created' })
      const body = await readBody(req)
      const item = await createResource(resource, body)
      return json(res, 201, { item })
    }
    res.setHeader('Allow', config.singleton ? 'GET' : 'GET, POST')
    return json(res, 405, { error: 'Method not allowed' })
  } catch (err) {
    console.error(`admin/${resource}`, err)
    const msg = err?.code === '23505' ? 'Record already exists' : 'Request failed'
    return json(res, 500, { error: msg })
  }
}

async function handleAdminItem(req, res, resource, id) {
  const admin = await requireAdmin(req)
  if (!admin) return json(res, 401, { error: 'Not authenticated' })
  const config = getResource(resource)
  if (!config) return json(res, 404, { error: 'Unknown resource' })
  const recordId = config.singleton ? '1' : id
  try {
    if (req.method === 'GET') {
      const item = await getResourceById(resource, recordId)
      if (!item) return json(res, 404, { error: 'Not found' })
      return json(res, 200, { item })
    }
    if (req.method === 'PUT') {
      const body = await readBody(req)
      const item = await updateResource(resource, recordId, body)
      if (!item) return json(res, 404, { error: 'Not found' })
      return json(res, 200, { item })
    }
    if (req.method === 'DELETE') {
      if (config.singleton) return json(res, 405, { error: 'Gallery cannot be deleted' })
      await deleteResource(resource, recordId)
      return json(res, 200, { ok: true })
    }
    res.setHeader('Allow', config.singleton ? 'GET, PUT' : 'GET, PUT, DELETE')
    return json(res, 405, { error: 'Method not allowed' })
  } catch (err) {
    console.error(`admin/${resource}/${id}`, err)
    return json(res, 500, { error: 'Request failed' })
  }
}

/** Route by path segments, e.g. ['content'] or ['auth','login'] */
export async function routeApi(req, res, segments) {
  const path = segments.join('/')

  if (path === 'content') return handleContent(req, res)
  if (path === 'auth/login') return handleLogin(req, res)
  if (path === 'auth/logout') return handleLogout(req, res)
  if (path === 'auth/me') return handleMe(req, res)
  if (path === 'admin/upload') return handleUpload(req, res)

  const adminItem = path.match(/^admin\/([^/]+)\/([^/]+)$/)
  if (adminItem) return handleAdminItem(req, res, adminItem[1], adminItem[2])

  const adminList = path.match(/^admin\/([^/]+)$/)
  if (adminList) return handleAdminList(req, res, adminList[1])

  return json(res, 404, { error: 'Not found', path: `/api/${path}` })
}

/** Vercel entry — path from rewrite query param or URL pathname */
export default async function vercelHandler(req, res) {
  const segments = resolveSegments(req)
  try {
    await routeApi(req, res, segments)
  } catch (err) {
    console.error(`API /${segments.join('/')}`, err)
    if (!res.headersSent) {
      json(res, 500, { error: err.message || 'Internal server error' })
    }
  }
}

/** Parse pathname like /api/auth/login into segments for local dev server */
export function segmentsFromUrl(pathname) {
  const m = pathname.match(/^\/api\/?(.*)$/)
  if (!m || !m[1]) return []
  return m[1].split('/').filter(Boolean)
}
