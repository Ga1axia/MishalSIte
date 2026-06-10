import { requireAdmin } from '../../lib/auth.js'
import { json, readBody } from '../../lib/http.js'
import { getResource, getResourceById, updateResource, deleteResource } from '../../lib/crud.js'

export default async function handler(req, res) {
  const admin = await requireAdmin(req)
  if (!admin) return json(res, 401, { error: 'Not authenticated' })

  const { resource, id } = req.query
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
