import { getSql } from './lib/db.js'
import { buildPublicPayload } from './lib/transform.js'
import { json } from './lib/http.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.statusCode = 405
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
    const msg = err.message?.includes('not set')
      ? err.message
      : 'Failed to load content'
    return json(res, 500, { error: msg })
  }
}
