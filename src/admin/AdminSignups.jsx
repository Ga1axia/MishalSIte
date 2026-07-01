import { useEffect, useState } from 'react'

function formatSignupDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function AdminSignups() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/signups', { credentials: 'include' })
      .then((r) => {
        if (!r.ok) throw new Error('Could not load signups')
        return r.json()
      })
      .then((data) => setItems(data.items || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const exportCsv = () => {
    const rows = [['email', 'signed_up_at'], ...items.map((i) => [i.email, i.createdAt])]
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `25-west-mailing-list-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="admin-list-head">
        <h2 className="admin-page-title">Mailing list</h2>
        {items.length > 0 && (
          <button type="button" className="admin-btn admin-btn-ghost" onClick={exportCsv}>
            Export CSV
          </button>
        )}
      </div>
      <p className="admin-muted" style={{ marginBottom: '1.5rem' }}>
        Emails collected from the coming soon page signup form.
      </p>
      {loading && <p className="admin-muted">Loading…</p>}
      {error && <p className="admin-error">{error}</p>}
      {!loading && !error && items.length === 0 && (
        <p className="admin-muted">No signups yet.</p>
      )}
      {!loading && items.length > 0 && (
        <div className="admin-table">
          <table className="admin-signups-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Signed up</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.email}>
                  <td>{item.email}</td>
                  <td className="admin-table-meta">{formatSignupDate(item.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
