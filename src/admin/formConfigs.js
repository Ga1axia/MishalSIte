/** Turn a title into a URL-safe id (auto-generated, admins never need to edit). */
export function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const ADMIN_RESOURCES = [
  { key: 'exhibitions', label: 'Exhibitions', idField: 'slug' },
  { key: 'events', label: 'Events', idField: 'slug' },
  { key: 'artists', label: 'Artists', idField: 'slug' },
  { key: 'works', label: 'Works', idField: 'id' },
  { key: 'opportunities', label: 'Opportunities', idField: 'slug' },
  { key: 'gallery', label: 'Gallery Settings', singleton: true },
]

export const EVENT_TYPES = [
  'Opening / Reception',
  'Class',
  'Talk',
  'Special gathering',
]

export const OPPORTUNITY_KINDS = ['Open Call', 'Curatorial Call']

/** Field types: text, textarea, date, select, image, stringList, links, team,
 *  artistPick, workPick, exhibitionPick, related, installPhotos */
export const FORM_CONFIGS = {
  artists: {
    title: 'Artist',
    sections: [
      {
        title: 'Profile',
        fields: [
          { name: 'name', label: 'Name', type: 'text', required: true },
          { name: 'discipline', label: 'Discipline', type: 'text', hint: 'e.g. Painting, textile' },
          { name: 'imageUrl', label: 'Photo', type: 'image' },
          { name: 'bio', label: 'Biography', type: 'textarea' },
          { name: 'statement', label: 'Artist statement', type: 'textarea' },
        ],
      },
      {
        title: 'Links',
        fields: [{ name: 'links', label: 'Website & social links', type: 'links' }],
      },
      {
        title: 'Exhibitions at 25 West',
        fields: [
          {
            name: 'exhibitions',
            label: 'Shows this artist has been in',
            type: 'exhibitionPick',
          },
        ],
      },
    ],
  },
  works: {
    title: 'Work',
    sections: [
      {
        title: 'Work details',
        fields: [
          { name: 'title', label: 'Title', type: 'text', required: true },
          { name: 'artist', label: 'Artist', type: 'artistSelect', required: true },
          { name: 'medium', label: 'Medium', type: 'text', hint: 'e.g. Oil on linen' },
          { name: 'dimensions', label: 'Dimensions', type: 'text', hint: 'e.g. 48 × 36 in' },
          {
            name: 'price',
            label: 'Price',
            type: 'text',
            hint: 'Enter a dollar amount or "Inquire"',
          },
          { name: 'imageUrl', label: 'Photo of the work', type: 'image' },
        ],
      },
    ],
  },
  exhibitions: {
    title: 'Exhibition',
    sections: [
      {
        title: 'Overview',
        fields: [
          { name: 'title', label: 'Exhibition title', type: 'text', required: true },
          { name: 'artists', label: 'Artists in this show', type: 'artistPick' },
          { name: 'start', label: 'Opens', type: 'date', required: true },
          { name: 'end', label: 'Closes', type: 'date', required: true },
          {
            name: 'status',
            label: 'Status',
            type: 'select',
            options: [
              { value: 'current', label: 'On view now' },
              { value: 'archive', label: 'Past exhibition' },
            ],
          },
          { name: 'imageUrl', label: 'Hero image', type: 'image' },
          { name: 'statement', label: 'Exhibition statement', type: 'textarea' },
        ],
      },
      {
        title: 'Installation photos',
        fields: [{ name: 'installPhotos', label: 'Installation views', type: 'installPhotos' }],
      },
      {
        title: 'Works in this show',
        fields: [{ name: 'works', label: 'Select works on display', type: 'workPick' }],
      },
    ],
  },
  events: {
    title: 'Event',
    sections: [
      {
        title: 'Event details',
        fields: [
          { name: 'title', label: 'Event title', type: 'text', required: true },
          {
            name: 'type',
            label: 'Type of event',
            type: 'select',
            options: EVENT_TYPES.map((t) => ({ value: t, label: t })),
          },
          { name: 'date', label: 'Date', type: 'date', required: true },
          { name: 'time', label: 'Time', type: 'text', hint: 'e.g. 6–9 pm' },
          { name: 'description', label: 'Description', type: 'textarea' },
          { name: 'rsvp', label: 'RSVP / attendance info', type: 'textarea' },
          { name: 'imageUrl', label: 'Event image (optional)', type: 'image' },
        ],
      },
      {
        title: 'Related to',
        fields: [{ name: 'related', label: 'Link to a show or artist', type: 'related' }],
      },
    ],
  },
  opportunities: {
    title: 'Opportunity',
    sections: [
      {
        title: 'Call details',
        fields: [
          { name: 'title', label: 'Title', type: 'text', required: true },
          {
            name: 'kind',
            label: 'Type',
            type: 'select',
            options: OPPORTUNITY_KINDS.map((k) => ({ value: k, label: k })),
          },
          { name: 'deadline', label: 'Application deadline', type: 'date' },
          { name: 'showDates', label: 'Exhibition dates', type: 'text', hint: 'e.g. March – May 2027' },
          { name: 'statement', label: 'Curatorial statement', type: 'textarea' },
          { name: 'imageUrl', label: 'Image (optional)', type: 'image' },
        ],
      },
      {
        title: 'For applicants',
        fields: [
          { name: 'compensation', label: 'Artist payment & support', type: 'textarea' },
          { name: 'process', label: 'How the process works', type: 'textarea' },
          {
            name: 'materials',
            label: 'Required materials',
            type: 'stringList',
            hint: 'One item per line — e.g. "10–15 images of recent work"',
          },
          { name: 'applyHref', label: 'Apply link or email', type: 'text', hint: 'mailto: or https:// link' },
        ],
      },
    ],
  },
  gallery: {
    title: 'Gallery Settings',
    singleton: true,
    sections: [
      {
        title: 'Launch & coming soon',
        fields: [
          {
            name: 'comingSoonEnabled',
            label: 'Show coming soon page instead of the public site',
            type: 'checkbox',
            hint: 'Visitors see a full-screen page until you turn this off or the launch date passes. Admin always works at /admin.',
          },
          { name: 'launchDate', label: 'Launch date', type: 'date', hint: 'Site goes live automatically on this date (Pacific time)' },
          { name: 'comingSoonHeadline', label: 'Headline', type: 'text', hint: 'e.g. A new gallery is on its way.' },
          { name: 'comingSoonMessage', label: 'Short message', type: 'text', hint: 'One line' },
          { name: 'comingSoonImageUrl', label: 'Hero image', type: 'image' },
        ],
      },
      {
        title: 'Contact & hours',
        fields: [
          { name: 'name', label: 'Gallery name', type: 'text' },
          { name: 'phone', label: 'Phone', type: 'text', hint: 'e.g. 650 705 4991' },
          { name: 'email', label: 'Email', type: 'email' },
          { name: 'instagram', label: 'Instagram handle', type: 'text', hint: 'e.g. @25westgallery' },
          { name: 'instagramHref', label: 'Instagram URL', type: 'url' },
          { name: 'address', label: 'Address', type: 'text' },
          { name: 'hours', label: 'Hours', type: 'text', hint: 'e.g. Wed–Sun, 12–6 pm' },
        ],
      },
      {
        title: 'About the gallery',
        fields: [
          {
            name: 'aboutHeadline',
            label: 'About page headline',
            type: 'text',
            hint: 'e.g. A serious space with an open door',
          },
          { name: 'aboutImageUrl', label: 'About page hero image', type: 'image' },
          { name: 'mission', label: 'Mission statement', type: 'textarea' },
          { name: 'philosophy', label: 'How we work', type: 'textarea' },
        ],
      },
      {
        title: 'Team',
        fields: [{ name: 'team', label: 'Team members', type: 'team' }],
      },
    ],
  },
}

