import { Link } from 'react-router-dom'
import Artwork from '../components/Artwork'
import Reveal from '../components/Reveal'
import { useContent } from '../context/ContentContext'
import { formatDate } from '../lib/format'
import { copy } from '../lib/copy'
import { splitParagraphs } from '../lib/text'

export default function Opportunities() {
  const { opportunities, gallery } = useContent()
  const intro = copy(gallery, 'opportunitiesIntro')

  return (
    <div className="container">
      <header className="detail-head">
        <Reveal>
          <p className="label">Opportunities</p>
          <h1 className="display">{copy(gallery, 'opportunitiesHeadline')}</h1>
          {intro && (
            <p className="lede muted" style={{ marginTop: '0.8rem' }}>{intro}</p>
          )}
        </Reveal>
      </header>

      <div className="grid grid-2" style={{ paddingBottom: 'clamp(3rem, 6vw, 5rem)' }}>
        {opportunities.map((opp, i) => {
          const preview = splitParagraphs(opp.statement)[0] || ''
          return (
            <Reveal key={opp.slug} delay={i * 0.1}>
              <Link
                to={`/opportunities/${opp.slug}`}
                className="card"
                style={{ border: '1px solid var(--line)', padding: 'clamp(1.4rem, 3vw, 2.2rem)', height: '100%' }}
              >
                {opp.imageUrl && (
                  <div className="frame" style={{ marginBottom: '1rem' }}>
                    <Artwork seed={opp.slug} imageUrl={opp.imageUrl} ratio="16 / 10" />
                  </div>
                )}
                <p className="label" style={{ marginBottom: '1rem' }}>{opp.kind}</p>
                <p className="card-title" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>{opp.title}</p>
                {preview && (
                  <p className="muted" style={{ margin: '0.8rem 0 1.4rem' }}>{preview}</p>
                )}
                <p className="card-sub">Deadline: {formatDate(opp.deadline)}</p>
                {opp.showDates && <p className="card-sub">Show dates: {opp.showDates}</p>}
              </Link>
            </Reveal>
          )
        })}
      </div>
    </div>
  )
}
