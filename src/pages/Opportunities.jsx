import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { OPPORTUNITIES, formatDate } from '../data/content'

export default function Opportunities() {
  return (
    <div className="container">
      <header className="detail-head">
        <Reveal>
          <p className="label">Opportunities</p>
          <h1 className="display">Open & curatorial calls</h1>
          <p className="lede muted" style={{ marginTop: '0.8rem' }}>
            We publish artist compensation and the full process in every call.
            No application fees, ever.
          </p>
        </Reveal>
      </header>

      <div className="grid grid-2" style={{ paddingBottom: 'clamp(3rem, 6vw, 5rem)' }}>
        {OPPORTUNITIES.map((opp, i) => (
          <Reveal key={opp.slug} delay={i * 0.1}>
            <Link
              to={`/opportunities/${opp.slug}`}
              className="card"
              style={{ border: '1px solid var(--line)', padding: 'clamp(1.4rem, 3vw, 2.2rem)', height: '100%' }}
            >
              <p className="label" style={{ marginBottom: '1rem' }}>{opp.kind}</p>
              <p className="card-title" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>{opp.title}</p>
              <p className="muted" style={{ margin: '0.8rem 0 1.4rem' }}>{opp.statement}</p>
              <p className="card-sub">Deadline: {formatDate(opp.deadline)}</p>
              <p className="card-sub">Show dates: {opp.showDates}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
