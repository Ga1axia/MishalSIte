import { getSql } from './db.js'
import {
  rowToArtist,
  rowToWork,
  rowToExhibition,
  rowToEvent,
  rowToOpportunity,
  rowToGallery,
  artistInput,
  workInput,
  exhibitionInput,
  eventInput,
  opportunityInput,
  galleryInput,
} from './transform.js'

/** Neon HTTP driver needs JSONB values as JSON strings, not raw objects. */
function j(value) {
  return JSON.stringify(value ?? null)
}

export const RESOURCES = {
  artists: { idField: 'slug', toRow: rowToArtist, fromBody: artistInput },
  works: { idField: 'id', toRow: rowToWork, fromBody: workInput },
  exhibitions: { idField: 'slug', toRow: rowToExhibition, fromBody: exhibitionInput },
  events: { idField: 'slug', toRow: rowToEvent, fromBody: eventInput },
  opportunities: { idField: 'slug', toRow: rowToOpportunity, fromBody: opportunityInput },
  gallery: { idField: 'id', singleton: true, toRow: rowToGallery, fromBody: galleryInput },
}

export function getResource(name) {
  return RESOURCES[name] || null
}

async function fetchAll(name) {
  const sql = getSql()
  switch (name) {
    case 'artists':
      return (await sql`SELECT * FROM artists ORDER BY name`).map(rowToArtist)
    case 'works':
      return (await sql`SELECT * FROM works ORDER BY id`).map(rowToWork)
    case 'exhibitions':
      return (await sql`SELECT * FROM exhibitions ORDER BY start_date DESC`).map(rowToExhibition)
    case 'events':
      return (await sql`SELECT * FROM events ORDER BY date ASC`).map(rowToEvent)
    case 'opportunities':
      return (await sql`SELECT * FROM opportunities ORDER BY deadline ASC`).map(rowToOpportunity)
    case 'gallery': {
      const rows = await sql`SELECT * FROM gallery_settings WHERE id = 1`
      return rows[0] ? [rowToGallery(rows[0])] : []
    }
    default:
      return null
  }
}

async function fetchOne(name, id) {
  const sql = getSql()
  switch (name) {
    case 'artists': {
      const rows = await sql`SELECT * FROM artists WHERE slug = ${id}`
      return rows[0] ? rowToArtist(rows[0]) : null
    }
    case 'works': {
      const rows = await sql`SELECT * FROM works WHERE id = ${id}`
      return rows[0] ? rowToWork(rows[0]) : null
    }
    case 'exhibitions': {
      const rows = await sql`SELECT * FROM exhibitions WHERE slug = ${id}`
      return rows[0] ? rowToExhibition(rows[0]) : null
    }
    case 'events': {
      const rows = await sql`SELECT * FROM events WHERE slug = ${id}`
      return rows[0] ? rowToEvent(rows[0]) : null
    }
    case 'opportunities': {
      const rows = await sql`SELECT * FROM opportunities WHERE slug = ${id}`
      return rows[0] ? rowToOpportunity(rows[0]) : null
    }
    case 'gallery': {
      const rows = await sql`SELECT * FROM gallery_settings WHERE id = 1`
      return rows[0] ? rowToGallery(rows[0]) : null
    }
    default:
      return null
  }
}

export async function listResource(name) {
  return fetchAll(name)
}

export async function getResourceById(name, id) {
  return fetchOne(name, id)
}

export async function createResource(name, body) {
  const sql = getSql()
  const resource = getResource(name)
  const data = resource.fromBody(body)

  switch (name) {
    case 'artists':
      await sql`
        INSERT INTO artists (slug, name, discipline, seed, image_url, bio, statement, links, exhibitions)
        VALUES (${data.slug}, ${data.name}, ${data.discipline}, ${data.seed}, ${data.image_url}, ${data.bio}, ${data.statement}, ${j(data.links)}, ${j(data.exhibitions)})
      `
      return fetchOne(name, data.slug)
    case 'works':
      await sql`
        INSERT INTO works (id, artist, title, medium, dimensions, price, seed, image_url)
        VALUES (${data.id}, ${data.artist}, ${data.title}, ${data.medium}, ${data.dimensions}, ${data.price}, ${data.seed}, ${data.image_url})
      `
      return fetchOne(name, data.id)
    case 'exhibitions':
      await sql`
        INSERT INTO exhibitions (slug, title, artists, start_date, end_date, status, seed, image_url, statement, works, install_seeds, install_images)
        VALUES (${data.slug}, ${data.title}, ${j(data.artists)}, ${data.start_date}, ${data.end_date}, ${data.status}, ${data.seed}, ${data.image_url}, ${data.statement}, ${j(data.works)}, ${j(data.install_seeds)}, ${j(data.install_images)})
      `
      return fetchOne(name, data.slug)
    case 'events':
      await sql`
        INSERT INTO events (slug, title, type, date, time, description, rsvp, related, image_url)
        VALUES (${data.slug}, ${data.title}, ${data.type}, ${data.date}, ${data.time}, ${data.description}, ${data.rsvp}, ${j(data.related)}, ${data.image_url})
      `
      return fetchOne(name, data.slug)
    case 'opportunities':
      await sql`
        INSERT INTO opportunities (slug, title, kind, deadline, show_dates, compensation, process, materials, apply_href, statement, image_url)
        VALUES (${data.slug}, ${data.title}, ${data.kind}, ${data.deadline}, ${data.show_dates}, ${data.compensation}, ${data.process}, ${j(data.materials)}, ${data.apply_href}, ${data.statement}, ${data.image_url})
      `
      return fetchOne(name, data.slug)
    default:
      throw new Error('Unsupported resource')
  }
}

