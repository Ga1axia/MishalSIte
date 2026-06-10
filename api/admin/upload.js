import { put } from '@vercel/blob'
import { requireAdmin } from '../lib/auth.js'
import { json, readBody } from '../lib/http.js'

export default async function handler(req, res) {
  const admin = await requireAdmin(req)
  if (!admin) return json(res, 401, { error: 'Not authenticated' })

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return json(res, 405, { error: 'Method not allowed' })
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return json(res, 500, { error: 'BLOB_READ_WRITE_TOKEN is not configured' })
  }

  try {
    const body = await readBody(req)
    const { base64, filename = 'upload.jpg', contentType = 'image/jpeg' } = body

    if (!base64) return json(res, 400, { error: 'No image data provided' })

    const data = Buffer.from(base64, 'base64')
    const safeName = String(filename).replace(/[^a-zA-Z0-9._-]/g, '_')

    const blob = await put(`uploads/${Date.now()}-${safeName}`, data, {
      access: 'public',
      contentType,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    return json(res, 200, { url: blob.url })
  } catch (err) {
    console.error('POST /api/admin/upload', err)
    return json(res, 500, { error: 'Upload failed' })
  }
}
