import { Link, useParams } from 'react-router-dom'
import Reveal from '../components/Reveal'
import NotFound from './NotFound'
import { useContent } from '../context/ContentContext'
import { formatDate } from '../lib/format'

export default function EventDetail() {
  const { slug } = useParams()
  const { eventBySlug, artistBySlug, exhibitionBySlug, gallery } = useContent()
  const event = eventBySlug(slug)
  if (!event) return <NotFound />

  const relatedArtist = event.related?.artist ? artistBySlug(event.related.artist) : null
  const relatedShow = event.related?.exhibition ? exhibitionBySlug(event.related.exhibition) : null

  return (
    <div className="container">
      <header className="detail-head">
        <Reveal>
          <p className="label">{event.type}</p>
          <h1 className="display">{event.title}</h1>
          <p className="lede muted" style={{ marginTop: '0.7rem' }}>
            {formatDate(event.date)} · {event.time}
          </p>
        </Reveal>
      </header>

      <section className="detail-grid" style={{ paddingBottom: 'clamp(3rem, 6vw, 5rem)' }}>
        <Reveal>
          <div className="prose statement">
            <p>{event.description}</p>
            <p className="italic">{event.rsvp}</p>
          </div>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href={`mailto:${gallery?.email}?subject=${encodeURIComponent('RSVP: ' + event.title)}`} className="btn">
              RSVP by email
            </a>
            <Link to="/events" className="btn">All events</Link>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <ul className="meta-list">
            <li><span>Type</span><span>{event.type}</span></li>
            <li><span>Date</span><span>{formatDate(event.date)}</span></li>
            <li><span>Time</span><span>{event.time}</span></li>
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