export async function updateResource(name, id, body) {
  const sql = getSql()
  const resource = getResource(name)
  const data = resource.fromBody(body)

  switch (name) {
    case 'gallery':
      await sql`
        UPDATE gallery_settings SET
          name = ${data.name},
          email = ${data.email},
          phone = ${data.phone},
          instagram = ${data.instagram},
          instagram_href = ${data.instagram_href},
          address = ${data.address},
          hours = ${data.hours},
          mission = ${data.mission},
          philosophy = ${data.philosophy},
          team = ${j(data.team)},
          coming_soon_enabled = ${data.coming_soon_enabled},
          launch_date = ${data.launch_date},
          coming_soon_headline = ${data.coming_soon_headline},
          coming_soon_message = ${data.coming_soon_message},
          coming_soon_image_url = ${data.coming_soon_image_url},
          about_headline = ${data.about_headline},
          about_image_url = ${data.about_image_url},
          about_quote = ${data.about_quote},
          home_between_headline = ${data.home_between_headline},
          home_between_message = ${data.home_between_message},
          exhibitions_headline = ${data.exhibitions_headline},
          exhibitions_intro = ${data.exhibitions_intro},
          events_headline = ${data.events_headline},
          events_intro = ${data.events_intro},
          artists_headline = ${data.artists_headline},
          artists_intro = ${data.artists_intro},
          opportunities_headline = ${data.opportunities_headline},
          opportunities_intro = ${data.opportunities_intro},
          contact_headline = ${data.contact_headline},
          contact_intro = ${data.contact_intro},
          footer_tagline = ${data.footer_tagline},
          updated_at = NOW()
        WHERE id = 1
      `
      return fetchOne(name, '1')
    case 'artists':
      await sql`
        UPDATE artists SET
          name = ${data.name},
          discipline = ${data.discipline},
          seed = ${data.seed},
          image_url = ${data.image_url},
          bio = ${data.bio},
          statement = ${data.statement},
          links = ${j(data.links)},
          exhibitions = ${j(data.exhibitions)},
          updated_at = NOW()
        WHERE slug = ${id}
      `
      return fetchOne(name, id)
    case 'works':
      await sql`
        UPDATE works SET
          artist = ${data.artist},
          title = ${data.title},
          medium = ${data.medium},
          dimensions = ${data.dimensions},
          price = ${data.price},
          seed = ${data.seed},
          image_url = ${data.image_url},
          updated_at = NOW()
        WHERE id = ${id}
      `
      return fetchOne(name, id)
    case 'exhibitions':
      await sql`
        UPDATE exhibitions SET
          title = ${data.title},
          artists = ${j(data.artists)},
          start_date = ${data.start_date},
          end_date = ${data.end_date},
          status = ${data.status},
          seed = ${data.seed},
          image_url = ${data.image_url},
          statement = ${data.statement},
          works = ${j(data.works)},
          install_seeds = ${j(data.install_seeds)},
          install_images = ${j(data.install_images)},
          updated_at = NOW()
        WHERE slug = ${id}
      `
      return fetchOne(name, id)
    case 'events':
      await sql`
        UPDATE events SET
          title = ${data.title},
          type = ${data.type},
          date = ${data.date},
          time = ${data.time},
          description = ${data.description},
          rsvp = ${data.rsvp},
          related = ${j(data.related)},
          image_url = ${data.image_url},
          updated_at = NOW()
        WHERE slug = ${id}
      `
      return fetchOne(name, id)
    case 'opportunities':
      await sql`
        UPDATE opportunities SET
          title = ${data.title},
          kind = ${data.kind},
          deadline = ${data.deadline},
          show_dates = ${data.show_dates},
          compensation = ${data.compensation},
          process = ${data.process},
          materials = ${j(data.materials)},
          apply_href = ${data.apply_href},
          statement = ${data.statement},
          image_url = ${data.image_url},
          updated_at = NOW()
        WHERE slug = ${id}
      `
      return fetchOne(name, id)
    default:
      throw new Error('Unsupported resource')
  }
}

export async function deleteResource(name, id) {
  const sql = getSql()
  if (name === 'gallery') throw new Error('Cannot delete gallery settings')

  switch (name) {
    case 'artists':
      await sql`DELETE FROM artists WHERE slug = ${id}`
      break
    case 'works':
      await sql`DELETE FROM works WHERE id = ${id}`
      break
    case 'exhibitions':
      await sql`DELETE FROM exhibitions WHERE slug = ${id}`
      break
    case 'events':
      await sql`DELETE FROM events WHERE slug = ${id}`
      break
    case 'opportunities':
      await sql`DELETE FROM opportunities WHERE slug = ${id}`
      break
    default:
      throw new Error('Unsupported resource')
  }
}
