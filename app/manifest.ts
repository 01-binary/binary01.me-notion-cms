import type { MetadataRoute } from 'next';
import { siteConfig } from 'site.config';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.blogName,
    short_name: siteConfig.blogName,
    description: siteConfig.seoDefaultDesc,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/android-icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
