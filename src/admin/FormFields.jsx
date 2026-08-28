import ImageUpload from './ImageUpload'

export default function StringListField({ label, hint, value = [], onChange }) {
  const items = value.length ? value : ['']

  const update = (i, text) => {
    const next = [...items]
    next[i] = text
    onChange(next)
  }

  const add = () => onChange([...items, ''])
  const remove = (i) => onChange(items.filter((_, j) => j !== i))

  return (
    <fieldset className="admin-fieldset">
      <legend>{label}</legend>
      {hint && <p className="admin-hint">{hint}</p>}
      <div className="admin-repeater">
        {items.map((item, i) => (
          <div key={i} className="admin-repeater-row">
            <input
              type="text"
              value={item}
              onChange={(e) => update(i, e.target.value)}
              placeholder={`Item ${i + 1}`}
            />
            {items.length > 1 && (
              <button type="button" className="admin-btn-sm admin-btn-ghost" onClick={() => remove(i)}>
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
      <button type="button" className="admin-btn-sm" onClick={add}>
        + Add item
      </button>
    </fieldset>
  )
}

export function LinkListField({ label, value = [], onChange }) {
  const items = value.length ? value : [{ label: '', href: '' }]

  const update = (i, key, text) => {
    const next = items.map((item, j) => (j === i ? { ...item, [key]: text } : item))
    onChange(next)
  }

  const add = () => onChange([...items, { label: '', href: '' }])
  const remove = (i) => onChange(items.filter((_, j) => j !== i))

  return (
    <fieldset className="admin-fieldset">
      <legend>{label}</legend>
      <div className="admin-repeater">
        {items.map((item, i) => (
          <div key={i} className="admin-repeater-block">
            <input
              type="text"
              value={item.label}
              onChange={(e) => update(i, 'label', e.target.value)}
              placeholder="Label (e.g. Instagram)"
            />
            <input
              type="url"
              value={item.href}
              onChange={(e) => update(i, 'href', e.target.value)}
              placeholder="https://…"
            />
            {items.length > 1 && (
              <button type="button" className="admin-btn-sm admin-btn-ghost" onClick={() => remove(i)}>
                Remove link
              </button>
            )}
          </div>
        ))}
      </div>
      <button type="button" className="admin-btn-sm" onClick={add}>
        + Add link
      </button>
    </fieldset>
  )
}

export function TeamListField({ label, value = [], onChange }) {
  const items = value.length ? value : [{ name: '', role: '', bio: '' }]

  const update = (i, key, text) => {
    const next = items.map((item, j) => (j === i ? { ...item, [key]: text } : item))
    onChange(next)
  }

  const add = () => onChange([...items, { name: '', role: '', bio: '' }])
  const remove = (i) => onChange(items.filter((_, j) => j !== i))

  return (
    <fieldset className="admin-fieldset">
      <legend>{label}</legend>
      <div className="admin-repeater">
        {items.map((item, i) => (
          <div key={i} className="admin-repeater-block">
            <input
              type="text"
              value={item.name}
              onChange={(e) => update(i, 'name', e.target.value)}
              placeholder="Name"
            />
            <input
              type="text"
              value={item.role}
              onChange={(e) => update(i, 'role', e.target.value)}
              placeholder="Role (e.g. Director)"
            />
            <textarea
              rows={3}
              value={item.bio || ''}
              onChange={(e) => update(i, 'bio', e.target.value)}
              placeholder="Short bio (optional)"
            />
            {items.length > 1 && (
              <button type="button" className="admin-btn-sm admin-btn-ghost" onClick={() => remove(i)}>
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
      <button type="button" className="admin-btn-sm" onClick={add}>
        + Add team member
      </button>
    </fieldset>
  )
}

export function CheckboxPickField({ label, hint, options, value = [], onChange }) {
  const toggle = (id) => {
    if (value.includes(id)) onChange(value.filter((v) => v !== id))
    else onChange([...value, id])
  }

  if (!options.length) {
    return (
      <fieldset className="admin-fieldset">
        <legend>{label}</legend>
        <p className="admin-hint">Nothing to pick yet — add some items in the other sections first.</p>
      </fieldset>
    )
  }

  return (
    <fieldset className="admin-fieldset">
      <legend>{label}</legend>
      {hint && <p className="admin-hint">{hint}</p>}
      <div className="admin-checklist">
        {options.map((opt) => (
          <label key={opt.id} className="admin-check">
            <input
              type="checkbox"
              checked={value.includes(opt.id)}
              onChange={() => toggle(opt.id)}
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function ArtistSelectField({ label, required, artists, value, onChange }) {
  return (
    <label className="admin-field">
      {label}
      <select value={value || ''} onChange={(e) => onChange(e.target.value)} required={required}>
        <option value="">Choose an artist…</option>
        {artists.map((a) => (
          <option key={a.slug} value={a.slug}>
            {a.name}
          </option>
        ))}
      </select>
    </label>
  )
}

export function RelatedField({ label, artists, exhibitions, value, onChange }) {
  const v = value || { exhibition: '', artist: '' }
  const set = (key, val) => onChange({ ...v, [key]: val })

  return (
    <fieldset className="admin-fieldset">
      <legend>{label}</legend>
      <p className="admin-hint">Optional — connect this event to a show or artist page.</p>
      <label className="admin-field">
        Related exhibition
        <select value={v.exhibition} onChange={(e) => set('exhibition', e.target.value)}>
          <option value="">None</option>
          {exhibitions.map((ex) => (
            <option key={ex.slug} value={ex.slug}>
              {ex.title}
            </option>
          ))}
        </select>
      </label>
      <label className="admin-field">
        Related artist
        <select value={v.artist} onChange={(e) => set('artist', e.target.value)}>
          <option value="">None</option>
          {artists.map((a) => (
            <option key={a.slug} value={a.slug}>
              {a.name}
            </option>
          ))}
        </select>
      </label>
    </fieldset>
  )
}

export function InstallPhotosField({ label, value = [], onChange }) {
  const photos = value.length ? value : []

  const updateUrl = (i, url) => {
    const next = photos.map((p, j) => (j === i ? { ...p, imageUrl: url } : p))
    onChange(next)
  }

  const add = () => onChange([...photos, { seed: '', imageUrl: null }])
  const remove = (i) => onChange(photos.filter((_, j) => j !== i))

  return (
    <fieldset className="admin-fieldset">
      <legend>{label}</legend>
      <p className="admin-hint">Photos from the gallery install. Upload as many as you like.</p>
      <div className="admin-repeater">
        {photos.map((photo, i) => (
          <div key={i} className="admin-repeater-block admin-install-row">
            <ImageUpload
              label={`Installation photo ${i + 1}`}
              value={photo.imageUrl}
              onChange={(url) => updateUrl(i, url)}
            />
            <button type="button" className="admin-btn-sm admin-btn-ghost" onClick={() => remove(i)}>
              Remove photo
            </button>
          </div>
        ))}
      </div>
      <button type="button" className="admin-btn-sm" onClick={add}>
        + Add installation photo
      </button>
    </fieldset>
  )
}
