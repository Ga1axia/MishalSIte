import { useState } from 'react'
import { upload } from '@vercel/blob/client'

const MAX_EDGE = 1800
const JPEG_QUALITY = 0.82

/** Resize large photos before upload so gallery pages load faster. */
async function prepareImageFile(file) {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    return file
  }

  let bitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    return file
  }

  const { width, height } = bitmap
  const longest = Math.max(width, height)
  if (longest <= MAX_EDGE) {
    bitmap.close()
    return file
  }

  const scale = MAX_EDGE / longest
  const w = Math.round(width * scale)
  const h = Math.round(height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close()
    return file
  }
  ctx.drawImage(bitmap, 0, 0, w, h)
  bitmap.close()

  const preferJpeg = file.type !== 'image/png' && file.type !== 'image/webp'
  const mime = preferJpeg ? 'image/jpeg' : file.type
  const blob = await new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b), mime, preferJpeg ? JPEG_QUALITY : undefined)
  })

  if (!blob || blob.size >= file.size) return file

  const base = file.name.replace(/\.[^.]+$/, '') || 'image'
  const ext = mime === 'image/jpeg' ? 'jpg' : mime === 'image/webp' ? 'webp' : 'png'
  return new File([blob], `${base}.${ext}`, { type: mime, lastModified: Date.now() })
}

export default function ImageUpload({ value, onChange, label = 'Image' }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [showUrl, setShowUrl] = useState(false)

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const prepared = await prepareImageFile(file)
      const safeName = prepared.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const pathname = `uploads/${Date.now()}-${safeName}`
      const blob = await upload(pathname, prepared, {
        access: 'public',
        handleUploadUrl: '/api/admin/upload',
        contentType: prepared.type || 'image/jpeg',
      })
      onChange(blob.url)
    } catch (err) {
      const msg = err.message || 'Upload failed'
      if (msg.includes('client token') || msg.includes('Not authenticated')) {
        setError('Session expired — please log out and log in again, then retry.')
      } else {
        setError(msg)
      }
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="admin-field">
      <span className="admin-field-label">{label}</span>
      {value && (
        <div className="admin-image-preview">
          <img src={value} alt="" />
        </div>
      )}
      <label className="admin-upload-btn">
        {uploading ? 'Uploading…' : value ? 'Replace image' : 'Choose image'}
        <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} hidden />
      </label>
      {!showUrl ? (
        <button type="button" className="admin-text-btn" onClick={() => setShowUrl(true)}>
          Paste image URL instead
        </button>
      ) : (
        <input
          type="url"
          value={value || ''}
          onChange={(e) => onChange(e.target.value || null)}
          placeholder="https://…"
        />
      )}
      {error && <p className="admin-error">{error}</p>}
    </div>
  )
}
