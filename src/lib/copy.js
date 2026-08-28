/**
 * Editable page copy. Every key can be overridden in Admin → Gallery Settings;
 * a blank value falls back to the wording below.
 */
export const DEFAULT_COPY = {
  homeBetweenHeadline: 'Between exhibitions',
  homeBetweenMessage:
    'Our next show is being installed. In the meantime, browse the archive and the artists we work with.',
  exhibitionsHeadline: 'Current',
  exhibitionsIntro: '',
  eventsHeadline: 'Upcoming',
  eventsIntro:
    'Openings, classes, talks, and gatherings. Everything is open to the public, and most of it is free.',
  artistsHeadline: 'The roster',
  artistsIntro: '',
  opportunitiesHeadline: 'Open & curatorial calls',
  opportunitiesIntro:
    'We publish artist compensation and the full process in every call. No application fees, ever.',
  contactHeadline: 'Say hello',
  contactIntro: 'Call, email, or find us on Instagram.',
  aboutHeadline: 'A serious space with an open door',
  aboutQuote: 'High art vibes. Low barriers to entry.',
  footerTagline: 'Ephemeral, esoteric, open to all.',
}

/** Admin value if set, otherwise the default. Returns '' for intentionally empty copy. */
export function copy(gallery, key) {
  const value = gallery?.[key]
  if (typeof value === 'string' && value.trim()) return value.trim()
  return DEFAULT_COPY[key] ?? ''
}
