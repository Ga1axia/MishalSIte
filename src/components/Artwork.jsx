import { useState } from 'react'

// Dummy artwork photos via Lorem Picsum. Each seed always resolves to
// the same photo, so artists / works / exhibitions keep a stable image
// across the site — swap for real photography later by mapping the
// same seeds to image files.

function dimensions(ratio) {
  const [w, h] = ratio.split('/').map((n) => parseFloat(n))
  const W = 900
  return [W, Math.round((W * h) / w)]
}

export default function Artwork({ seed, ratio = '4 / 5', className = '', rounded = false }) {
  const [loaded, setLoaded] = useState(false)
  const [W, H] = dimensions(ratio)
  const src = `https://picsum.photos/seed/${encodeURIComponent(seed)}/${W}/${H}`

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
