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

/**
 * 현재 다크 모드 활성화 여부를 반환합니다.
 *
 * 사용자 설정(themeAtom)과 시스템 설정(prefers-color-scheme)을 조합하여
 * 최종 다크 모드 상태를 결정합니다.
 *
 * @returns 다크 모드 활성화 여부
 */
const useDarkMode = (): boolean => {
  const theme = useAtomValue(themeAtom);
  const systemDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (theme === 'system') {
    return systemDark;
  }

  return theme === 'dark';
};

export default useDarkMode;
