import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'cc_tc_theme_preference';

export const getStoredTheme = (): Theme => {
  if (typeof window === 'undefined') return 'system';
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark' || saved === 'system') {
    return saved;
  }
  return 'system';
};

export const applyThemeToDocument = (theme: Theme): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';

  const root = document.documentElement;
  let resolved: 'light' | 'dark' = 'light';

  if (theme === 'system') {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    resolved = systemPrefersDark ? 'dark' : 'light';
  } else {
    resolved = theme;
  }

  if (resolved === 'dark') {
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  }

  return resolved;
};

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
    const resolved = applyThemeToDocument(newTheme);
    setResolvedTheme(resolved);
  };

  useEffect(() => {
    const resolved = applyThemeToDocument(theme);
    setResolvedTheme(resolved);

    // If theme is system, listen for OS theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      if (getStoredTheme() === 'system') {
        const updatedResolved = applyThemeToDocument('system');
        setResolvedTheme(updatedResolved);
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [theme]);

  return { theme, setTheme, resolvedTheme };
}
