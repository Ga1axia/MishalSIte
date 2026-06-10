import { Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'

export default function Footer() {
  const { gallery } = useContent()
  if (!gallery) return null

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <p className="footer-logo">
              25 <span>West</span>
            </p>
            <p className="muted" style={{ marginTop: '0.8rem', maxWidth: '32ch' }}>
              {gallery.address}
              <br />
              {gallery.hours}
            </p>
          </div>
          <div>
            <p className="label" style={{ marginBottom: '0.8rem' }}>Visit</p>
            <ul className="footer-list">
              <li><Link to="/exhibitions" className="text-link">Exhibitions</Link></li>
              <li><Link to="/events" className="text-link">Events</Link></li>
              <li><Link to="/artists" className="text-link">Artists</Link></li>
              <li><Link to="/opportunities" className="text-link">Opportunities</Link></li>
            </ul>
          </div>
          <div>
            <p className="label" style={{ marginBottom: '0.8rem' }}>Contact</p>
            <ul className="footer-list">
              <li>
                <a href={`mailto:${gallery.email}`} className="text-link">{gallery.email}</a>
              </li>
              <li>
                <a href={gallery.instagramHref} target="_blank" rel="noreferrer" className="text-link">
                  {gallery.instagram}
                </a>
              </li>
              <li><Link to="/about" className="text-link">About the gallery</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} 25 West Gallery</span>
          <span className="italic">Ephemeral, esoteric, open to all.</span>
        </div>
      </div>
    </footer>
  )
}
