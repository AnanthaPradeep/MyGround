import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { getThemeCookie, setThemeCookie } from '../utils/cookies'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Priority: Cookie > localStorage > HTML class > default
    if (typeof window !== 'undefined') {
      // 1. Check cookie first (primary storage)
      const cookieTheme = getThemeCookie()
      if (cookieTheme && (cookieTheme === 'light' || cookieTheme === 'dark')) {
        return cookieTheme
      }
      
      // 2. Fallback to localStorage (backward compatibility)
      const savedTheme = localStorage.getItem('theme') as Theme
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        // Migrate to cookie
        setThemeCookie(savedTheme)
        return savedTheme
      }
      
      // 3. Check HTML class (from index.html script)
      const root = window.document.documentElement
      const currentClass = root.classList.contains('dark') ? 'dark' : 'light'
      if (currentClass === 'dark' || currentClass === 'light') {
        // Save to cookie for future
        setThemeCookie(currentClass)
        return currentClass
      }
    }
    return 'light'
  })

  // Apply theme when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement
      // Remove both classes first
      root.classList.remove('light', 'dark')
      // Add the current theme class
      root.classList.add(theme)
      
      // Save to both cookie (primary) and localStorage (backup for compatibility)
      setThemeCookie(theme)
      localStorage.setItem('theme', theme)
    }
  }, [theme])

  const toggleTheme = () => {
    setThemeState((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light'
      return newTheme
    })
  }

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

