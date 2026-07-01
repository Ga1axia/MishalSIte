// Content model per the planning doc:
// Exhibitions, Events, Artists, Opportunities, Works.

export const ARTISTS = [
  {
    slug: 'sunah-nash',
    name: 'Sunah Nash',
    discipline: 'Painting, textile',
    seed: 'nash',
    bio: 'Sunah Nash (b. 1994, Oakland) works between painting and textile, building slow, layered surfaces that record repetition, repair, and domestic time. Her work has been shown across the Bay Area and in group exhibitions in Los Angeles and Seoul.',
    statement:
      'I think of each piece as a kept hour — something stitched against forgetting. The work is quiet on purpose; it asks you to slow down to its speed rather than the other way around.',
    links: [
      { label: 'Instagram', href: 'https://instagram.com' },
      { label: 'Website', href: 'https://example.com' },
    ],
    exhibitions: ['kept-hours', 'soft-signal'],
  },
  {
    slug: 'mohsen-keiany',
    name: 'Mohsen Keiany',
    discipline: 'Painting, sculpture',
    seed: 'keiany',
    bio: 'Mohsen Keiany (b. 1970, Shiraz) is a painter and sculptor whose dense, earthen compositions draw on memory, migration, and the architecture of his childhood. He holds a PhD in Art and Design and has exhibited internationally for over two decades.',
    statement:
      'My paintings begin with clay, dust, and the colour of walls I remember. I am building rooms that no longer exist, so that someone else can stand in them for a moment.',
    links: [{ label: 'Website', href: 'https://example.com' }],
    exhibitions: ['kept-hours', 'terrain-memory'],
  },
  {
    slug: 'ada-lin',
    name: 'Ada Lin',
    discipline: 'Photography, video',
    seed: 'lin',
    bio: 'Ada Lin (b. 1998, San Jose) photographs the in-between hours of suburban California — parking lots at dusk, lit windows, the glow of closed storefronts. Her first monograph, Night Adjacent, was published in 2025.',
    statement:
      'I photograph what is about to disappear: light leaving a room, a strip mall before demolition, my grandmother\u2019s kitchen. The camera is the most honest way I know to say stay.',
    links: [{ label: 'Instagram', href: 'https://instagram.com' }],
    exhibitions: ['soft-signal', 'night-adjacent'],
  },
  {
    slug: 'theo-marsh',
    name: 'Theo Marsh',
    discipline: 'Works on paper',
    seed: 'marsh',
    bio: 'Theo Marsh (b. 1989, Vallejo) makes large-scale graphite and ink drawings that sit between cartography and weather. His work is held in several public collections in Northern California.',
    statement:
      'Drawing is the closest thing I have to thinking out loud. Every sheet is a record of attention — where it held, where it drifted, where it broke.',
    links: [
      { label: 'Instagram', href: 'https://instagram.com' },
      { label: 'Website', href: 'https://example.com' },
    ],
    exhibitions: ['terrain-memory'],
  },
  {
    slug: 'june-okafor',
    name: 'June Okafor',
    discipline: 'Ceramics, installation',
    seed: 'okafor',
    bio: 'June Okafor (b. 1992, Richmond) builds ceramic installations that treat the vessel as a social form — something passed between hands, broken, mended, and passed again. She teaches community ceramics workshops across the East Bay.',
    statement:
      'Clay remembers everything you do to it. I like that honesty. The work is about what we hold for each other, and what it costs to hold it.',
    links: [{ label: 'Instagram', href: 'https://instagram.com' }],
    exhibitions: ['night-adjacent'],
  },
]

