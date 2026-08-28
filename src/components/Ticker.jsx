import { Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import { formatDateShort } from '../lib/format'
import { upcomingEvents } from '../lib/events'

export default function Ticker() {
  const { events } = useContent()
  const upcoming = upcomingEvents(events)
  if (upcoming.length === 0) return null

  const items = upcoming.map((e) => (
    <Link className="ticker-item" key={e.slug} to={`/events/${e.slug}`}>
      <span className="dot">{formatDateShort(e.date)}</span>
      <span>{e.title}</span>
      <span className="dot">·</span>
    </Link>
  ))

  return (
    <div className="ticker" aria-label="Upcoming events">
      <div className="ticker-track">
        {items}
        {items.map((item, i) => (
          <span key={`dup-${i}`} aria-hidden="true">{item}</span>
        ))}
      </div>
    </div>
  )
}
