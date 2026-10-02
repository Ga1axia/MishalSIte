/** Split text on blank lines (or single newlines) into non-empty paragraphs. */
export function splitParagraphs(text) {
  if (!text) return []
  const normalized = String(text).replace(/\r\n/g, '\n').trim()
  if (!normalized) return []
  const byBlank = normalized.split(/\n\s*\n/)
  if (byBlank.length > 1) {
    return byBlank.map((p) => p.replace(/\n/g, ' ').trim()).filter(Boolean)
  }
  return normalized.split('\n').map((p) => p.trim()).filter(Boolean)
}