/** Flatten sections into a list of all fields (for payload building). */
export function allFields(config) {
  return config.sections.flatMap((s) => s.fields)
}

/** Convert API item → form state (friendly shapes). */
export function itemToForm(config, item) {
  const form = {}
  for (const section of config.sections) {
    for (const field of section.fields) {
      if (field.type === 'installPhotos') {
        const seeds = item.installSeeds || []
        const images = item.installImages || []
        form.installPhotos = seeds.map((seed, i) => ({
          seed,
          imageUrl: images[i] || null,
        }))
        if (form.installPhotos.length === 0) form.installPhotos = []
      } else if (field.type === 'related') {
        form.related = {
          exhibition: item.related?.exhibition || '',
          artist: item.related?.artist || '',
        }
      } else if (field.type === 'stringList') {
        form[field.name] = Array.isArray(item[field.name]) ? [...item[field.name]] : []
      } else if (field.type === 'links') {
        form[field.name] = Array.isArray(item[field.name]) ? item[field.name].map((l) => ({ ...l })) : []
      } else if (field.type === 'team') {
        form[field.name] = Array.isArray(item[field.name]) ? item[field.name].map((m) => ({ ...m })) : []
      } else if (field.type === 'artistPick' || field.type === 'workPick' || field.type === 'exhibitionPick') {
        form[field.name] = Array.isArray(item[field.name]) ? [...item[field.name]] : []
      } else if (field.type === 'checkbox') {
        form[field.name] = Boolean(item[field.name])
      } else {
        form[field.name] = item[field.name] ?? ''
      }
    }
  }
  return form
}

