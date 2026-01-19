'use client';

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { Theme } from '@/payload-types';

const COOKIE_NAME = 'active_theme';
const DEFAULT_THEME = 'default';

function setThemeCookie(theme: string) {
  if (typeof window === 'undefined') return;

  document.cookie = `${COOKIE_NAME}=${theme}; path=/; max-age=31536000; SameSite=Lax; ${window.location.protocol === 'https:' ? 'Secure;' : ''}`;
}

type ThemeContextType = {
  activeTheme: string;
  setActiveTheme: (theme: string) => void;
  themes: Theme[];
  isLoading: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ActiveThemeProvider({
  children,
  initialTheme,
  themes: initialThemes = [],
}: {
  children: ReactNode;
  initialTheme?: string;
  themes?: Theme[];
}) {
  const [activeTheme, setActiveTheme] = useState<string>(
    () => initialTheme || DEFAULT_THEME
  );
  const [themes] = useState<Theme[]>(initialThemes);
  const [isLoading] = useState(false);

  // Apply theme CSS when activeTheme changes
  useEffect(() => {
    setThemeCookie(activeTheme);

    // Remove existing theme classes
    Array.from(document.body.classList)
      .filter(className => className.startsWith('theme-'))
      .forEach(className => {
        document.body.classList.remove(className);
      });

    // Find the active theme
    const theme = themes.find(
      t => t.name.toLowerCase().replace(/\s+/g, '-') === activeTheme
    );

    if (theme) {
      // Add theme class
      document.body.classList.add(`theme-${activeTheme}`);

      // Inject custom CSS
      const existingStyle = document.getElementById('dynamic-theme-css');
      if (existingStyle) {
        existingStyle.remove();
      }

      const style = document.createElement('style');
      style.id = 'dynamic-theme-css';
      style.textContent = theme.codeCSS;
      document.head.appendChild(style);
    } else if (themes.length === 0) {
      // If no themes are available, remove any existing dynamic theme CSS
      const existingStyle = document.getElementById('dynamic-theme-css');
      if (existingStyle) {
        existingStyle.remove();
      }
    }
  }, [activeTheme, themes]);

  return (
    <ThemeContext.Provider
      value={{ activeTheme, setActiveTheme, themes, isLoading }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeConfig() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error(
      'useThemeConfig must be used within an ActiveThemeProvider'
    );
  }
  return context;
}
