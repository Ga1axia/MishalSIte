import { Link, useParams } from 'react-router-dom'
import Artwork from '../components/Artwork'
import Reveal from '../components/Reveal'
import NotFound from './NotFound'
import { artistBySlug, exhibitionBySlug, worksByArtist, formatRange, GALLERY } from '../data/content'

export default function ArtistDetail() {
  const { slug } = useParams()
  const artist = artistBySlug(slug)
  if (!artist) return <NotFound />

  const works = worksByArtist(slug)
  const shows = artist.exhibitions.map(exhibitionBySlug).filter(Boolean)

  return (
    <div className="container">
      <header className="detail-head">
        <Reveal>
          <p className="label">{artist.discipline}</p>
          <h1 className="display">{artist.name}</h1>
        </Reveal>
      </header>

      <section className="detail-grid">
        <Reveal>
          <Artwork seed={artist.seed} ratio="4 / 5" />
        </Reveal>
        <Reveal delay={0.1}>
          <p className="label" style={{ marginBottom: '0.8rem' }}>Biography</p>
          <p className="prose">{artist.bio}</p>

          <p className="label" style={{ margin: '2rem 0 0.8rem' }}>Artist statement</p>
          <p className="statement italic">“{artist.statement}”</p>

          <p className="label" style={{ margin: '2rem 0 0.8rem' }}>Links</p>
          <p style={{ display: 'flex', gap: '1.2rem' }}>
            {artist.links.map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="text-link">
                {l.label}
              </a>
            ))}
          </p>
        </Reveal>
      </section>

      <section className="section">
        <Reveal className="section-head">
          <h2 className="headline">Available works</h2>
          <a
            href={`mailto:${GALLERY.email}?subject=${encodeURIComponent('Inquiry: works by ' + artist.name)}`}
            className="text-link"
          >
            Inquire
          </a>
        </Reveal>
        <div className="grid grid-3">
          {works.map((w, i) => (
            <Reveal key={w.id} delay={i * 0.07}>
              <div className="card">
                <div className="frame">
                  <Artwork seed={w.seed} ratio="4 / 5" />
                </div>
                <p className="card-title">{w.title}</p>
                <p className="card-sub">{w.medium} · {w.dimensions}</p>
                <p className="card-sub">{w.price === 'Inquire' ? 'Inquire for price' : w.price}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <Reveal className="section-head">
          <h2 className="headline">Exhibitions at 25 West</h2>
        </Reveal>
        <div>
          {shows.map((ex, i) => (
            <Reveal key={ex.slug} delay={i * 0.06}>
              <Link to={`/exhibitions/${ex.slug}`} className="row-link">
                <span className="muted row-meta-first">{formatRange(ex.start, ex.end)}</span>
                <span className="row-title">{ex.title}</span>
                <span className="arrow" aria-hidden="true">→</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal style={{ paddingBottom: '1rem' }}>
        <Link to="/artists" className="text-link">← All artists</Link>
      </Reveal>
    </div>
  )
}
