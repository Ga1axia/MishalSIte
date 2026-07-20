import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Artwork from '../components/Artwork'
import Reveal from '../components/Reveal'
import WorkLightbox from '../components/WorkLightbox'
import NotFound from './NotFound'
import { useContent } from '../context/ContentContext'
import { formatRange } from '../lib/format'

function WorkTile({ work, artistName, onOpen }) {
  const priceLabel = work.price === 'Inquire' ? 'Inquire for price' : work.price

  return (
    <button type="button" className="work-tile" onClick={() => onOpen(work)}>
      <div className="work-tile-media">
        <Artwork seed={work.seed} imageUrl={work.imageUrl} ratio="4 / 3" />
        <div className="work-tile-overlay">
          <p className="work-tile-title">{work.title}</p>
          {artistName && <p>{artistName}</p>}
          {work.medium && <p>{work.medium}</p>}
          {work.dimensions && <p>{work.dimensions}</p>}
          {priceLabel && <p>{priceLabel}</p>}
        </div>
      </div>
    </button>
  )
}

export default function ExhibitionDetail() {
  const { slug } = useParams()
  const { exhibitionBySlug, artistBySlug, worksByIds, gallery } = useContent()
  const [activeWork, setActiveWork] = useState(null)
  const ex = exhibitionBySlug(slug)
  if (!ex) return <NotFound />

  const works = worksByIds(ex.works)
  const installViews = (ex.installSeeds || []).map((seed, i) => ({
    seed,
    imageUrl: ex.installImages?.[i] || null,
  }))

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
                <Link to={`/artists/${s}`} className="text-link">{artistBySlug(s)?.name}</Link>
              </span>
            ))}
          </p>
          <p className="muted" style={{ marginTop: '0.5rem' }}>{formatRange(ex.start, ex.end)}</p>
        </Reveal>
      </header>

      <Reveal>
        <Artwork seed={ex.seed} imageUrl={ex.imageUrl} ratio="21 / 9" size="hero" priority />
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
                <span style={{ textAlign: 'right' }}>{ex.artists.map((s) => artistBySlug(s)?.name).filter(Boolean).join(', ')}</span>
              </li>
              <li><span>Location</span><span>{gallery?.address}</span></li>
              <li><span>Hours</span><span>{gallery?.hours}</span></li>
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <Reveal className="section-head">
          <h2 className="headline">Installation views</h2>
        </Reveal>
        <div className="grid grid-3">
          {installViews.map((view, i) => (
            <Reveal key={view.seed} delay={i * 0.08}>
              <Artwork seed={view.seed} imageUrl={view.imageUrl} ratio="4 / 3" />
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
              <WorkTile
                work={w}
                artistName={artistBySlug(w.artist)?.name}
                onOpen={setActiveWork}
              />
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal style={{ paddingBottom: '1rem' }}>
        <Link to="/exhibitions" className="text-link">← All exhibitions</Link>
      </Reveal>

      {activeWork && (
        <WorkLightbox
          work={activeWork}
          artistName={artistBySlug(activeWork.artist)?.name}
          onClose={() => setActiveWork(null)}
        />
      )}
    </div>
  )
}
