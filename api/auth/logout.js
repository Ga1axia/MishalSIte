import { clearAuthCookie } from '../../lib/auth.js'
import { json } from '../../lib/http.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return json(res, 405, { error: 'Method not allowed' })
  }

  clearAuthCookie(res)
  return json(res, 200, { ok: true })
}
