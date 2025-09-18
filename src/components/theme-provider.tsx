import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement

    // Add transition overlay for smooth theme switching
    const overlay = document.createElement('div')
    overlay.className = 'theme-transition-overlay'
    overlay.style.cssText = `
      position: fixed;
      top: 100%;
      left: 0;
      width: 100%;
      height: 100%;
      background: ${theme === 'dark' ? '#0f0f23' : '#ffffff'};
      z-index: 9999;
      transition: top 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: none;
    `
    
    document.body.appendChild(overlay)
    
    // Trigger animation
    requestAnimationFrame(() => {
      overlay.style.top = '0%'
    })

    // Apply theme change after half animation
    setTimeout(() => {
      root.classList.remove("light", "dark")

      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light"

        root.classList.add(systemTheme)
      } else {
        root.classList.add(theme)
      }
    }, 300)

    // Remove overlay after animation
    setTimeout(() => {
      overlay.style.top = '-100%'
      setTimeout(() => {
        if (document.body.contains(overlay)) {
          document.body.removeChild(overlay)
        }
      }, 600)
    }, 300)
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}