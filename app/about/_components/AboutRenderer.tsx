'use client';

import { useAtomValue } from 'jotai';
import { type NotionBlock, Renderer } from 'notion-to-jsx';
import { useEffect, useState } from 'react';

import { themeAtom } from '@/atoms/theme';

interface AboutRendererProps {
  blocks: NotionBlock[];
}

const AboutRenderer = ({ blocks }: AboutRendererProps) => {
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

  return (
    <Renderer
      blocks={blocks}
      isDarkMode={isDarkMode}
    />
  );
};

export default AboutRenderer;