export const WORKS = [
  { id: 'w1', artist: 'sunah-nash', title: 'Kept Hour IV', medium: 'Oil and thread on linen', dimensions: '48 × 36 in', price: 'Inquire', seed: 'nash-w1' },
  { id: 'w2', artist: 'sunah-nash', title: 'Mend (Blue)', medium: 'Dyed cotton, hand stitching', dimensions: '30 × 30 in', price: '$4,200', seed: 'nash-w2' },
  { id: 'w3', artist: 'sunah-nash', title: 'Slow Field', medium: 'Oil on linen', dimensions: '60 × 48 in', price: 'Inquire', seed: 'nash-w3' },
  { id: 'w4', artist: 'mohsen-keiany', title: 'Wall I Remember', medium: 'Mixed media on canvas', dimensions: '55 × 43 in', price: '$7,800', seed: 'keiany-w1' },
  { id: 'w5', artist: 'mohsen-keiany', title: 'Caravan', medium: 'Clay, pigment, resin on board', dimensions: '40 × 40 in', price: 'Inquire', seed: 'keiany-w2' },
  { id: 'w6', artist: 'ada-lin', title: 'Lot at Dusk', medium: 'Archival pigment print, ed. of 5', dimensions: '32 × 40 in', price: '$1,900', seed: 'lin-w1' },
  { id: 'w7', artist: 'ada-lin', title: 'Open 24 Hours (Closed)', medium: 'Archival pigment print, ed. of 5', dimensions: '24 × 30 in', price: '$1,400', seed: 'lin-w2' },
  { id: 'w8', artist: 'theo-marsh', title: 'Weather System 9', medium: 'Graphite and ink on paper', dimensions: '72 × 52 in', price: 'Inquire', seed: 'marsh-w1' },
  { id: 'w9', artist: 'theo-marsh', title: 'Shoreline Drift', medium: 'Ink on paper', dimensions: '40 × 60 in', price: '$3,600', seed: 'marsh-w2' },
  { id: 'w10', artist: 'june-okafor', title: 'Passed Between Hands', medium: 'Stoneware, gold lacquer', dimensions: 'Dimensions variable', price: 'Inquire', seed: 'okafor-w1' },
]

export const EXHIBITIONS = [
  {
    slug: 'kept-hours',
    title: 'Kept Hours',
    artists: ['sunah-nash', 'mohsen-keiany'],
    start: '2026-05-15',
    end: '2026-07-12',
    status: 'current',
    seed: 'kept-hours',
    statement:
      'Kept Hours pairs Sunah Nash and Mohsen Keiany — two artists who treat the surface of a painting as a place where time accumulates rather than passes. Nash\u2019s stitched linens hold the slow repetitions of domestic labor; Keiany\u2019s earthen panels carry the architecture of rooms remembered across continents. Together the works propose the gallery as a keeping-place: for hours, for walls, for what we refuse to let disappear.',
    works: ['w1', 'w2', 'w3', 'w4', 'w5'],
    installSeeds: ['kept-install-1', 'kept-install-2', 'kept-install-3'],
  },
  {
    slug: 'soft-signal',
    title: 'Soft Signal',
    artists: ['sunah-nash', 'ada-lin'],
    start: '2026-02-06',
    end: '2026-04-19',
    status: 'archive',
    seed: 'soft-signal',
    statement:
      'Soft Signal gathered works that transmit quietly — photographs of lit windows, textiles that read like weather reports from the interior life. An exhibition about the messages we send without speaking.',
    works: ['w2', 'w6', 'w7'],
    installSeeds: ['soft-install-1', 'soft-install-2'],
  },
  {
    slug: 'terrain-memory',
    title: 'Terrain / Memory',
    artists: ['mohsen-keiany', 'theo-marsh'],
    start: '2025-10-10',
    end: '2025-12-21',
    status: 'archive',
    seed: 'terrain',
    statement:
      'Terrain / Memory placed Keiany\u2019s earthen panels alongside Marsh\u2019s weather-scale drawings: two cartographies of places that exist now only in the body. The land as it is kept, not as it is mapped.',
    works: ['w4', 'w5', 'w8', 'w9'],
    installSeeds: ['terrain-install-1', 'terrain-install-2'],
  },
  {
    slug: 'night-adjacent',
    title: 'Night Adjacent',
    artists: ['ada-lin', 'june-okafor'],
    start: '2025-06-13',
    end: '2025-08-31',
    status: 'archive',
    seed: 'night-adjacent',
    statement:
      'The gallery\u2019s summer exhibition followed the in-between hours: Lin\u2019s photographs of suburban dusk and Okafor\u2019s vessels set out like a table after the guests have gone. A show about hospitality, aftermath, and the light that stays on.',
    works: ['w6', 'w7', 'w10'],
    installSeeds: ['night-install-1', 'night-install-2'],
  },
  {
    slug: 'first-light',
    title: 'First Light',
    artists: ['sunah-nash', 'mohsen-keiany', 'ada-lin', 'theo-marsh', 'june-okafor'],
    start: '2025-02-25',
    end: '2025-05-04',
    status: 'archive',
    seed: 'first-light',
    statement:
      'The inaugural exhibition of 25 West Gallery — a group show introducing the artists and the proposition: a serious fine art space that keeps its door open to the whole neighborhood.',
    works: ['w1', 'w4', 'w6', 'w8', 'w10'],
    installSeeds: ['first-install-1', 'first-install-2', 'first-install-3'],
  },
]

