import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ADMIN_RESOURCES,
  FORM_CONFIGS,
  itemToForm,
  emptyForm,
  formToPayload,
} from './formConfigs'
import useAdminOptions from './useAdminOptions'
import ImageUpload from './ImageUpload'
import StringListField, {
  LinkListField,
  TeamListField,
  CheckboxPickField,
  ArtistSelectField,
  RelatedField,
  InstallPhotosField,
} from './FormFields'

function FieldRenderer({ field, form, setField, options }) {
  const { artists, exhibitions, works } = options
  const value = form[field.name]

  if (field.type === 'image') {
    return (
      <ImageUpload
        label={field.label}
        value={value}
        onChange={(v) => setField(field.name, v)}
      />
    )
  }

  if (field.type === 'textarea') {
    return (
      <label className="admin-field">
        {field.label}
        {field.hint && <span className="admin-hint">{field.hint}</span>}
        <textarea
          rows={5}
          value={value ?? ''}
          onChange={(e) => setField(field.name, e.target.value)}
          required={field.required}
        />
      </label>
    )
  }

  if (field.type === 'select') {
    const opts = field.options || []
    return (
      <label className="admin-field">
        {field.label}
        <select
          value={value ?? opts[0]?.value ?? ''}
          onChange={(e) => setField(field.name, e.target.value)}
        >
          {opts.map((o) => (
            <option key={o.value ?? o} value={o.value ?? o}>
              {o.label ?? o}
            </option>
          ))}
        </select>
      </label>
    )
  }

  if (field.type === 'stringList') {
    return (
      <StringListField
        label={field.label}
        hint={field.hint}
        value={value}
        onChange={(v) => setField(field.name, v)}
      />
    )
  }

  if (field.type === 'links') {
    return <LinkListField label={field.label} value={value} onChange={(v) => setField(field.name, v)} />
  }

  if (field.type === 'team') {
    return <TeamListField label={field.label} value={value} onChange={(v) => setField(field.name, v)} />
  }

  if (field.type === 'artistPick') {
    return (
      <CheckboxPickField
        label={field.label}
        hint={field.hint}
        value={value}
        onChange={(v) => setField(field.name, v)}
        options={artists.map((a) => ({ id: a.slug, label: a.name }))}
      />
    )
  }

  if (field.type === 'exhibitionPick') {
    return (
      <CheckboxPickField
        label={field.label}
        value={value}
        onChange={(v) => setField(field.name, v)}
        options={exhibitions.map((ex) => ({ id: ex.slug, label: ex.title }))}
      />
    )
  }

  if (field.type === 'workPick') {
    return (
      <CheckboxPickField
        label={field.label}
        value={value}
        onChange={(v) => setField(field.name, v)}
        options={works.map((w) => ({
          id: w.id,
          label: `${w.title}${w.artist ? ` — ${artists.find((a) => a.slug === w.artist)?.name || w.artist}` : ''}`,
        }))}
      />
    )
  }

  if (field.type === 'artistSelect') {
    return (
      <ArtistSelectField
        label={field.label}
        required={field.required}
        artists={artists}
        value={value}
        onChange={(v) => setField(field.name, v)}
      />
    )
  }

  if (field.type === 'related') {
    return (
      <RelatedField
        label={field.label}
        artists={artists}
        exhibitions={exhibitions}
        value={value}
        onChange={(v) => setField(field.name, v)}
      />
    )
  }

  if (field.type === 'installPhotos') {
    return (
      <InstallPhotosField
        label={field.label}
        value={form.installPhotos}
        onChange={(v) => setField('installPhotos', v)}
      />
    )
  }

  return (
    <label className="admin-field">
      {field.label}
      {field.hint && <span className="admin-hint">{field.hint}</span>}
      <input
        type={field.type || 'text'}
        value={value ?? ''}
        onChange={(e) => setField(field.name, e.target.value)}
        required={field.required}
      />
    </label>
  )
}

export default function AdminResourceEdit() {
  const { resource: resourceKey, id } = useParams()
  const navigate = useNavigate()
  const resource = ADMIN_RESOURCES.find((r) => r.key === resourceKey)
  const config = FORM_CONFIGS[resourceKey]
  const isNew = id === 'new'
  const isSingleton = resource?.singleton

  const options = useAdminOptions()
  const [form, setForm] = useState(null)
  const [existingItem, setExistingItem] = useState(null)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!resource || !config) return
    if (isNew) {
      setForm(emptyForm(config))
      setExistingItem(null)
      setLoading(false)
      return
    }

    const recordId = isSingleton ? '1' : id
    setLoading(true)
    fetch(`/api/admin/${resource.key}/${recordId}`, { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error('Not found')
        const data = await res.json()
        setExistingItem(data.item)
        setForm(itemToForm(config, data.item))
      })
      .catch(() => setError('Could not load this item.'))
      .finally(() => setLoading(false))
  }, [resource, config, id, isNew, isSingleton])

  if (!resource || !config) return <p className="admin-error">Unknown section.</p>
  if (loading || !form) return <p className="admin-muted">Loading…</p>

  const setField = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }))
    setSaved(false)
  }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const payload = formToPayload(resourceKey, form, { isNew, existingItem })
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
      setSaved(true)
      if (isNew) {
        const savedId = isSingleton ? '1' : data.item[resource.idField]
        navigate(`/admin/${resource.key}/${savedId}`, { replace: true })
      } else {
        setExistingItem(data.item)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    if (isSingleton || isNew) return
    if (!window.confirm('Delete this permanently? This cannot be undone.')) return
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

  return (
    <div>
      <div className="admin-toolbar">
        <h2 className="admin-page-title">
          {isNew ? `New ${config.title}` : `Edit ${config.title}`}
        </h2>
        <Link to={`/admin/${resource.key}`} className="admin-link">← Back to list</Link>
      </div>

      <form className="admin-form" onSubmit={save}>
        {config.sections.map((section) => (
          <section key={section.title} className="admin-section">
            <h3 className="admin-section-title">{section.title}</h3>
            {section.fields.map((field) => (
              <FieldRenderer
                key={field.name}
                field={field}
                form={form}
                setField={setField}
                options={options}
              />
            ))}
          </section>
        ))}

        {error && <p className="admin-error">{error}</p>}
        {saved && !error && <p className="admin-success">Saved successfully.</p>}

        <div className="admin-form-actions">
          <button type="submit" className="admin-btn" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
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
