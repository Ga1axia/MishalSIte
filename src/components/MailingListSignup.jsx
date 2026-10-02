import { useState } from 'react'

/**
 * Shared mailing-list signup used on Contact (and Coming Soon when enabled).
 */
export default function MailingListSignup({
  hint = 'Sign up for openings, exhibitions, and events.',
  className = '',
}) {
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
          : "Thank you. We'll be in touch.",
      )
      setEmail('')
    } catch (err) {
      setStatus('error')
      setMessage(err.message)
    }
  }

  return (
    <form className={`mailing-signup ${className}`.trim()} onSubmit={submit}>
      {hint && <p className="mailing-signup-hint">{hint}</p>}
      <div className="mailing-signup-row">
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
        <button type="submit" className="mailing-signup-btn" disabled={status === 'loading'} aria-label="Join mailing list">
          {status === 'loading' ? '…' : '→'}
        </button>
      </div>
      {message && (
        <p className={`mailing-signup-msg${status === 'error' ? ' is-error' : ''}`} role="status">
          {message}
        </p>
      )}
    </form>
  )
}
