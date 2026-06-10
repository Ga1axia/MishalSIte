import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  ARTISTS,
  WORKS,
  EXHIBITIONS,
  EVENTS,
  OPPORTUNITIES,
  GALLERY,
} from '../data/content.js'

const ContentContext = createContext(null)

function staticPayload() {
  return {
    artists: ARTISTS.map((a) => ({ ...a, imageUrl: a.imageUrl ?? null })),
    works: WORKS.map((w) => ({ ...w, imageUrl: w.imageUrl ?? null })),
    exhibitions: EXHIBITIONS.map((e) => ({
      ...e,
      imageUrl: e.imageUrl ?? null,
      installImages: e.installImages ?? [],
    })),
    events: EVENTS.map((e) => ({ ...e, imageUrl: e.imageUrl ?? null })),
    opportunities: OPPORTUNITIES.map((o) => ({ ...o, imageUrl: o.imageUrl ?? null })),
    gallery: { ...GALLERY },
  }
}

export function ContentProvider({ children }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('loading')

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/content')
      if (!res.ok) throw new Error('API unavailable')
      const json = await res.json()
      setData(json)
      setSource('api')
    } catch {
      setData(staticPayload())
      setSource('fallback')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const helpers = useMemo(() => {
    if (!data) return null
    const { artists, works, exhibitions, events, opportunities, gallery } = data
    return {
      artists,
      works,
      exhibitions,
      events,
      opportunities,
      gallery,
      artistBySlug: (slug) => artists.find((a) => a.slug === slug),
      exhibitionBySlug: (slug) => exhibitions.find((e) => e.slug === slug),
      eventBySlug: (slug) => events.find((e) => e.slug === slug),
      opportunityBySlug: (slug) => opportunities.find((o) => o.slug === slug),
      worksByIds: (ids) => ids.map((id) => works.find((w) => w.id === id)).filter(Boolean),
      worksByArtist: (slug) => works.filter((w) => w.artist === slug),
    }
  }, [data])

  const value = helpers ?? {
    artists: [],
    works: [],
    exhibitions: [],
    events: [],
    opportunities: [],
    gallery: null,
    artistBySlug: () => undefined,
    exhibitionBySlug: () => undefined,
    eventBySlug: () => undefined,
    opportunityBySlug: () => undefined,
    worksByIds: () => [],
    worksByArtist: () => [],
  }

  return (
    <ContentContext.Provider value={{ ...value, loading, source, reload: load }}>
      {children}
    </ContentContext.Provider>
  )
}

export function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be used within ContentProvider')
  return ctx
}
