/** Whether the public site should show the coming-soon page. */
export function isComingSoonActive(gallery) {
  if (!gallery?.comingSoonEnabled) return false
  if (!gallery.launchDate) return true
  const today = new Date().toISOString().slice(0, 10)
  return today < gallery.launchDate
}

export function launchDateLabel(iso) {
  if (!iso) return null
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export function countdownParts(launchDate) {
  if (!launchDate) return null
  const target = new Date(launchDate + 'T09:00:00-07:00').getTime()
  const diff = Math.max(0, target - Date.now())
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)
  return { days, hours, minutes, seconds, complete: diff === 0 }
}
