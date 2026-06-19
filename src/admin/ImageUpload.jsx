import { useState } from 'react'
import { upload } from '@vercel/blob/client'

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
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const pathname = `uploads/${Date.now()}-${safeName}`
      const blob = await upload(pathname, file, {
        access: 'public',
        handleUploadUrl: '/api/admin/upload',
        contentType: file.type || 'image/jpeg',
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
