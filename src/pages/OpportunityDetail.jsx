import { Link, useParams } from 'react-router-dom'
import Reveal from '../components/Reveal'
import NotFound from './NotFound'
import { opportunityBySlug, formatDate } from '../data/content'

export default function OpportunityDetail() {
  const { slug } = useParams()
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

      <section className="detail-grid" style={{ paddingBottom: 'clamp(3rem, 6vw, 5rem)' }}>
        <div>
          <Reveal>
            <p className="label" style={{ marginBottom: '0.8rem' }}>Curatorial statement</p>
            <p className="statement">{opp.statement}</p>
          </Reveal>

          <Reveal delay={0.05}>
            <p className="label" style={{ margin: '2.2rem 0 0.8rem' }}>Artist payment</p>
            <p className="prose">{opp.compensation}</p>
          </Reveal>

          <Reveal delay={0.05}>
            <p className="label" style={{ margin: '2.2rem 0 0.8rem' }}>Process & gallery relationship</p>
            <p className="prose">{opp.process}</p>
          </Reveal>

          <Reveal delay={0.05}>
            <p className="label" style={{ margin: '2.2rem 0 0.8rem' }}>Required materials</p>
            <ul style={{ paddingLeft: '1.2rem', display: 'grid', gap: '0.4rem' }}>
              {opp.materials.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.05} style={{ marginTop: '2.4rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href={opp.applyHref} className="btn">Apply now</a>
            <Link to="/opportunities" className="btn">All opportunities</Link>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <ul className="meta-list">
            <li><span>Type</span><span>{opp.kind}</span></li>
            <li><span>Deadline</span><span>{formatDate(opp.deadline)}</span></li>
            <li><span>Show dates</span><span style={{ textAlign: 'right' }}>{opp.showDates}</span></li>
            <li><span>Application fee</span><span>None</span></li>
          </ul>
        </Reveal>
      </section>
    </div>
  )
}
