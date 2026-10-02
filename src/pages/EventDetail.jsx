import { Link, useParams } from 'react-router-dom'
import Reveal from '../components/Reveal'
import NotFound from './NotFound'
import { useContent } from '../context/ContentContext'
import { formatDate } from '../lib/format'

function isExternalHref(href) {
  return /^https?:\/\//i.test(href || '')
}

export default function EventDetail() {
  const { slug } = useParams()
  const { eventBySlug, artistBySlug, exhibitionBySlug, gallery } = useContent()
  const event = eventBySlug(slug)
  if (!event) return <NotFound />

  const relatedArtist = event.related?.artist ? artistBySlug(event.related.artist) : null
  const relatedShow = event.related?.exhibition ? exhibitionBySlug(event.related.exhibition) : null
  const ctaType = event.ctaType === 'link' ? 'link' : 'none'
  const ctaLabel = event.ctaLabel?.trim() || (ctaType === 'link' ? 'Register' : 'No RSVP needed')
  const ctaHref = event.ctaHref?.trim() || null

  return (
    <div className="container">
      <header className="detail-head">
        <Reveal>
          <p className="label">{event.type}</p>
          <h1 className="display">{event.title}</h1>
          <p className="lede muted" style={{ marginTop: '0.7rem' }}>
            {formatDate(event.date)}
            {event.time ? ` · ${event.time}` : ''}
          </p>
          {event.seriesId && (
            <p className="muted" style={{ marginTop: '0.55rem', fontSize: '0.92rem' }}>
              Part of a weekly series ·{' '}
              <Link to="/events" className="text-link">All events</Link>
            </p>
          )}
        </Reveal>
      </header>

      <section className="detail-grid" style={{ paddingBottom: 'clamp(3rem, 6vw, 5rem)' }}>
        <Reveal>
          <div className="prose statement">
            {event.description && <p>{event.description}</p>}
            {event.rsvp && <p className="italic">{event.rsvp}</p>}
          </div>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {ctaType === 'link' && ctaHref ? (
              <a
                href={ctaHref}
                className="btn"
                {...(isExternalHref(ctaHref)
                  ? { target: '_blank', rel: 'noreferrer' }
                  : {})}
              >
                {ctaLabel}
              </a>
            ) : (
              <p className="muted" style={{ margin: 0 }}>{ctaLabel}</p>
            )}
            <Link to="/events" className="btn">All events</Link>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <ul className="meta-list">
            <li><span>Type</span><span>{event.type}</span></li>
            <li><span>Date</span><span>{formatDate(event.date)}</span></li>
            {event.time && <li><span>Time</span><span>{event.time}</span></li>}
            <li><span>Where</span><span>{gallery?.address}</span></li>
            {relatedShow && (
              <li>
                <span>Exhibition</span>
                <Link to={`/exhibitions/${relatedShow.slug}`} className="text-link">{relatedShow.title}</Link>
              </li>
            )}
            {relatedArtist && (
              <li>
                <span>Artist</span>
                <Link to={`/artists/${relatedArtist.slug}`} className="text-link">{relatedArtist.name}</Link>
              </li>
            )}
          </ul>
        </Reveal>
      </section>
    </div>
  )
}
