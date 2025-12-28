import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check localStorage first
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        // Theme should already be applied by the script in index.html
        // Verify it's correct
        const root = window.document.documentElement
        const currentClass = root.classList.contains('dark') ? 'dark' : 'light'
        if (currentClass !== savedTheme) {
          root.classList.remove('light', 'dark')
          root.classList.add(savedTheme)
        }
        return savedTheme
      }
      // If no saved theme, check what's currently on the HTML element (from script)
      const root = window.document.documentElement
      const currentTheme = root.classList.contains('dark') ? 'dark' : 'light'
      return currentTheme
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
      // Save to localStorage
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

