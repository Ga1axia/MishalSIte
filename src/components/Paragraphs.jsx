import { splitParagraphs } from '../lib/text'

/** Renders multi-paragraph text from admin textareas (line breaks / blank lines). */
export default function Paragraphs({ text, className = '' }) {
  const parts = splitParagraphs(text)
  if (parts.length === 0) return null

  return (
    <div className={`prose-blocks ${className}`.trim()}>
      {parts.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  )
}
