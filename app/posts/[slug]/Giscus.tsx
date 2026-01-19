'use client';

import GiscusComponent from '@giscus/react';
import { siteConfig } from 'site.config';

const Giscus = () => {
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
      theme={siteConfig.giscus.theme}
      lang="ko"
    />
  );
};

export default Giscus;
