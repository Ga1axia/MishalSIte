import { useEffect, useState } from 'react'
import { useContent } from '../context/ContentContext'
import { phoneTel } from '../lib/format'
import { countdownParts, isComingSoonActive, launchDateLabel } from '../lib/site'
import './coming-soon.css'

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
    { value: parts.minutes, label: 'Minutes' },
    { value: parts.seconds, label: 'Seconds' },
  ]

  return (
    <div className="cs-countdown" aria-live="polite">
      {cells.map((c, i) => (
        <div key={c.label} className="cs-countdown-cell">
          {i > 0 && <span className="cs-countdown-sep" aria-hidden="true" />}
          <div className="cs-countdown-inner">
            <span className="cs-countdown-num">{String(c.value).padStart(2, '0')}</span>
            <span className="cs-countdown-label">{c.label}</span>
          </div>
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
          ? "You're already on the list."
          : "Thank you — we'll be in touch before we open.",
      )
      setEmail('')
    } catch (err) {
      setStatus('error')
      setMessage(err.message)
    }
  }

  return (
    <form className="cs-signup" onSubmit={submit}>
      <label className="label cs-signup-label" htmlFor="cs-email">
        Join the list
      </label>
      <p className="cs-signup-hint">Opening details, exhibitions, and events — straight to your inbox.</p>
      <div className="cs-signup-row">
        <input
          id="cs-email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          required
          autoComplete="email"
          disabled={status === 'loading'}
        />
        <button type="submit" className="cs-signup-btn" disabled={status === 'loading'}>
          {status === 'loading' ? 'Sending…' : 'Notify me'}
        </button>
      </div>
      {message && (
        <p className={`cs-signup-msg${status === 'error' ? ' is-error' : ''}`} role="status">
          {message}
        </p>
      )}
    </form>
  )
}

function displayMessage(gallery) {
  const raw = gallery.comingSoonMessage?.trim()
  if (raw && raw.length > 12 && !/^insert\.?$/i.test(raw)) return raw
  const fromMission = gallery.mission?.trim()
  if (fromMission) {
    const first = fromMission.split('.').find((s) => s.trim().length > 20)
    if (first) return `${first.trim()}.`
  }
  return 'A fine art space and cultural hub opening in the Bay Area.'
}

export default function ComingSoon() {
  const { gallery, loading } = useContent()

  if (loading || !gallery) {
    return (
      <div className="cs-shell cs-shell--loading">
        <p className="cs-logo">25 West Gallery</p>
      </div>
    )
  }

  if (!isComingSoonActive(gallery)) return null

  const headline = gallery.comingSoonHeadline?.trim() || 'Opening soon'
  const message = displayMessage(gallery)
  const heroSrc = gallery.comingSoonImageUrl?.trim() || null
  const dateLabel = launchDateLabel(gallery.launchDate)

  return (
    <div className="cs-shell">
      <div className="cs-panel cs-panel--copy">
        <header className="cs-top">
          <p className="cs-logo">25 West Gallery</p>
          <p className="label">Oakland · Bay Area</p>
        </header>

        <div className="cs-body">
          <h1 className="cs-headline">{headline}</h1>
          {dateLabel && <p className="cs-date">Opening {dateLabel}</p>}
          {gallery.launchDate && <Countdown launchDate={gallery.launchDate} />}
          <p className="cs-message">{message}</p>
          <EmailSignup />
        </div>

        <footer className="cs-footer">
          <div className="cs-contact">
            {gallery.phone && (
              <a href={phoneTel(gallery.phone)}>{gallery.phone}</a>
            )}
            {gallery.email && (
              <a href={`mailto:${gallery.email}`}>{gallery.email}</a>
            )}
            {gallery.instagramHref && (
              <a href={gallery.instagramHref} target="_blank" rel="noreferrer">
                {gallery.instagram}
              </a>
            )}
          </div>
        </footer>
      </div>

      <div className={`cs-panel cs-panel--visual${heroSrc ? '' : ' cs-panel--visual-empty'}`}>
        {heroSrc ? (
          <img src={heroSrc} alt="" className="cs-visual-img" />
        ) : (
          <div className="cs-visual-fallback" aria-hidden="true">
            <span className="cs-visual-mark">25</span>
          </div>
        )}
      </div>
    </div>
  )
}
