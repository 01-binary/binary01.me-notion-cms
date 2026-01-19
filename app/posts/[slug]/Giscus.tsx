'use client';

import { useEffect, useRef } from 'react';
import { siteConfig } from 'site.config';

const Giscus = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return;

    const scriptElem = document.createElement('script');
    scriptElem.src = 'https://giscus.app/client.js';
    scriptElem.async = true;
    scriptElem.crossOrigin = 'anonymous';
    scriptElem.setAttribute('data-repo', siteConfig.giscus.repo);
    scriptElem.setAttribute('data-repo-id', siteConfig.giscus.repoId);
    scriptElem.setAttribute('data-category', siteConfig.giscus.category);
    scriptElem.setAttribute('data-category-id', siteConfig.giscus.categoryId);
    scriptElem.setAttribute('data-mapping', 'pathname');
    scriptElem.setAttribute('data-strict', '0');
    scriptElem.setAttribute('data-reactions-enabled', '1');
    scriptElem.setAttribute('data-emit-metadata', '0');
    scriptElem.setAttribute('data-input-position', 'bottom');
    scriptElem.setAttribute('data-theme', siteConfig.giscus.theme);
    scriptElem.setAttribute('data-lang', 'ko');
    ref.current.appendChild(scriptElem);
  }, []);

  return <section ref={ref} />;
};

export default Giscus;
