import { neon } from '@neondatabase/serverless'
import { getDatabaseUrl, loadEnv } from './env.js'

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
