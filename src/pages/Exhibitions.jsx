import { Link } from 'react-router-dom'
import Artwork from '../components/Artwork'
import Reveal from '../components/Reveal'
import { EXHIBITIONS, artistBySlug, formatRange } from '../data/content'

export default function Exhibitions() {
  const current = EXHIBITIONS.filter((e) => e.status === 'current')
  const archive = EXHIBITIONS.filter((e) => e.status === 'archive')

  return (
    <div className="container">
      <header className="detail-head">
        <Reveal>
          <p className="label">Exhibitions</p>
          <h1 className="display">Current</h1>
        </Reveal>
      </header>

      <div className="grid grid-2" style={{ marginBottom: 'clamp(3rem, 7vw, 5.5rem)' }}>
        {current.map((ex, i) => (
          <Reveal key={ex.slug} delay={i * 0.1}>
            <Link to={`/exhibitions/${ex.slug}`} className="card">
              <div className="frame">
                <Artwork seed={ex.seed} ratio="4 / 3" />
              </div>
              <p className="card-title" style={{ fontSize: '1.6rem' }}>{ex.title}</p>
              <p className="card-sub">
                {ex.artists.map((s) => artistBySlug(s).name).join(' & ')} · {formatRange(ex.start, ex.end)}
              </p>
            </Link>
          </Reveal>
        ))}
      </div>

      <section id="archive" className="section" style={{ paddingTop: 0 }}>
        <Reveal className="section-head">
          <h2 className="headline">Archive</h2>
          <span className="label">{archive.length} exhibitions</span>
        </Reveal>
        <div>
          {archive.map((ex, i) => (
            <Reveal key={ex.slug} delay={i * 0.06}>
              <Link to={`/exhibitions/${ex.slug}`} className="row-link">
                <span className="muted row-meta-first">{formatRange(ex.start, ex.end)}</span>
                <span className="row-title">
                  {ex.title}
                  <span className="muted" style={{ fontStyle: 'normal', fontSize: '0.95rem' }}>
                    {'  —  '}
                    {ex.artists.map((s) => artistBySlug(s).name).join(', ')}
                  </span>
                </span>
                <span className="arrow" aria-hidden="true">→</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}
