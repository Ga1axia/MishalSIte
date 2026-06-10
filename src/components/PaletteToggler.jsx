import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../theme/ThemeProvider'

export default function PaletteToggler() {
  const { paletteId, setPaletteId, palettes } = useTheme()
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="palette-fab" ref={rootRef}>
      <div className={`palette-panel${open ? ' open' : ''}`} role="menu" aria-label="Color palettes">
        <span className="label">Palette study</span>
        {palettes.map((p) => (
          <button
            key={p.id}
            role="menuitemradio"
            aria-checked={paletteId === p.id}
            className={`palette-option${paletteId === p.id ? ' selected' : ''}`}
            onClick={() => setPaletteId(p.id)}
          >
            <span className="swatches" aria-hidden="true">
              <span className="swatch" style={{ background: p.vars['--bg'] }} />
              <span className="swatch" style={{ background: p.vars['--accent'] }} />
              <span className="swatch" style={{ background: p.vars['--art-b'] }} />
            </span>
            <span>
              <span className="name">{p.name}</span>
              <br />
              <span className="note">{p.note}</span>
            </span>
            {paletteId === p.id && <span className="check">●</span>}
          </button>
        ))}
      </div>
      <button
        className="palette-btn"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Toggle color palette picker"
        title="Try a different palette"
      >
        <span className="palette-wheel" />
      </button>
    </div>
  )
}
