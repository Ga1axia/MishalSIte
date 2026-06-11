import { useState } from 'react'

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
      const base64 = await fileToBase64(file)
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type || 'image/jpeg',
          base64,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Upload failed')
      }
      const data = await res.json()
      onChange(data.url)
    } catch (err) {
      setError(err.message)
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

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
