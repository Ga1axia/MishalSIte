import { neon } from '@neondatabase/serverless'
import { getDatabaseUrl, loadEnv } from './env.js'
import { ensureDbReady } from './migrate.js'

let readyPromise = null

export function getSql() {
  loadEnv()
  const url = getDatabaseUrl()
  if (!url) {
    throw new Error(
      'Database URL not set. Add DATABASE_URL or POSTGRES_URL to .env / Vercel env vars.',
    )
  }
  return neon(url)
}

/** Run once per cold start — adds any missing columns/tables. */
export function prepareDatabase() {
  if (!readyPromise) {
    readyPromise = (async () => {
      const sql = getSql()
      await ensureDbReady(sql)
    })().catch((err) => {
      readyPromise = null
      throw err
    })
  }
  return readyPromise
}
