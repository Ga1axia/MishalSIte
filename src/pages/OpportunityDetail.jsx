import { Link, useParams } from 'react-router-dom'
import Artwork from '../components/Artwork'
import Paragraphs from '../components/Paragraphs'
import Reveal from '../components/Reveal'
import NotFound from './NotFound'
import { useContent } from '../context/ContentContext'
import { formatDate } from '../lib/format'

export default function OpportunityDetail() {
  const { slug } = useParams()
  const { opportunityBySlug } = useContent()
  const opp = opportunityBySlug(slug)
  if (!opp) return <NotFound />

  return (
    <div className="container">
      <header className="detail-head">
        <Reveal>
          <p className="label">{opp.kind}</p>
          <h1 className="display">{opp.title}</h1>
          <p className="lede muted" style={{ marginTop: '0.8rem' }}>
            Deadline {formatDate(opp.deadline)}
          </p>
        </Reveal>
      </header>

      {opp.imageUrl && (
        <Reveal>
          <Artwork
            seed={opp.slug}
            imageUrl={opp.imageUrl}
            ratio="21 / 9"
            size="hero"
            priority
          />
        </Reveal>
      )}

      <section className="detail-grid" style={{ paddingBottom: 'clamp(3rem, 6vw, 5rem)' }}>
        <div>
          {opp.statement && (
            <Reveal>
              <p className="label" style={{ marginBottom: '0.8rem' }}>Curatorial statement</p>
              <Paragraphs text={opp.statement} className="statement" />
            </Reveal>
          )}

          {opp.curatorBio && (
            <Reveal delay={0.05}>
              <p className="label" style={{ margin: '2.2rem 0 0.8rem' }}>Curator bio</p>
              <Paragraphs text={opp.curatorBio} className="prose" />
            </Reveal>
          )}

          {opp.compensation && (
            <Reveal delay={0.05}>
              <p className="label" style={{ margin: '2.2rem 0 0.8rem' }}>Artist payment</p>
              <Paragraphs text={opp.compensation} className="prose" />
            </Reveal>
          )}

          {opp.process && (
            <Reveal delay={0.05}>
              <p className="label" style={{ margin: '2.2rem 0 0.8rem' }}>Process & gallery relationship</p>
              <Paragraphs text={opp.process} className="prose" />
            </Reveal>
          )}

          {(opp.materials || []).length > 0 && (
            <Reveal delay={0.05}>
              <p className="label" style={{ margin: '2.2rem 0 0.8rem' }}>Required materials</p>
              <ul style={{ paddingLeft: '1.2rem', display: 'grid', gap: '0.4rem' }}>
                {opp.materials.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </Reveal>
          )}

          <Reveal delay={0.05} style={{ marginTop: '2.4rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {opp.applyHref && (
              <a href={opp.applyHref} className="btn">Apply now</a>
            )}
            <Link to="/opportunities" className="btn">All opportunities</Link>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <ul className="meta-list">
            <li><span>Type</span><span>{opp.kind}</span></li>
            <li><span>Deadline</span><span>{formatDate(opp.deadline)}</span></li>
            {opp.showDates && (
              <li><span>Show dates</span><span style={{ textAlign: 'right' }}>{opp.showDates}</span></li>
            )}
            <li><span>Application fee</span><span>None</span></li>
          </ul>
        </Reveal>
      </section>
    </div>
  )
}
