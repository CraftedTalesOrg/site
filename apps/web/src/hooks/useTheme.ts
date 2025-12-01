import { createContext, useCallback, useContext, useState } from 'react';
import type { ThemeName } from '@craftedtales/ui';

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}

export function useThemeState(initialTheme: ThemeName = 'dark'): ThemeContextValue {
  const [theme, setThemeState] = useState<ThemeName>(initialTheme);

  const setTheme = useCallback((newTheme: ThemeName) => {
    setThemeState(newTheme);
  }, []);

  return { theme, setTheme };
}
