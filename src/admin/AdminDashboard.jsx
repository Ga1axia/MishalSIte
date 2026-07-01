import { Link } from 'react-router-dom'
import { ADMIN_RESOURCES } from './formConfigs'

export default function AdminDashboard() {
  return (
    <div>
      <h2 className="admin-page-title">Dashboard</h2>
      <p className="admin-muted" style={{ marginBottom: '1.5rem' }}>
        Manage exhibitions, events, artists, works, opportunities, and gallery settings.
      </p>
      <div className="admin-grid">
        <Link to="/admin/signups" className="admin-card">
          <span className="admin-card-title">Mailing list</span>
          <span className="admin-card-arrow">→</span>
        </Link>
        {ADMIN_RESOURCES.map((r) => (
          <Link key={r.key} to={`/admin/${r.key}`} className="admin-card">
            <span className="admin-card-title">{r.label}</span>
            <span className="admin-card-arrow">→</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
