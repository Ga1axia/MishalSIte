import { Navigate, Outlet, Link } from 'react-router-dom'
import { useAdminAuth } from './AdminAuthContext'
import { ADMIN_RESOURCES } from './formConfigs'
import './admin.css'

export default function AdminLayout() {
  const { user, checking, logout } = useAdminAuth()

  if (checking) {
    return (
      <div className="admin-shell">
        <p className="admin-muted">Checking session…</p>
      </div>
    )
  }

  if (!user) return <Navigate to="/admin" replace />

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="admin-kicker">25 West Gallery</p>
          <h1 className="admin-title">Admin</h1>
        </div>
        <div className="admin-header-actions">
          <Link to="/" className="admin-link">View site</Link>
          <button type="button" onClick={logout} className="admin-btn admin-btn-ghost">
            Log out
          </button>
        </div>
      </header>

      <nav className="admin-nav">
        <Link to="/admin/dashboard" className="admin-nav-link">Dashboard</Link>
        {ADMIN_RESOURCES.map((r) => (
          <Link key={r.key} to={`/admin/${r.key}`} className="admin-nav-link">
            {r.label}
          </Link>
        ))}
      </nav>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
