import { useEffect, useRef, useState } from 'react'

function dimensions(ratio, maxWidth) {
  const [w, h] = ratio.split('/').map((n) => parseFloat(n))
  const W = maxWidth
  return [W, Math.round((W * h) / w)]
}

function normalizeImageUrl(imageUrl) {
  if (typeof imageUrl !== 'string') return null
  const trimmed = imageUrl.trim()
  return trimmed || null
}

export default function Artwork({
  seed,
  imageUrl,
  ratio = '4 / 5',
  className = '',
  rounded = false,
  fit = 'cover',
  priority = false,
  size = 'grid',
  onNaturalSize,
}) {
  const imgRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [useFallback, setUseFallback] = useState(false)
  const natural = fit === 'contain'
  const maxWidth = size === 'hero' ? 1400 : size === 'full' || natural ? 1600 : 720
  const [W, H] = dimensions(natural ? '1 / 1' : ratio, maxWidth)
  const fallback = `https://picsum.photos/seed/${encodeURIComponent(seed)}/${W}/${H}`
  const uploaded = normalizeImageUrl(imageUrl)
  const src = !useFallback && uploaded ? uploaded : fallback

  const reportSize = (img) => {
    if (!img || !onNaturalSize) return
    if (img.naturalWidth > 0 && img.naturalHeight > 0) {
      onNaturalSize({ width: img.naturalWidth, height: img.naturalHeight })
    }
  }

  useEffect(() => {
    setUseFallback(false)
    const img = imgRef.current
    if (img?.complete && img.naturalWidth > 0) {
      setLoaded(true)
      reportSize(img)
    } else {
      setLoaded(false)
    }
  }, [uploaded, src])

  return (
    <div
      className={`artwork${natural ? ' artwork--natural' : ''} ${className}`.trim()}
      style={
        natural
          ? { borderRadius: rounded ? '50%' : undefined }
          : { aspectRatio: ratio, borderRadius: rounded ? '50%' : undefined }
      }
    >
      <img
        ref={imgRef}
        src={src}
        width={W}
        height={H}
        alt=""
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        className={loaded ? 'loaded' : ''}
        style={{ objectFit: fit }}
        onLoad={(e) => {
          setLoaded(true)
          reportSize(e.currentTarget)
        }}
        onError={() => {
          if (uploaded && !useFallback) {
            setUseFallback(true)
            setLoaded(false)
          }
        }}
      />
    </div>
  )
}
