import { createContext, useContext, useEffect, useState } from 'react'

type AccentColor = 'green' | 'blue' | 'purple' | 'cyan' | 'orange'
type ThemeMode = 'dark' | 'light'

interface ThemeContextType {
  mode: ThemeMode
  accent: AccentColor
  toggleMode: () => void
  setAccent: (color: AccentColor) => void
}

const accentColors: Record<AccentColor, { primary: string; light: string; dark: string }> = {
  green:  { primary: '#1D9E75', light: '#5DCAA5', dark: '#0F6E56' },
  blue:   { primary: '#378ADD', light: '#85B7EB', dark: '#185FA5' },
  purple: { primary: '#7F77DD', light: '#AFA9EC', dark: '#534AB7' },
  cyan:   { primary: '#06B6D4', light: '#67E8F9', dark: '#0E7490' },
  orange: { primary: '#EF9F27', light: '#FAC775', dark: '#BA7517' },
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(
    () => (localStorage.getItem('ft-mode') as ThemeMode) || 'dark'
  )
  const [accent, setAccentState] = useState<AccentColor>(
    () => (localStorage.getItem('ft-accent') as AccentColor) || 'green'
  )

  useEffect(() => {
    const root = document.documentElement
    const colors = accentColors[accent]
    root.style.setProperty('--accent-primary', colors.primary)
    root.style.setProperty('--accent-light', colors.light)
    root.style.setProperty('--accent-dark', colors.dark)
    root.setAttribute('data-mode', mode)
    localStorage.setItem('ft-mode', mode)
    localStorage.setItem('ft-accent', accent)
  }, [mode, accent])

  const toggleMode = () => setMode(m => m === 'dark' ? 'light' : 'dark')
  const setAccent = (color: AccentColor) => {
    setAccentState(color)
    localStorage.setItem('ft-accent', color)
  }

  return (
    <ThemeContext.Provider value={{ mode, accent, toggleMode, setAccent }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

export { accentColors }
export type { AccentColor, ThemeMode }