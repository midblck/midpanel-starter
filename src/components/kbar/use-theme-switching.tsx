'use client'

import { useRegisterActions } from 'kbar'
import { useTheme } from 'next-themes'
import { useMemo } from 'react'

const useThemeSwitching = () => {
  const { theme, setTheme } = useTheme()

  const themeAction = useMemo(() => {
    // Return empty array if theme is not yet resolved (prevents errors during SSR/hydration)
    if (!theme) return []

    return [
      {
        id: 'toggleTheme',
        name: 'Toggle Theme',
        keywords: 'theme toggle dark light',
        section: 'Theme',
        perform: () => {
          setTheme(theme === 'light' ? 'dark' : 'light')
        },
      },
      {
        id: 'setLightTheme',
        name: 'Set Light Theme',
        keywords: 'theme light',
        section: 'Theme',
        shortcut: ['t', 'l'],
        perform: () => setTheme('light'),
      },
      {
        id: 'setDarkTheme',
        name: 'Set Dark Theme',
        keywords: 'theme dark',
        section: 'Theme',
        shortcut: ['t', 'd'],
        perform: () => setTheme('dark'),
      },
    ]
  }, [theme, setTheme])

  // Register actions - useRegisterActions safely handles empty arrays
  // The dependency array should match the actions to ensure proper updates
  useRegisterActions(themeAction, [themeAction])
}

export default useThemeSwitching
