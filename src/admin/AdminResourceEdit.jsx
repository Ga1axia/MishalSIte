import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ADMIN_RESOURCES, FORM_CONFIGS } from './formConfigs'
import ImageUpload from './ImageUpload'

function parseFieldValue(field, raw) {
  if (field.type === 'json') {
    try {
      return raw ? JSON.parse(raw) : field.name === 'related' ? {} : []
    } catch {
      throw new Error(`Invalid JSON in ${field.label}`)
    }
  }
  if (field.type === 'image') return raw || null
  return raw
}

function serializeForForm(field, value) {
  if (field.type === 'json') return JSON.stringify(value ?? (field.name === 'related' ? {} : []), null, 2)
  if (value == null) return ''
  return String(value)
}

export default function AdminResourceEdit() {
  const { resource: resourceKey, id } = useParams()
  const navigate = useNavigate()
  const resource = ADMIN_RESOURCES.find((r) => r.key === resourceKey)
  const config = FORM_CONFIGS[resourceKey]
  const isNew = id === 'new'
  const isSingleton = resource?.singleton

  const [form, setForm] = useState({})
  const [jsonFields, setJsonFields] = useState({})
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!resource || !config) return
    if (isNew) {
      const initial = {}
      const jsonInitial = {}
      for (const field of config.fields) {
        if (field.type === 'json') jsonInitial[field.name] = serializeForForm(field, null)
        else initial[field.name] = ''
      }
      setForm(initial)
      setJsonFields(jsonInitial)
      setLoading(false)
      return
    }

    const recordId = isSingleton ? '1' : id
    setLoading(true)
    fetch(`/api/admin/${resource.key}/${recordId}`, { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error('Not found')
        const data = await res.json()
        const item = data.item
        const next = {}
        const jsonNext = {}
        for (const field of config.fields) {
          if (field.type === 'json') jsonNext[field.name] = serializeForForm(field, item[field.name])
          else next[field.name] = item[field.name] ?? ''
        }
        setForm(next)
        setJsonFields(jsonNext)
      })
      .catch(() => setError('Could not load record.'))
      .finally(() => setLoading(false))
  }, [resource, config, id, isNew, isSingleton])

  if (!resource || !config) return <p className="admin-error">Unknown section.</p>

  const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }))
  const setJsonField = (name, value) => setJsonFields((f) => ({ ...f, [name]: value }))

  const buildPayload = () => {
    const payload = {}
    for (const field of config.fields) {
      if (field.createOnly && !isNew) continue
      if (field.type === 'json') {
        payload[field.name] = parseFieldValue(field, jsonFields[field.name])
      } else {
        payload[field.name] = parseFieldValue(field, form[field.name])
      }
    }
    return payload
  }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = buildPayload()
      const recordId = isSingleton ? '1' : id
      const url = isNew ? `/api/admin/${resource.key}` : `/api/admin/${resource.key}/${recordId}`
      const method = isNew ? 'POST' : 'PUT'
      const res = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Save failed')
      }
      const data = await res.json()
      const savedId = isSingleton ? '1' : data.item[resource.idField]
      navigate(`/admin/${resource.key}/${savedId}`, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    if (isSingleton || isNew) return
    if (!window.confirm('Delete this item permanently?')) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/${resource.key}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Delete failed')
      navigate(`/admin/${resource.key}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="admin-muted">Loading…</p>

  return (
    <div>
      <div className="admin-toolbar">
        <h2 className="admin-page-title">
          {isNew ? `New ${config.title}` : `Edit ${config.title}`}
        </h2>
        <Link to={`/admin/${resource.key}`} className="admin-link">← Back</Link>
      </div>

      <form className="admin-form" onSubmit={save}>
        {config.fields.map((field) => {
          if (field.createOnly && !isNew) return null
          if (field.type === 'image') {
            return (
              <ImageUpload
                key={field.name}
                label={field.label}
                value={form[field.name]}
                onChange={(v) => setField(field.name, v)}
              />
            )
          }
          if (field.type === 'textarea') {
            return (
              <label key={field.name} className="admin-field">
                {field.label}
                <textarea
                  rows={5}
                  value={form[field.name] ?? ''}
                  onChange={(e) => setField(field.name, e.target.value)}
                  required={field.required}
                />
              </label>
            )
          }
          if (field.type === 'json') {
            return (
              <label key={field.name} className="admin-field">
                {field.label}
                <textarea
                  rows={6}
                  value={jsonFields[field.name] ?? ''}
                  onChange={(e) => setJsonField(field.name, e.target.value)}
                  className="admin-code"
                />
              </label>
            )
          }
          if (field.type === 'select') {
            return (
              <label key={field.name} className="admin-field">
                {field.label}
                <select value={form[field.name] ?? field.options[0]} onChange={(e) => setField(field.name, e.target.value)}>
                  {field.options.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </label>
            )
          }
          return (
            <label key={field.name} className="admin-field">
              {field.label}
              <input
                type={field.type}
                value={form[field.name] ?? ''}
                onChange={(e) => setField(field.name, e.target.value)}
                required={field.required}
              />
            </label>
          )
        })}

        {error && <p className="admin-error">{error}</p>}

        <div className="admin-form-actions">
          <button type="submit" className="admin-btn" disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
          {!isSingleton && !isNew && (
            <button type="button" className="admin-btn admin-btn-danger" onClick={remove} disabled={saving}>
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
