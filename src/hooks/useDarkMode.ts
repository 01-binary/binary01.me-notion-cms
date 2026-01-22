'use client';

import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';

import { themeAtom } from '@/atoms/theme';

const useDarkMode = (): boolean => {
  const theme = useAtomValue(themeAtom);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (theme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(systemDark);

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    setIsDarkMode(theme === 'dark');
  }, [theme]);

  return isDarkMode;
};

export default useDarkMode;
