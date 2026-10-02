import Reveal from '../components/Reveal'
import MailingListSignup from '../components/MailingListSignup'
import { useContent } from '../context/ContentContext'
import { phoneTel } from '../lib/format'
import { copy } from '../lib/copy'

export default function Contact() {
  const { gallery } = useContent()
  if (!gallery) return null

  const intro = copy(gallery, 'contactIntro')

  return (
    <div className="container">
      <header className="detail-head">
        <Reveal>
          <p className="label">Contact</p>
          <h1 className="display">{copy(gallery, 'contactHeadline')}</h1>
          {intro && (
            <p className="lede muted" style={{ marginTop: '0.8rem' }}>{intro}</p>
          )}
        </Reveal>
      </header>

      <section className="detail-grid" style={{ paddingBottom: 'clamp(3rem, 6vw, 5rem)' }}>
        <Reveal>
          {gallery.phone && (
            <>
              <a
                href={phoneTel(gallery.phone)}
                className="headline text-link"
                style={{ display: 'inline-block' }}
              >
                {gallery.phone}
              </a>
              <br />
            </>
          )}
          <a
            href={`mailto:${gallery.email}`}
            className="headline text-link"
            style={{ display: 'inline-block', marginTop: gallery.phone ? '1.2rem' : undefined }}
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
          <p className="label" style={{ marginBottom: '0.8rem' }}>Join our mailing list</p>
          <p className="muted" style={{ marginBottom: '1rem', maxWidth: '32ch' }}>
            Openings, exhibitions, and events — occasional notes, never spam.
          </p>
          <MailingListSignup hint="" />
        </Reveal>
      </section>
    </div>
  )
}
