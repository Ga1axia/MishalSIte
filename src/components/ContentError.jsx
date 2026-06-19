import { useContent } from '../context/ContentContext'

export default function ContentError() {
  const { error, reload } = useContent()

  return (
    <div className="container" style={{ padding: '6rem 0', textAlign: 'center', maxWidth: '36ch', margin: '0 auto' }}>
      <p className="label">25 West Gallery</p>
      <p className="headline" style={{ marginTop: '0.6rem' }}>Content unavailable</p>
      <p className="muted" style={{ marginTop: '1rem' }}>
        {error || 'Could not load gallery content from the database.'}
      </p>
      <button type="button" className="btn" style={{ marginTop: '1.6rem' }} onClick={reload}>
        Try again
      </button>
    </div>
  )
}
