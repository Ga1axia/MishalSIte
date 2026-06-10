import { checkCredentials, setAuthCookie, signToken } from '../lib/auth.js'
import { json, readBody } from '../lib/http.js'

export default async function handler(req, res) {
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
