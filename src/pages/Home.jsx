import { Link } from 'react-router-dom'
import Artwork from '../components/Artwork'
import Reveal from '../components/Reveal'
import Ticker from '../components/Ticker'
import { useContent } from '../context/ContentContext'
import { formatRange, formatDate } from '../lib/format'

export default function Home() {
  const { exhibitions, events, artists, gallery, artistBySlug } = useContent()
  const current = exhibitions.find((e) => e.status === 'current')
  const upcoming = events.slice(0, 3)
  const featured = artists.slice(0, 4)

  if (!current) {
    return (
      <div className="container" style={{ padding: '4rem 0' }}>
        <p className="headline">No current exhibition on view.</p>
      </div>
    )
  }

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <Reveal>
            <Link to={`/exhibitions/${current.slug}`} className="card">
              <div className="frame">
                <Artwork seed={current.seed} imageUrl={current.imageUrl} ratio="5 / 4" />
              </div>
            </Link>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="label">On view now</p>
            <h1 className="display" style={{ margin: '0.4rem 0 0.8rem' }}>
              <Link to={`/exhibitions/${current.slug}`}>{current.title}</Link>
            </h1>
            <p className="lede">
              {current.artists.map((slug, i) => (
                <span key={slug}>
                  {i > 0 && ' & '}
                  <Link to={`/artists/${slug}`} className="text-link">
                    {artistBySlug(slug)?.name}
                  </Link>
                </span>
              ))}
            </p>
            <p className="muted" style={{ margin: '0.7rem 0 1.6rem' }}>
              {formatRange(current.start, current.end)}
            </p>
            <Link to={`/exhibitions/${current.slug}`} className="btn">
              View exhibition
            </Link>
          </Reveal>
        </div>
      </section>

      <Ticker />

      <section className="section">
        <div className="container">
          <Reveal className="section-head">
            <h2 className="headline">Upcoming</h2>
            <Link to="/events" className="text-link">All events</Link>
          </Reveal>
          <div>
            {upcoming.map((event, i) => (
              <Reveal key={event.slug} delay={i * 0.08}>
                <Link to={`/events/${event.slug}`} className="row-link">
                  <span className="muted row-meta-first">{formatDate(event.date)}</span>
                  <span className="row-title">{event.title}</span>
                  <span className="arrow" aria-hidden="true">→</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal className="section-head">
            <h2 className="headline">Artists</h2>
            <Link to="/artists" className="text-link">All artists</Link>
          </Reveal>
          <div className="grid grid-4">
            {featured.map((artist, i) => (
              <Reveal key={artist.slug} delay={i * 0.08}>
                <Link to={`/artists/${artist.slug}`} className="card">
                  <div className="frame">
                    <Artwork seed={artist.seed} imageUrl={artist.imageUrl} ratio="4 / 5" />
                  </div>
                  <p className="card-title">{artist.name}</p>
                  <p className="card-sub">{artist.discipline}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <hr className="rule" />
          <Reveal>
            <p className="big-quote" style={{ margin: 'clamp(2rem, 5vw, 3.5rem) auto', maxWidth: '34ch' }}>
              {gallery?.mission}
            </p>
          </Reveal>
          <Reveal delay={0.1} style={{ textAlign: 'center' }}>
            <Link to="/about" className="btn">About the gallery</Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
