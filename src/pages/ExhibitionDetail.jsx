import { Link, useParams } from 'react-router-dom'
import Artwork from '../components/Artwork'
import Reveal from '../components/Reveal'
import NotFound from './NotFound'
import { exhibitionBySlug, artistBySlug, worksByIds, formatRange, GALLERY } from '../data/content'

export default function ExhibitionDetail() {
  const { slug } = useParams()
  const ex = exhibitionBySlug(slug)
  if (!ex) return <NotFound />

  const works = worksByIds(ex.works)

  return (
    <div className="container">
      <header className="detail-head">
        <Reveal>
          <p className="label">{ex.status === 'current' ? 'On view now' : 'From the archive'}</p>
          <h1 className="display">{ex.title}</h1>
          <p className="lede" style={{ marginTop: '0.6rem' }}>
            {ex.artists.map((s, i) => (
              <span key={s}>
                {i > 0 && ' & '}
                <Link to={`/artists/${s}`} className="text-link">{artistBySlug(s).name}</Link>
              </span>
            ))}
          </p>
          <p className="muted" style={{ marginTop: '0.5rem' }}>{formatRange(ex.start, ex.end)}</p>
        </Reveal>
      </header>

      <Reveal>
        <Artwork seed={ex.seed} ratio="21 / 9" />
      </Reveal>

      <section className="section">
        <div className="detail-grid">
          <Reveal>
            <p className="label" style={{ marginBottom: '1rem' }}>Exhibition statement</p>
            <p className="statement">{ex.statement}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="meta-list">
              <li><span>Dates</span><span>{formatRange(ex.start, ex.end)}</span></li>
              <li>
                <span>Artists</span>
                <span style={{ textAlign: 'right' }}>{ex.artists.map((s) => artistBySlug(s).name).join(', ')}</span>
              </li>
              <li><span>Location</span><span>{GALLERY.address}</span></li>
              <li><span>Hours</span><span>{GALLERY.hours}</span></li>
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <Reveal className="section-head">
          <h2 className="headline">Installation views</h2>
        </Reveal>
        <div className="grid grid-3">
          {ex.installSeeds.map((s, i) => (
            <Reveal key={s} delay={i * 0.08}>
              <Artwork seed={s} ratio="4 / 3" />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <Reveal className="section-head">
          <h2 className="headline">Works in the exhibition</h2>
          <span className="label">{works.length} works</span>
        </Reveal>
        <div className="grid grid-3">
          {works.map((w, i) => (
            <Reveal key={w.id} delay={i * 0.06}>
              <Link to={`/artists/${w.artist}`} className="card">
                <div className="frame">
                  <Artwork seed={w.seed} ratio="4 / 5" />
                </div>
                <p className="card-title">{w.title}</p>
                <p className="card-sub">
                  {artistBySlug(w.artist).name} · {w.medium} · {w.dimensions}
                </p>
                <p className="card-sub">{w.price === 'Inquire' ? 'Inquire for price' : w.price}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal style={{ paddingBottom: '1rem' }}>
        <Link to="/exhibitions" className="text-link">← All exhibitions</Link>
      </Reveal>
    </div>
  )
}
