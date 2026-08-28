import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { useContent } from '../context/ContentContext'
import { formatDate } from '../lib/format'
import { pastEvents, upcomingEvents } from '../lib/events'
import { copy } from '../lib/copy'

function EventRow({ event }) {
  return (
    <Link to={`/events/${event.slug}`} className="row-link">
      <span className="muted row-meta-first">
        {formatDate(event.date)}
        {event.time ? ` · ${event.time}` : ''}
      </span>
      <span className="row-title">
        {event.title}
        {event.type && (
          <span className="muted" style={{ fontStyle: 'normal', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {'  '}({event.type})
          </span>
        )}
      </span>
      <span className="arrow" aria-hidden="true">→</span>
    </Link>
  )
}

export default function Events() {
  const { events, gallery } = useContent()
  const { hash } = useLocation()
  const [showPast, setShowPast] = useState(hash === '#past')

  const upcoming = upcomingEvents(events)
  const past = pastEvents(events)
  const intro = copy(gallery, 'eventsIntro')

  return (
    <div className="container">
      <header className="detail-head">
        <Reveal>
          <p className="label">Community & Events</p>
          <h1 className="display">{copy(gallery, 'eventsHeadline')}</h1>
          {intro && (
            <p className="lede muted" style={{ marginTop: '0.8rem' }}>{intro}</p>
          )}
        </Reveal>
      </header>

      <div>
        {upcoming.length > 0 ? (
          upcoming.map((event, i) => (
            <Reveal key={event.slug} delay={i * 0.06}>
              <EventRow event={event} />
            </Reveal>
          ))
        ) : (
          <Reveal>
            <p className="muted">
              No events on the calendar right now. Check back soon, or{' '}
              <Link to="/contact" className="text-link">get in touch</Link>.
            </p>
          </Reveal>
        )}
      </div>

      {past.length > 0 && (
        <section id="past" className="section" style={{ paddingBottom: 'clamp(3rem, 6vw, 5rem)' }}>
          <Reveal className="section-head">
            <h2 className="headline">Past events</h2>
            <button
              type="button"
              className="text-link"
              onClick={() => setShowPast((v) => !v)}
              aria-expanded={showPast}
            >
              {showPast ? 'Hide' : `Show ${past.length}`}
            </button>
          </Reveal>
          {showPast && (
            <div>
              {past.map((event, i) => (
                <Reveal key={event.slug} delay={i * 0.04}>
                  <EventRow event={event} />
                </Reveal>
              ))}
            </div>
          )}
        </section>
      )}

      {past.length === 0 && <div style={{ paddingBottom: 'clamp(3rem, 6vw, 5rem)' }} />}
    </div>
  )
}
