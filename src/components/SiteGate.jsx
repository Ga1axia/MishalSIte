import { Outlet, useSearchParams } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import { useAdminAuth } from '../admin/AdminAuthContext'
import { isComingSoonActive } from '../lib/site'
import ComingSoon from '../pages/ComingSoon'
import ContentLoading from './ContentLoading'

export default function SiteGate() {
  const { gallery, loading, error, source } = useContent()
  const { user, checking } = useAdminAuth()
  const [params] = useSearchParams()
  const preview = params.get('preview') === '1'

  if (loading || checking) {
    return <ContentLoading />
  }

  const showComingSoon =
    gallery &&
    isComingSoonActive(gallery) &&
    !(preview && user)

  if (showComingSoon) {
    return <ComingSoon />
  }

  if (error && source === 'error') {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <p className="headline">Content unavailable</p>
        <p className="muted" style={{ marginTop: '1rem' }}>{error}</p>
      </div>
    )
  }

  return <Outlet />
}
