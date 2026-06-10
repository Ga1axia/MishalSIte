import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

// Per the planning doc: the logo is the route home on desktop (no
// explicit "Home" item), while mobile gets a flattened menu that
// includes Home so the pathway is never missed.

const LINKS = [
  {
    to: '/exhibitions',
    label: 'Exhibitions',
    children: [
      { to: '/exhibitions', label: 'Current' },
      { to: '/exhibitions#archive', label: 'Archive' },
    ],
  },
  { to: '/events', label: 'Community & Events' },
  { to: '/artists', label: 'Artists' },
  { to: '/opportunities', label: 'Opportunities' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header className="nav">
        <div className="container nav-inner">
          <Link to="/" className="logo" aria-label="25 West Gallery — home">
            25 <em>West</em> Gallery
          </Link>

          <nav className="nav-links" aria-label="Primary">
            {LINKS.map((link) => (
              <div className="nav-item" key={link.label}>
                <NavLink to={link.to} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                  {link.label}
                </NavLink>
                {link.children && (
                  <div className="nav-drop">
                    <div className="nav-drop-inner">
                      {link.children.map((c) => (
                        <Link key={c.label} to={c.to}>
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <button className="menu-btn" onClick={() => setOpen(true)} aria-label="Open menu">
            Menu
          </button>
        </div>
      </header>

      <div className={`mobile-menu${open ? ' open' : ''}`} aria-hidden={!open}>
        <div className="mobile-menu-head">
          <span className="logo">
            25 <em>West</em> Gallery
          </span>
          <button className="menu-btn" style={{ display: 'block' }} onClick={() => setOpen(false)} aria-label="Close menu">
            Close
          </button>
        </div>
        <nav aria-label="Mobile">
          {[{ to: '/', label: 'Home' }, ...LINKS].map((link, i) => (
            <Link key={link.label} to={link.to} style={{ animationDelay: `${0.08 + i * 0.05}s` }}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}
