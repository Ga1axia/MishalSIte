import { useEffect, useState } from 'react'
import { useContent } from '../context/ContentContext'
import { phoneTel } from '../lib/format'
import { countdownParts, isComingSoonActive, launchDateLabel } from '../lib/site'
import MailingListSignup from '../components/MailingListSignup'
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

function oneLine(text) {
  return String(text || '').replace(/\s+/g, ' ').trim()
}

function displayHeadline(gallery) {
  const raw = oneLine(gallery.comingSoonHeadline)
  if (raw && !/^opening\s*soon\.?$/i.test(raw)) return raw
  return 'A new gallery is on its way.'
}

function displayMessage(gallery) {
  const raw = oneLine(gallery.comingSoonMessage)
  if (raw && raw.length > 8 && !/^insert\.?$/i.test(raw)) return raw
  return null
}

/** White plate with a rectangular hole — background photo shows through the hole only. */
function PlateShape({ hole, className = '' }) {
  return (
    <svg
      className={`cs-plate-shape ${className}`.trim()}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path fill="var(--bg)" fillRule="evenodd" d={`M0,0 H100 V100 H0 Z ${hole}`} />
    </svg>
  )
}

export default function ComingSoon() {
  const { gallery, loading } = useContent()

  if (loading || !gallery) {
    return <div className="cs-shell cs-shell--loading" aria-busy="true" />
  }

  if (!isComingSoonActive(gallery)) return null

  const headline = displayHeadline(gallery)
  const message = displayMessage(gallery)
  const heroSrc = gallery.comingSoonImageUrl?.trim() || null
  const dateLabel = launchDateLabel(gallery.launchDate)

  return (
    <div className={`cs-shell${heroSrc ? '' : ' cs-shell--no-photo'}`}>
      {heroSrc ? (
        <div className="cs-bg" aria-hidden="true">
          <img src={heroSrc} alt="" className="cs-bg-img" />
        </div>
      ) : null}

      <div className="cs-stage">
        <div className="cs-plate">
          <PlateShape hole="M56.5,11 H94.5 V74 H56.5 Z" className="cs-plate-shape--desktop" />
          <PlateShape hole="M8,11 H92 V42 H8 Z" className="cs-plate-shape--mobile" />

          <div className="cs-plate-body">
            <div className="cs-copy">
              <p className="label cs-kicker">Coming soon</p>
              <h1 className="cs-headline">{headline}</h1>
              {message && <p className="cs-message">{message}</p>}

              {gallery.launchDate && (
                <div className="cs-timer-block">
                  <p className="cs-opening-in">Opening in…</p>
                  <Countdown launchDate={gallery.launchDate} />
                </div>
              )}

              <MailingListSignup
                className="cs-signup"
                hint="Sign up to hear about our opening and first exhibitions."
              />
            </div>

            <div className="cs-aperture" aria-hidden="true" />
          </div>

          <footer className="cs-plate-footer">
            {dateLabel && <p className="cs-open-date">{dateLabel}</p>}
            <div className="cs-contact">
              {gallery.email && <a href={`mailto:${gallery.email}`}>{gallery.email}</a>}
              {gallery.phone && <a href={phoneTel(gallery.phone)}>{gallery.phone}</a>}
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
