import { Link } from 'react-router-dom'
import Artwork from '../components/Artwork'
import Reveal from '../components/Reveal'
import { useContent } from '../context/ContentContext'
import { phoneTel } from '../lib/format'
import { copy } from '../lib/copy'

export default function About() {
  const { gallery } = useContent()
  if (!gallery) return null

  const quote = copy(gallery, 'aboutQuote')

  return (
    <div className="container">
      <header className="detail-head">
        <Reveal>
          <p className="label">About</p>
          <h1 className="display">{copy(gallery, 'aboutHeadline')}</h1>
        </Reveal>
      </header>

      <Reveal>
        <Artwork
          seed="the-gallery-room"
          imageUrl={gallery.aboutImageUrl}
          ratio="21 / 9"
          size="hero"
          priority
        />
      </Reveal>

      <section className="section">
        <div className="detail-grid">
          <Reveal>
            <p className="label" style={{ marginBottom: '1rem' }}>Mission</p>
            <p className="statement">{gallery.mission}</p>
            <p className="label" style={{ margin: '2.2rem 0 1rem' }}>How we work</p>
            <p className="prose">{gallery.philosophy}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="label" style={{ marginBottom: '1rem' }}>Team</p>
            <ul className="about-team">
              {(gallery.team || []).map((member) => (
                <li key={member.name}>
                  <p className="about-team-name">{member.name}</p>
                  {member.role && <p className="about-team-role">{member.role}</p>}
                  {member.bio && <p className="about-team-bio">{member.bio}</p>}
                </li>
              ))}
            </ul>
            <p className="label" style={{ margin: '2.2rem 0 1rem' }}>Visit</p>
            <ul className="meta-list">
              <li><span>Address</span><span>{gallery.address}</span></li>
              <li><span>Hours</span><span>{gallery.hours}</span></li>
              {gallery.phone && (
                <li>
                  <span>Phone</span>
                  <a href={phoneTel(gallery.phone)} className="text-link">{gallery.phone}</a>
                </li>
              )}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0, textAlign: 'center' }}>
        <Reveal>
          {quote && (
            <p className="big-quote" style={{ maxWidth: '30ch', margin: '0 auto 2rem' }}>
              {quote}
            </p>
          )}
          <Link to="/contact" className="btn">Get in touch</Link>
        </Reveal>
      </section>
    </div>
  )
}