/** Empty form for create. */
export function emptyForm(config) {
  const form = {}
  for (const section of config.sections) {
    for (const field of section.fields) {
      if (field.type === 'installPhotos') form.installPhotos = []
      else if (field.type === 'related') form.related = { exhibition: '', artist: '' }
      else if (field.type === 'stringList') form[field.name] = ['']
      else if (field.type === 'links') form[field.name] = [{ label: '', href: '' }]
      else if (field.type === 'team') form[field.name] = [{ name: '', role: '' }]
      else if (field.type === 'artistPick' || field.type === 'workPick' || field.type === 'exhibitionPick') {
        form[field.name] = []
      } else if (field.type === 'checkbox') {
        form[field.name] = false
      } else form[field.name] = ''
    }
  }
  return form
}

/** Convert form state → API payload. */
export function formToPayload(resourceKey, form, { isNew, existingItem }) {
  const payload = { ...form }

  // installPhotos → installSeeds + installImages
  if (payload.installPhotos) {
    const photos = payload.installPhotos.filter((p) => p.imageUrl)
    const baseSlug = existingItem?.slug || slugify(form.title) || 'show'
    payload.installSeeds = photos.map((p, i) => p.seed || `${baseSlug}-install-${i + 1}`)
    payload.installImages = photos.map((p) => p.imageUrl)
    delete payload.installPhotos
  }

  // related — drop empty strings
  if (payload.related) {
    const r = {}
    if (payload.related.exhibition) r.exhibition = payload.related.exhibition
    if (payload.related.artist) r.artist = payload.related.artist
    payload.related = r
  }

  // Clean string lists (drop blanks)
  if (Array.isArray(payload.materials)) {
    payload.materials = payload.materials.map((s) => s.trim()).filter(Boolean)
  }

  // Clean links / team
  if (Array.isArray(payload.links)) {
    payload.links = payload.links.filter((l) => l.label?.trim() || l.href?.trim())
  }
  if (Array.isArray(payload.team)) {
    payload.team = payload.team.filter((m) => m.name?.trim() || m.role?.trim())
  }

  // Auto slug & seed (hidden from admins)
  if (['artists', 'exhibitions', 'events', 'opportunities'].includes(resourceKey)) {
    const slug = isNew
      ? slugify(resourceKey === 'artists' ? form.name : form.title)
      : existingItem?.slug
    if (slug) {
      payload.slug = slug
      payload.seed = slug
    }
  }

  if (resourceKey === 'works') {
    if (isNew) {
      const artist = form.artist || 'work'
      payload.id = `${artist}-${slugify(form.title)}`.slice(0, 48)
      payload.seed = payload.id
    } else if (existingItem) {
      payload.seed = existingItem.seed || existingItem.id
    }
  }

  return payload
}
