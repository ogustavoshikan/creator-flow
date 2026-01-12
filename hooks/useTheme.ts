import { useState, useEffect, useCallback } from 'react';

type Theme = 'dark' | 'light';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      return savedTheme;
    }
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;

    // Disable transitions to ensure clean switch
    root.classList.add('disable-transitions');

    // Remove both explicitly to ensure clean slate
    root.classList.remove('light', 'dark');

    // Add current theme
    root.classList.add(theme);

    // Save to localStorage
    localStorage.setItem('theme', theme);

    // Re-enable transitions immediately after paint
    const timer = setTimeout(() => {
      root.classList.remove('disable-transitions');
    }, 0);

    return () => clearTimeout(timer);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  return { theme, toggleTheme };
}