export const EVENTS = [
  {
    slug: 'kept-hours-closing',
    title: 'Kept Hours — Closing Reception',
    type: 'Opening / Reception',
    date: '2026-07-11',
    time: '6–9 pm',
    description:
      'Join us for the final evening of Kept Hours, with both artists in attendance. Wine, music, and a short reading at 7:30. Free and open to all.',
    rsvp: 'No RSVP needed — just come.',
    related: { exhibition: 'kept-hours' },
  },
  {
    slug: 'slow-stitch-workshop',
    title: 'Slow Stitch: Mending as Practice',
    type: 'Class',
    date: '2026-06-20',
    time: '1–4 pm',
    description:
      'A hands-on mending workshop led by Sunah Nash. Bring a garment that needs repair; all other materials provided. All skill levels welcome, ages 14+. Sliding scale $10–40.',
    rsvp: 'RSVP required — email events@25westgallery.com. 16 spots.',
    related: { artist: 'sunah-nash', exhibition: 'kept-hours' },
  },
  {
    slug: 'keiany-artist-talk',
    title: 'Artist Talk: Mohsen Keiany',
    type: 'Talk',
    date: '2026-06-27',
    time: '5 pm',
    description:
      'Mohsen Keiany discusses three decades of painting between Shiraz and the Bay Area, in conversation with curator Leila Haddad. Q&A to follow.',
    rsvp: 'Free with RSVP.',
    related: { artist: 'mohsen-keiany', exhibition: 'kept-hours' },
  },
  {
    slug: 'community-clay-night',
    title: 'Community Clay Night',
    type: 'Special gathering',
    date: '2026-07-02',
    time: '6–8:30 pm',
    description:
      'A drop-in evening of hand-building with June Okafor. No experience needed. Pieces are fired and ready for pickup two weeks later. Pay what you can.',
    rsvp: 'Drop-in, first come first served.',
    related: { artist: 'june-okafor' },
  },
  {
    slug: 'fall-show-opening',
    title: 'Fall Exhibition — Opening Night',
    type: 'Opening / Reception',
    date: '2026-09-11',
    time: '6–10 pm',
    description:
      'The opening of our fall program. Artist lineup announced in August — join the mailing list or follow @25westgallery for the reveal.',
    rsvp: 'Free and open to all.',
    related: {},
  },
]

