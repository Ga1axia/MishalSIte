export function formatDate(iso) {
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export function formatDateShort(iso) {
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function formatRange(start, end) {
  const s = new Date(start + 'T12:00:00')
  const e = new Date(end + 'T12:00:00')
  const sStr = s.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
  const eStr = e.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  return `${sStr} – ${eStr}`
}

export function phoneTel(phone) {
  if (!phone) return ''
  const digits = String(phone).replace(/\D/g, '')
  if (!digits) return ''
  return digits.length === 10 ? `tel:+1${digits}` : `tel:+${digits}`
}
