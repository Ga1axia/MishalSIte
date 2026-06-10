import { requireAdmin } from '../../lib/auth.js'
import { json } from '../../lib/http.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return json(res, 405, { error: 'Method not allowed' })
  }

  const admin = await requireAdmin(req)
  if (!admin) return json(res, 401, { error: 'Not authenticated' })
  return json(res, 200, { ok: true, username: admin.sub })
}
