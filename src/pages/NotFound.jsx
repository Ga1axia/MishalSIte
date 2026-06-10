import { Link } from 'react-router-dom'
import Artwork from '../components/Artwork'
import Reveal from '../components/Reveal'

export default function NotFound() {
  return (
    <div className="container" style={{ textAlign: 'center', paddingBlock: 'clamp(3rem, 8vw, 6rem)' }}>
      <Reveal>
        <div style={{ maxWidth: '20rem', margin: '0 auto 2rem' }}>
          <Artwork seed="lost-room" ratio="1 / 1" rounded />
        </div>
        <h1 className="display">Not on view</h1>
        <p className="muted" style={{ margin: '1rem 0 2rem' }}>
          This page is either deinstalled or never existed.
        </p>
        <Link to="/" className="btn">Back to the gallery</Link>
      </Reveal>
    </div>
  )
}
