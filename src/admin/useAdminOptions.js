import { useEffect, useState } from 'react'

/** Load artists, exhibitions, and works for pickers & dropdowns. */
export default function useAdminOptions() {
  const [artists, setArtists] = useState([])
  const [exhibitions, setExhibitions] = useState([])
  const [works, setWorks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/artists', { credentials: 'include' }).then((r) => r.json()),
      fetch('/api/admin/exhibitions', { credentials: 'include' }).then((r) => r.json()),
      fetch('/api/admin/works', { credentials: 'include' }).then((r) => r.json()),
    ])
      .then(([a, e, w]) => {
        setArtists(a.items || [])
        setExhibitions(e.items || [])
        setWorks(w.items || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return { artists, exhibitions, works, loading }
}
