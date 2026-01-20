'use client';

import { useAtom } from 'jotai';
import { useEffect } from 'react';

import { type Theme,themeAtom } from '@/atoms/theme';

const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (theme === 'system') {
    root.classList.toggle('dark', systemDark);
  } else {
    root.classList.toggle('dark', theme === 'dark');
  }
};

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme] = useAtom(themeAtom);

  useEffect(() => {
    applyTheme(theme);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  return <>{children}</>;
};

export default ThemeProvider;
