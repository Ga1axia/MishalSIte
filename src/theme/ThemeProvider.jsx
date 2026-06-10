import { createContext, useContext, useEffect, useState } from 'react'
import { PALETTES, DEFAULT_PALETTE_ID } from './palettes'

const ThemeContext = createContext(null)
const STORAGE_KEY = '25w-palette'

export function ThemeProvider({ children }) {
  const [paletteId, setPaletteId] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return PALETTES.some((p) => p.id === saved) ? saved : DEFAULT_PALETTE_ID
  })

  useEffect(() => {
    const palette = PALETTES.find((p) => p.id === paletteId) ?? PALETTES[0]
    const root = document.documentElement
    for (const [key, value] of Object.entries(palette.vars)) {
      root.style.setProperty(key, value)
    }
    root.dataset.palette = palette.id
    localStorage.setItem(STORAGE_KEY, palette.id)
  }, [paletteId])

  return (
    <ThemeContext.Provider value={{ paletteId, setPaletteId, palettes: PALETTES }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
