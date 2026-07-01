function dateStr(d) {
  if (!d) return d
  if (typeof d === 'string') return d.slice(0, 10)
  return d.toISOString().slice(0, 10)
}

export function rowToArtist(row) {
  return {
    slug: row.slug,
    name: row.name,
    discipline: row.discipline,
    seed: row.seed,
    imageUrl: row.image_url || null,
    bio: row.bio,
    statement: row.statement,
    links: row.links || [],
    exhibitions: row.exhibitions || [],
  }
}

export function rowToWork(row) {
  return {
    id: row.id,
    artist: row.artist,
    title: row.title,
    medium: row.medium,
    dimensions: row.dimensions,
    price: row.price,
    seed: row.seed,
    imageUrl: row.image_url || null,
  }
}

export function rowToExhibition(row) {
  return {
    slug: row.slug,
    title: row.title,
    artists: row.artists || [],
    start: dateStr(row.start_date),
    end: dateStr(row.end_date),
    status: row.status,
    seed: row.seed,
    imageUrl: row.image_url || null,
    statement: row.statement,
    works: row.works || [],
    installSeeds: row.install_seeds || [],
    installImages: row.install_images || [],
  }
}

export function rowToEvent(row) {
  return {
    slug: row.slug,
    title: row.title,
    type: row.type,
    date: dateStr(row.date),
    time: row.time,
    description: row.description,
    rsvp: row.rsvp,
    related: row.related || {},
    imageUrl: row.image_url || null,
  }
}

export function rowToOpportunity(row) {
  return {
    slug: row.slug,
    title: row.title,
    kind: row.kind,
    deadline: dateStr(row.deadline),
    showDates: row.show_dates,
    compensation: row.compensation,
    process: row.process,
    materials: row.materials || [],
    applyHref: row.apply_href,
    statement: row.statement,
    imageUrl: row.image_url || null,
  }
}

export function rowToGallery(row) {
  if (!row) return null
  return {
    name: row.name,
    email: row.email,
    phone: row.phone || null,
    instagram: row.instagram,
    instagramHref: row.instagram_href,
    address: row.address,
    hours: row.hours,
    mission: row.mission,
    philosophy: row.philosophy,
    team: row.team || [],
    comingSoonEnabled: Boolean(row.coming_soon_enabled),
    launchDate: row.launch_date ? dateStr(row.launch_date) : null,
    comingSoonHeadline: row.coming_soon_headline || null,
    comingSoonMessage: row.coming_soon_message || null,
    comingSoonImageUrl: row.coming_soon_image_url || null,
  }
}

/** Public API shape (camelCase imageUrl for frontend) */
export function buildPublicPayload({ artists, works, exhibitions, events, opportunities, gallery }) {
  return {
    artists: artists.map(rowToArtist),
    works: works.map(rowToWork),
    exhibitions: exhibitions.map(rowToExhibition),
    events: events.map(rowToEvent),
    opportunities: opportunities.map(rowToOpportunity),
    gallery: rowToGallery(gallery),
  }
}

export function artistInput(body) {
  return {
    slug: body.slug,
    name: body.name,
    discipline: body.discipline ?? null,
    seed: body.seed || body.slug,
    image_url: body.imageUrl || body.image_url || null,
    bio: body.bio ?? null,
    statement: body.statement ?? null,
    links: body.links ?? [],
    exhibitions: body.exhibitions ?? [],
  }
}

export function workInput(body) {
  return {
    id: body.id,
    artist: body.artist,
    title: body.title,
    medium: body.medium ?? null,
    dimensions: body.dimensions ?? null,
    price: body.price ?? null,
    seed: body.seed || body.id,
    image_url: body.imageUrl || body.image_url || null,
  }
}

export function exhibitionInput(body) {
  return {
    slug: body.slug,
    title: body.title,
    artists: body.artists ?? [],
    start_date: body.start || body.start_date,
    end_date: body.end || body.end_date,
    status: body.status ?? 'archive',
    seed: body.seed || body.slug,
    image_url: body.imageUrl || body.image_url || null,
    statement: body.statement ?? null,
    works: body.works ?? [],
    install_seeds: body.installSeeds ?? body.install_seeds ?? [],
    install_images: body.installImages ?? body.install_images ?? [],
  }
}

export function eventInput(body) {
  return {
    slug: body.slug,
    title: body.title,
    type: body.type ?? null,
    date: body.date,
    time: body.time ?? null,
    description: body.description ?? null,
    rsvp: body.rsvp ?? null,
    related: body.related ?? {},
    image_url: body.imageUrl || body.image_url || null,
  }
}

export function opportunityInput(body) {
  return {
    slug: body.slug,
    title: body.title,
    kind: body.kind ?? null,
    deadline: body.deadline ?? null,
    show_dates: body.showDates ?? body.show_dates ?? null,
    compensation: body.compensation ?? null,
    process: body.process ?? null,
    materials: body.materials ?? [],
    apply_href: body.applyHref ?? body.apply_href ?? null,
    statement: body.statement ?? null,
    image_url: body.imageUrl || body.image_url || null,
  }
}

export function galleryInput(body) {
  return {
    name: body.name,
    email: body.email,
    phone: body.phone || null,
    instagram: body.instagram,
    instagram_href: body.instagramHref ?? body.instagram_href,
    address: body.address,
    hours: body.hours,
    mission: body.mission,
    philosophy: body.philosophy,
    team: body.team ?? [],
    coming_soon_enabled: Boolean(body.comingSoonEnabled ?? body.coming_soon_enabled),
    launch_date: body.launchDate || body.launch_date || null,
    coming_soon_headline: body.comingSoonHeadline || body.coming_soon_headline || null,
    coming_soon_message: body.comingSoonMessage || body.coming_soon_message || null,
    coming_soon_image_url: body.comingSoonImageUrl || body.coming_soon_image_url || null,
  }
}
