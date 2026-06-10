import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { EVENTS, formatDate } from '../data/content'

export default function Events() {
  return (
    <div className="container">
      <header className="detail-head">
        <Reveal>
          <p className="label">Community & Events</p>
          <h1 className="display">Upcoming</h1>
          <p className="lede muted" style={{ marginTop: '0.8rem' }}>
            Openings, classes, talks, and gatherings. Everything is open to the
            public, and most of it is free.
          </p>
        </Reveal>
      </header>

      <div style={{ paddingBottom: 'clamp(3rem, 6vw, 5rem)' }}>
        {EVENTS.map((event, i) => (
          <Reveal key={event.slug} delay={i * 0.06}>
            <Link to={`/events/${event.slug}`} className="row-link">
              <span className="muted row-meta-first">
                {formatDate(event.date)} · {event.time}
              </span>
              <span className="row-title">
                {event.title}
                <span className="muted" style={{ fontStyle: 'normal', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {'  '}({event.type})
                </span>
              </span>
              <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
