import { Link } from 'react-router-dom'
import Artwork from '../components/Artwork'
import Reveal from '../components/Reveal'
import { GALLERY } from '../data/content'

export default function About() {
  return (
    <div className="container">
      <header className="detail-head">
        <Reveal>
          <p className="label">About</p>
          <h1 className="display">A serious space with an open door</h1>
        </Reveal>
      </header>

      <Reveal>
        <Artwork seed="the-gallery-room" ratio="21 / 9" />
      </Reveal>

      <section className="section">
        <div className="detail-grid">
          <Reveal>
            <p className="label" style={{ marginBottom: '1rem' }}>Mission</p>
            <p className="statement">{GALLERY.mission}</p>
            <p className="label" style={{ margin: '2.2rem 0 1rem' }}>How we work</p>
            <p className="prose">{GALLERY.philosophy}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="label" style={{ marginBottom: '1rem' }}>Team</p>
            <ul className="meta-list">
              {GALLERY.team.map((member) => (
                <li key={member.name}>
                  <span>{member.role}</span>
                  <span>{member.name}</span>
                </li>
              ))}
            </ul>
            <p className="label" style={{ margin: '2.2rem 0 1rem' }}>Visit</p>
            <ul className="meta-list">
              <li><span>Address</span><span>{GALLERY.address}</span></li>
              <li><span>Hours</span><span>{GALLERY.hours}</span></li>
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0, textAlign: 'center' }}>
        <Reveal>
          <p className="big-quote" style={{ maxWidth: '30ch', margin: '0 auto 2rem' }}>
            High art vibes. Low barriers to entry.
          </p>
          <Link to="/contact" className="btn">Get in touch</Link>
        </Reveal>
      </section>
    </div>
  )
}
