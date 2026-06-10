import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { neon } from '@neondatabase/serverless'
import {
  ARTISTS,
  WORKS,
  EXHIBITIONS,
  EVENTS,
  OPPORTUNITIES,
  GALLERY,
} from '../src/data/content.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function main() {
  const url = process.env.DATABASE_URL
  if (!url) {
    console.error('DATABASE_URL is not set. Add it to .env or your environment.')
    process.exit(1)
  }

  const sql = neon(url)
  const schema = readFileSync(join(__dirname, '../db/schema.sql'), 'utf8')
  const statements = schema
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s && !s.startsWith('--'))

  for (const statement of statements) {
    await sql(statement)
  }
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
      VALUES (${a.slug}, ${a.name}, ${a.discipline}, ${a.seed}, ${a.bio}, ${a.statement}, ${a.links}, ${a.exhibitions})
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
      VALUES (${e.slug}, ${e.title}, ${e.artists}, ${e.start}, ${e.end}, ${e.status}, ${e.seed}, ${e.statement}, ${e.works}, ${e.installSeeds})
    `
  }
  console.log(`Seeded ${EXHIBITIONS.length} exhibitions.`)

  for (const ev of EVENTS) {
    await sql`
      INSERT INTO events (slug, title, type, date, time, description, rsvp, related)
      VALUES (${ev.slug}, ${ev.title}, ${ev.type}, ${ev.date}, ${ev.time}, ${ev.description}, ${ev.rsvp}, ${ev.related})
    `
  }
  console.log(`Seeded ${EVENTS.length} events.`)

  for (const o of OPPORTUNITIES) {
    await sql`
      INSERT INTO opportunities (slug, title, kind, deadline, show_dates, compensation, process, materials, apply_href, statement)
      VALUES (${o.slug}, ${o.title}, ${o.kind}, ${o.deadline}, ${o.showDates}, ${o.compensation}, ${o.process}, ${o.materials}, ${o.applyHref}, ${o.statement})
    `
  }
  console.log(`Seeded ${OPPORTUNITIES.length} opportunities.`)

  await sql`
    INSERT INTO gallery_settings (id, name, email, instagram, instagram_href, address, hours, mission, philosophy, team)
    VALUES (1, ${GALLERY.name}, ${GALLERY.email}, ${GALLERY.instagram}, ${GALLERY.instagramHref}, ${GALLERY.address}, ${GALLERY.hours}, ${GALLERY.mission}, ${GALLERY.philosophy}, ${GALLERY.team})
  `
  console.log('Seeded gallery settings.')
  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
