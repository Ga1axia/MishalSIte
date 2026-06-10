import { useState } from 'react'

function dimensions(ratio) {
  const [w, h] = ratio.split('/').map((n) => parseFloat(n))
  const W = 900
  return [W, Math.round((W * h) / w)]
}

export default function Artwork({
  seed,
  imageUrl,
  ratio = '4 / 5',
  className = '',
  rounded = false,
}) {
  const [loaded, setLoaded] = useState(false)
  const [W, H] = dimensions(ratio)
  const fallback = `https://picsum.photos/seed/${encodeURIComponent(seed)}/${W}/${H}`
  const src = imageUrl || fallback

  return (
    <div
      className={`artwork ${className}`}
      style={{ aspectRatio: ratio, borderRadius: rounded ? '50%' : undefined }}
    >
      <img
        src={src}
        width={W}
        height={H}
        alt=""
        loading="lazy"
        className={loaded ? 'loaded' : ''}
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
}
