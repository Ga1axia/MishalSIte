import { neon } from '@neondatabase/serverless'
import {
  ARTISTS,
  WORKS,
  EXHIBITIONS,
  EVENTS,
  OPPORTUNITIES,
  GALLERY,
} from '../src/data/content.js'
import { getDatabaseUrl, loadEnv } from '../api/lib/env.js'

async function applySchema(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS artists (
      slug TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      discipline TEXT,
      seed TEXT NOT NULL,
      image_url TEXT,
      bio TEXT,
      statement TEXT,
      links JSONB NOT NULL DEFAULT '[]',
      exhibitions JSONB NOT NULL DEFAULT '[]',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS works (
      id TEXT PRIMARY KEY,
      artist TEXT NOT NULL REFERENCES artists(slug) ON DELETE CASCADE,
      title TEXT NOT NULL,
      medium TEXT,
      dimensions TEXT,
      price TEXT,
      seed TEXT NOT NULL,
      image_url TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS exhibitions (
      slug TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      artists JSONB NOT NULL DEFAULT '[]',
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      status TEXT NOT NULL DEFAULT 'archive',
      seed TEXT NOT NULL,
      image_url TEXT,
      statement TEXT,
      works JSONB NOT NULL DEFAULT '[]',
      install_seeds JSONB NOT NULL DEFAULT '[]',
      install_images JSONB NOT NULL DEFAULT '[]',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS events (
      slug TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      type TEXT,
      date DATE NOT NULL,
      time TEXT,
      description TEXT,
      rsvp TEXT,
      related JSONB NOT NULL DEFAULT '{}',
      image_url TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS opportunities (
      slug TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      kind TEXT,
      deadline DATE,
      show_dates TEXT,
      compensation TEXT,
      process TEXT,
      materials JSONB NOT NULL DEFAULT '[]',
      apply_href TEXT,
      statement TEXT,
      image_url TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS gallery_settings (
      id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
      name TEXT,
      email TEXT,
      instagram TEXT,
      instagram_href TEXT,
      address TEXT,
      hours TEXT,
      mission TEXT,
      philosophy TEXT,
      team JSONB NOT NULL DEFAULT '[]',
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS idx_works_artist ON works(artist)`
  await sql`CREATE INDEX IF NOT EXISTS idx_exhibitions_status ON exhibitions(status)`
  await sql`CREATE INDEX IF NOT EXISTS idx_events_date ON events(date)`
}

async function main() {
  loadEnv()

  const url = getDatabaseUrl()
  if (!url) {
    console.error('DATABASE_URL or POSTGRES_URL is not set. Add it to .env')
    process.exit(1)
  }

  const sql = neon(url)

  await applySchema(sql)
  console.log('Schema applied.')

  await sql`DELETE FROM works`
  await sql`DELETE FROM exhibitions`
  await sql`DELETE FROM events`
  await sql`DELETE FROM opportunities`
  await sql`DELETE FROM artists`
  await sql`DELETE FROM gallery_settings`

  for (const a of ARTISTS) {
    await sql`
      INSERT INTO artists (slug, name, discipline, seed, bio, statement, links, exhibitions)
      VALUES (${a.slug}, ${a.name}, ${a.discipline}, ${a.seed}, ${a.bio}, ${a.statement}, ${JSON.stringify(a.links)}, ${JSON.stringify(a.exhibitions)})
    `
  }
  console.log(`Seeded ${ARTISTS.length} artists.`)

  for (const w of WORKS) {
    await sql`
      INSERT INTO works (id, artist, title, medium, dimensions, price, seed)
      VALUES (${w.id}, ${w.artist}, ${w.title}, ${w.medium}, ${w.dimensions}, ${w.price}, ${w.seed})
    `
  }
  console.log(`Seeded ${WORKS.length} works.`)

  for (const e of EXHIBITIONS) {
    await sql`
      INSERT INTO exhibitions (slug, title, artists, start_date, end_date, status, seed, statement, works, install_seeds)
      VALUES (${e.slug}, ${e.title}, ${JSON.stringify(e.artists)}, ${e.start}, ${e.end}, ${e.status}, ${e.seed}, ${e.statement}, ${JSON.stringify(e.works)}, ${JSON.stringify(e.installSeeds)})
    `
  }
  console.log(`Seeded ${EXHIBITIONS.length} exhibitions.`)

  for (const ev of EVENTS) {
    await sql`
      INSERT INTO events (slug, title, type, date, time, description, rsvp, related)
      VALUES (${ev.slug}, ${ev.title}, ${ev.type}, ${ev.date}, ${ev.time}, ${ev.description}, ${ev.rsvp}, ${JSON.stringify(ev.related)})
    `
  }
  console.log(`Seeded ${EVENTS.length} events.`)

  for (const o of OPPORTUNITIES) {
    await sql`
      INSERT INTO opportunities (slug, title, kind, deadline, show_dates, compensation, process, materials, apply_href, statement)
      VALUES (${o.slug}, ${o.title}, ${o.kind}, ${o.deadline}, ${o.showDates}, ${o.compensation}, ${o.process}, ${JSON.stringify(o.materials)}, ${o.applyHref}, ${o.statement})
    `
  }
  console.log(`Seeded ${OPPORTUNITIES.length} opportunities.`)

  await sql`
    INSERT INTO gallery_settings (id, name, email, instagram, instagram_href, address, hours, mission, philosophy, team)
    VALUES (1, ${GALLERY.name}, ${GALLERY.email}, ${GALLERY.instagram}, ${GALLERY.instagramHref}, ${GALLERY.address}, ${GALLERY.hours}, ${GALLERY.mission}, ${GALLERY.philosophy}, ${JSON.stringify(GALLERY.team)})
  `
  console.log('Seeded gallery settings.')
  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
