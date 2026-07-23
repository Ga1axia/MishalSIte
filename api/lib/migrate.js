/** Idempotent schema updates for production DBs created before newer columns. */
export async function ensureDbReady(sql) {
  await sql`ALTER TABLE gallery_settings ADD COLUMN IF NOT EXISTS phone TEXT`
  await sql`ALTER TABLE gallery_settings ADD COLUMN IF NOT EXISTS coming_soon_enabled BOOLEAN NOT NULL DEFAULT false`
  await sql`ALTER TABLE gallery_settings ADD COLUMN IF NOT EXISTS launch_date DATE`
  await sql`ALTER TABLE gallery_settings ADD COLUMN IF NOT EXISTS coming_soon_headline TEXT`
  await sql`ALTER TABLE gallery_settings ADD COLUMN IF NOT EXISTS coming_soon_message TEXT`
  await sql`ALTER TABLE gallery_settings ADD COLUMN IF NOT EXISTS coming_soon_image_url TEXT`
  await sql`ALTER TABLE gallery_settings ADD COLUMN IF NOT EXISTS about_headline TEXT`
  await sql`ALTER TABLE gallery_settings ADD COLUMN IF NOT EXISTS about_image_url TEXT`

  await sql`
    CREATE TABLE IF NOT EXISTS mailing_list (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS idx_mailing_list_created ON mailing_list(created_at DESC)`

  await sql`
    INSERT INTO gallery_settings (id, name, team, coming_soon_enabled)
    VALUES (1, ${'25 West Gallery'}, ${JSON.stringify([])}, ${false})
    ON CONFLICT (id) DO NOTHING
  `
}
