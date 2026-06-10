import Reveal from '../components/Reveal'
import { useContent } from '../context/ContentContext'

const INQUIRIES = [
  { label: 'General', subject: 'Hello' },
  { label: 'Exhibitions', subject: 'Exhibition inquiry' },
  { label: 'Sales & available works', subject: 'Sales inquiry' },
  { label: 'Submissions', subject: 'Submission inquiry' },
  { label: 'Press', subject: 'Press inquiry' },
]

export default function Contact() {
  const { gallery } = useContent()
  if (!gallery) return null

  return (
    <div className="container">
      <header className="detail-head">
        <Reveal>
          <p className="label">Contact</p>
          <h1 className="display">Say hello</h1>
          <p className="lede muted" style={{ marginTop: '0.8rem' }}>
            No forms, no friction. Email us directly or find us on Instagram.
          </p>
        </Reveal>
      </header>

      <section className="detail-grid" style={{ paddingBottom: 'clamp(3rem, 6vw, 5rem)' }}>
        <Reveal>
          <a
            href={`mailto:${gallery.email}`}
            className="headline text-link"
            style={{ display: 'inline-block' }}
          >
            {gallery.email}
          </a>
          <br />
          <a
            href={gallery.instagramHref}
            target="_blank"
            rel="noreferrer"
            className="headline text-link"
            style={{ display: 'inline-block', marginTop: '1.2rem' }}
          >
            {gallery.instagram}
          </a>
          <p className="muted" style={{ marginTop: '2.5rem' }}>
            {gallery.address}
            <br />
            {gallery.hours}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="label" style={{ marginBottom: '0.8rem' }}>Inquiry shortcuts</p>
          <ul className="meta-list">
            {INQUIRIES.map((inq) => (
              <li key={inq.label}>
                <span>{inq.label}</span>
                <a
                  href={`mailto:${gallery.email}?subject=${encodeURIComponent(inq.subject)}`}
                  className="text-link"
                >
                  Email →
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>
    </div>
  )
}
