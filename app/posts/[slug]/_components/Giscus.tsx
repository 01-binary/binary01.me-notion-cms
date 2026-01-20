'use client';

import GiscusComponent from '@giscus/react';
import { useAtomValue } from 'jotai';
import { siteConfig } from 'site.config';

import { themeAtom } from '@/atoms/theme';

const getGiscusTheme = (theme: string) => {
  if (theme === 'system') return 'preferred_color_scheme';
  return theme; // 'light' | 'dark'
};

const Giscus = () => {
  const theme = useAtomValue(themeAtom);

  return (
    <GiscusComponent
      repo={siteConfig.giscus.repo as `${string}/${string}`}
      repoId={siteConfig.giscus.repoId}
      category={siteConfig.giscus.category}
      categoryId={siteConfig.giscus.categoryId}
      mapping="pathname"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme={getGiscusTheme(theme)}
      lang="ko"
    />
  );
};

export default Giscus;
