import { requireAdmin } from '../lib/auth.js'
import { json, readBody } from '../lib/http.js'
import { getResource, listResource, createResource } from '../lib/crud.js'

export default async function handler(req, res) {
  const admin = await requireAdmin(req)
  if (!admin) return json(res, 401, { error: 'Not authenticated' })

  const { resource } = req.query
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