export const OPPORTUNITIES = [
  {
    slug: 'winter-open-call-2026',
    title: 'Winter Open Call 2026',
    kind: 'Open Call',
    deadline: '2026-08-15',
    showDates: 'December 11, 2026 – February 7, 2027',
    compensation:
      'Selected artists receive a $1,000 honorarium, a 60/40 split on all sales (artist/gallery), and full installation support. Shipping within the Bay Area is covered by the gallery.',
    process:
      'Submissions are reviewed by the gallery directors and one guest curator. Selected artists are notified by September 15 and work directly with the gallery on presentation. No application fee.',
    materials: [
      '10–15 images of recent work (JPEG, 2MB max each)',
      'Artist statement (max 300 words)',
      'CV or short bio',
      'Work list with title, medium, dimensions, year',
    ],
    applyHref: 'mailto:submissions@25westgallery.com?subject=Winter%20Open%20Call%202026',
    statement:
      'For our winter exhibition we are looking for work that takes the long view — slowness, repair, ritual, archive. Artists at any career stage, working in any medium, with a connection to Northern California are encouraged to apply.',
  },
  {
    slug: 'curatorial-call-2027',
    title: 'Curatorial Call: Spring 2027',
    kind: 'Curatorial Call',
    deadline: '2026-10-01',
    showDates: 'March – May 2027',
    compensation:
      'The selected curator receives a $2,500 curatorial fee, a production budget of $4,000, and full administrative support from gallery staff. Participating artists are paid CARFAC-aligned exhibition fees.',
    process:
      'Proposals are reviewed in two rounds; finalists are invited for a conversation in November. We especially welcome first-time curators and proposals rooted in Bay Area communities.',
    materials: [
      'Curatorial proposal (max 2 pages)',
      'Preliminary artist list with sample images',
      'Budget sketch',
      'CV or bio for the curator(s)',
    ],
    applyHref: 'mailto:submissions@25westgallery.com?subject=Curatorial%20Call%20Spring%202027',
    statement:
      'One full exhibition slot, handed over. We provide the room, the budget, and the support; you provide the argument. We are looking for shows we could not have imagined ourselves.',
  },
]

export const GALLERY = {
  name: '25 West Gallery',
  phone: '650 705 4991',
  email: 'hello@25westgallery.com',
  instagram: '@25westgallery',
  instagramHref: 'https://instagram.com/25westgallery',
  address: '25 West Street, Oakland, CA',
  hours: 'Wed–Sun, 12–6 pm',
  mission:
    '25 West Gallery is a fine art space and cultural hub in the Bay Area. We mount serious exhibitions, represent and champion artists, and keep the door open — through classes, talks, openings, and gatherings that make contemporary art a public, local, livable thing.',
  philosophy:
    'We operate a little differently from a conventional commercial gallery. Programming is split between exhibitions and community: every show is accompanied by free public events, and artist compensation is published openly in every call. High art vibes, low barriers to entry.',
  team: [
    { name: 'M. Alvarez', role: 'Director' },
    { name: 'Leila Haddad', role: 'Curator-at-large' },
    { name: 'Dani Park', role: 'Programs & Community' },
    { name: 'R. Whitfield', role: 'Registrar & Operations' },
  ],
  comingSoonEnabled: true,
  launchDate: '2026-09-15',
  comingSoonHeadline: 'Opening soon',
  comingSoonMessage:
    'A fine art space and cultural hub in the Bay Area — exhibitions, artists, and a door open to the neighborhood.',
  comingSoonImageUrl: null,
}

export function artistBySlug(slug) {
  return ARTISTS.find((a) => a.slug === slug)
}
export function exhibitionBySlug(slug) {
  return EXHIBITIONS.find((e) => e.slug === slug)
}
export function eventBySlug(slug) {
  return EVENTS.find((e) => e.slug === slug)
}
export function opportunityBySlug(slug) {
  return OPPORTUNITIES.find((o) => o.slug === slug)
}
export function worksByIds(ids) {
  return ids.map((id) => WORKS.find((w) => w.id === id)).filter(Boolean)
}
export function worksByArtist(slug) {
  return WORKS.filter((w) => w.artist === slug)
}

export function formatDate(iso) {
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}
export function formatDateShort(iso) {
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
export function formatRange(start, end) {
  const s = new Date(start + 'T12:00:00')
  const e = new Date(end + 'T12:00:00')
  const sStr = s.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
  const eStr = e.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  return `${sStr} – ${eStr}`
}
