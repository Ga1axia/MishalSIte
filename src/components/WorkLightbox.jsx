import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import Artwork from './Artwork'

function MetaLine({ work, artistName, priceLabel }) {
  const parts = [work.title, artistName, work.medium, work.dimensions, priceLabel].filter(Boolean)
  return (
    <>
      {parts.map((part, i) => (
        <span key={`${i}-${part}`}>
          {i > 0 && <span className="work-lightbox-sep" aria-hidden="true"> · </span>}
          <span className={i === 0 ? 'work-lightbox-title' : undefined}>{part}</span>
        </span>
      ))}
    </>
  )
}

export default function WorkLightbox({ work, artistName, onClose }) {
  const [orientation, setOrientation] = useState('landscape')

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  useEffect(() => {
    setOrientation('landscape')
  }, [work?.id])

  const priceLabel = useMemo(() => {
    if (!work) return null
    return work.price === 'Inquire' ? 'Inquire for price' : work.price
  }, [work])

  if (!work) return null

  return createPortal(
    <div
      className={`work-lightbox work-lightbox--${orientation}`}
      role="dialog"
      aria-modal="true"
      aria-label={work.title}
      onClick={onClose}
    >
      <button type="button" className="work-lightbox-close" onClick={onClose} aria-label="Close">
        ×
      </button>
      <div className="work-lightbox-stage" onClick={(e) => e.stopPropagation()}>
        <Artwork
          seed={work.seed}
          imageUrl={work.imageUrl}
          className="work-lightbox-art"
          fit="contain"
          size="full"
          priority
          onNaturalSize={({ width, height }) => {
            setOrientation(height > width ? 'portrait' : 'landscape')
          }}
        />
        <div className="work-lightbox-meta">
          <MetaLine work={work} artistName={artistName} priceLabel={priceLabel} />
        </div>
      </div>
    </div>,
    document.body,
  )
}
