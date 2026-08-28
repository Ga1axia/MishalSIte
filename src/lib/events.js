/** Today as YYYY-MM-DD in the viewer's timezone, so an event stays listed all day. */
function todayIso() {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60000
  return new Date(now.getTime() - offset).toISOString().slice(0, 10)
}

/** Events happening today or later, soonest first. */
export function upcomingEvents(events = []) {
  const today = todayIso()
  return events
    .filter((e) => e?.date && e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
}

/** Events that have already happened, most recent first. */
export function pastEvents(events = []) {
  const today = todayIso()
  return events
    .filter((e) => e?.date && e.date < today)
    .sort((a, b) => b.date.localeCompare(a.date))
}
