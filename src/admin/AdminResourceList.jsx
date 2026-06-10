import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ADMIN_RESOURCES } from './formConfigs'

function itemLabel(resource, item) {
  if (resource.key === 'works') return item.title
  if (resource.key === 'gallery') return item.name
  return item.title || item.name
}

function itemId(resource, item) {
  if (resource.singleton) return '1'
  return item[resource.idField]
}

export default function AdminResourceList() {
  const { resource: resourceKey } = useParams()
  const resource = ADMIN_RESOURCES.find((r) => r.key === resourceKey)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!resource) return
    setLoading(true)
    fetch(`/api/admin/${resource.key}`, { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to load')
        const data = await res.json()
        setItems(data.items || [])
      })
      .catch(() => setError('Could not load items. Is the API running?'))
      .finally(() => setLoading(false))
  }, [resource])

  if (!resource) return <p className="admin-error">Unknown section.</p>

  return (
    <div>
      <div className="admin-toolbar">
        <h2 className="admin-page-title">{resource.label}</h2>
        {!resource.singleton && (
          <Link to={`/admin/${resource.key}/new`} className="admin-btn">
            Add new
          </Link>
        )}
      </div>

      {loading && <p className="admin-muted">Loading…</p>}
      {error && <p className="admin-error">{error}</p>}

      {!loading && !error && (
        <div className="admin-table">
          {items.map((item) => (
            <Link
              key={itemId(resource, item)}
              to={`/admin/${resource.key}/${itemId(resource, item)}`}
              className="admin-table-row"
            >
              <span>{itemLabel(resource, item)}</span>
              <span className="admin-table-meta">{itemId(resource, item)}</span>
              <span>→</span>
            </Link>
          ))}
          {items.length === 0 && <p className="admin-muted">No items yet.</p>}
        </div>
      )}
    </div>
  )
}
