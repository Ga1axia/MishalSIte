import { Link } from 'react-router-dom'
import Artwork from '../components/Artwork'
import Reveal from '../components/Reveal'
import { useContent } from '../context/ContentContext'
import { copy } from '../lib/copy'

export default function Artists() {
  const { artists, gallery } = useContent()
  const intro = copy(gallery, 'artistsIntro')

  return (
    <div className="container">
      <header className="detail-head">
        <Reveal>
          <p className="label">Artists</p>
          <h1 className="display">{copy(gallery, 'artistsHeadline')}</h1>
          {intro && (
            <p className="lede muted" style={{ marginTop: '0.8rem' }}>{intro}</p>
          )}
        </Reveal>
      </header>

      <div className="grid grid-3" style={{ paddingBottom: 'clamp(3rem, 6vw, 5rem)' }}>
        {artists.map((artist, i) => (
          <Reveal key={artist.slug} delay={i * 0.07}>
            <Link to={`/artists/${artist.slug}`} className="card">
              <div className="frame">
                <Artwork seed={artist.seed} imageUrl={artist.imageUrl} ratio="4 / 5" />
              </div>
              <p className="card-title" style={{ fontSize: '1.5rem' }}>{artist.name}</p>
              <p className="card-sub">{artist.discipline}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
