'use client';

import { useAtomValue } from 'jotai';
import { useSyncExternalStore } from 'react';

import { themeAtom } from '@/atoms/theme';

const DARK_MODE_QUERY = '(prefers-color-scheme: dark)';

const subscribe = (callback: () => void) => {
  const mediaQuery = window.matchMedia(DARK_MODE_QUERY);
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
};

const getSnapshot = () => window.matchMedia(DARK_MODE_QUERY).matches;

const getServerSnapshot = () => false;

const useDarkMode = (): boolean => {
  const theme = useAtomValue(themeAtom);
  const systemDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (theme === 'system') {
    return systemDark;
  }

  return theme === 'dark';
};

export default useDarkMode;
