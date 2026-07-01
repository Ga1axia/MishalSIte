import { useEffect, useState } from 'react'
import { useContent } from '../context/ContentContext'
import { phoneTel } from '../lib/format'
import { countdownParts, isComingSoonActive, launchDateLabel } from '../lib/site'
import './coming-soon.css'

const TICKER_PHRASES = [
  'Exhibitions',
  'Artists',
  'Community',
  'Oakland',
  'Bay Area',
  'Openings',
  'Contemporary art',
  '25 West',
]

function Countdown({ launchDate }) {
  const [parts, setParts] = useState(() => countdownParts(launchDate))

  useEffect(() => {
    const id = setInterval(() => setParts(countdownParts(launchDate)), 1000)
    return () => clearInterval(id)
  }, [launchDate])

  if (!parts || parts.complete) return null

  const cells = [
    { value: parts.days, label: 'Days' },
    { value: parts.hours, label: 'Hours' },
    { value: parts.minutes, label: 'Mins' },
    { value: parts.seconds, label: 'Secs' },
  ]

  return (
    <div className="cs-countdown" aria-live="polite">
      {cells.map((c) => (
        <div key={c.label} className="cs-countdown-cell">
          <span className="cs-countdown-num">{String(c.value).padStart(2, '0')}</span>
          <span className="cs-countdown-label">{c.label}</span>
        </div>
      ))}
    </div>
  )
}

function EmailSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setStatus('success')
      setMessage(
        data.alreadySubscribed
          ? "You're already on the list — we'll be in touch."
          : "You're on the list. We'll share opening details soon.",
      )
      setEmail('')
    } catch (err) {
      setStatus('error')
      setMessage(err.message)
    }
  }

  return (
    <form className="cs-signup" onSubmit={submit}>
      <p className="label cs-signup-label">Stay informed</p>
      <div className="cs-signup-row">
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          required
          autoComplete="email"
          disabled={status === 'loading'}
          aria-label="Email address"
        />
        <button type="submit" className="cs-signup-btn" disabled={status === 'loading'}>
          {status === 'loading' ? '…' : 'Notify me'}
        </button>
      </div>
      {message && (
        <p className={`cs-signup-msg${status === 'error' ? ' cs-signup-msg-error' : ''}`}>{message}</p>
      )}
    </form>
  )
}

export default function ComingSoon() {
  const { gallery, loading } = useContent()

  if (loading || !gallery) {
    return (
      <div className="cs-shell">
        <p className="label">25 West Gallery</p>
      </div>
    )
  }

  if (!isComingSoonActive(gallery)) return null

  const headline = gallery.comingSoonHeadline || 'Opening soon'
  const message =
    gallery.comingSoonMessage ||
    gallery.mission?.split('.')[0] + '.' ||
    'A fine art space opening in the Bay Area.'
  const heroSrc =
    gallery.comingSoonImageUrl ||
    'https://picsum.photos/seed/25-west-opening/1600/900'
  const dateLabel = launchDateLabel(gallery.launchDate)

  return (
    <div className="cs-shell">
      <div className="cs-grain" aria-hidden="true" />
      <div className="cs-frame cs-frame-a" aria-hidden="true" />
      <div className="cs-frame cs-frame-b" aria-hidden="true" />

      <header className="cs-header">
        <p className="cs-logo">25 West Gallery</p>
        <p className="label">Opening soon</p>
      </header>

      <div className="cs-hero-wrap">
        <div className="cs-hero">
          <img src={heroSrc} alt="" className="cs-hero-img" />
        </div>
      </div>

      <main className="cs-main">
        <h1 className="cs-headline">{headline}</h1>
        {dateLabel && <p className="cs-date">Opening {dateLabel}</p>}
        {gallery.launchDate && <Countdown launchDate={gallery.launchDate} />}
        <p className="cs-message">{message}</p>

        <EmailSignup />

        <div className="cs-contact">
          {gallery.phone && (
            <a href={phoneTel(gallery.phone)} className="text-link">
              {gallery.phone}
            </a>
          )}
          {gallery.email && (
            <a href={`mailto:${gallery.email}`} className="text-link">
              {gallery.email}
            </a>
          )}
          {gallery.instagramHref && (
            <a href={gallery.instagramHref} target="_blank" rel="noreferrer" className="text-link">
              {gallery.instagram}
            </a>
          )}
        </div>
      </main>

      <div className="cs-ticker" aria-hidden="true">
        <div className="cs-ticker-track">
          {[...TICKER_PHRASES, ...TICKER_PHRASES].map((phrase, i) => (
            <span key={i} className="cs-ticker-item">
              {phrase}
              <span className="cs-ticker-dot">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
