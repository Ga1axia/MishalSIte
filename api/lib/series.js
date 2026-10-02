/** Generate YYYY-MM-DD dates every 7 days from start through end (inclusive). */
export function weeklyDates(startIso, endIso) {
  if (!startIso || !endIso) return []
  const start = new Date(startIso + 'T12:00:00')
  const end = new Date(endIso + 'T12:00:00')
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return []

  const dates = []
  const cursor = new Date(start)
  while (cursor <= end) {
    dates.push(cursor.toISOString().slice(0, 10))
    cursor.setDate(cursor.getDate() + 7)
  }
  return dates
}

export function seriesSlug(baseSlug, dateIso) {
  return `${baseSlug}-${dateIso}`
}

export function newSeriesId() {
  return `series-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}
