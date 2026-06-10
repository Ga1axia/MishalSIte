import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAdminAuth } from './AdminAuthContext'
import './admin.css'

export default function AdminLogin() {
  const { user, checking, login } = useAdminAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (checking) {
    return (
      <div className="admin-shell admin-login-shell">
        <p className="admin-muted">Checking session…</p>
      </div>
    )
  }

  if (user) return <Navigate to="/admin/dashboard" replace />

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(username, password)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-shell admin-login-shell">
      <form className="admin-login-card" onSubmit={submit}>
        <p className="admin-kicker">25 West Gallery</p>
        <h1 className="admin-title">Admin login</h1>
        <label className="admin-field">
          Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required />
        </label>
        <label className="admin-field">
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </label>
        {error && <p className="admin-error">{error}</p>}
        <button type="submit" className="admin-btn" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
