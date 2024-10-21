import { GetPageResponse } from 'notion-to-utils';

import getSlugsAndDates from '@/utils/getSlugsAndDates';

const generateSitemap = (notionPostsResponse: GetPageResponse[]) => {
  const paths = getSlugsAndDates(notionPostsResponse);

  const urlSet = paths
    .map((path) => {
      return `
    <url>
      <loc>${process.env.BLOG_URL}/posts/${path.slug}</loc>
      <changefreq>daily</changefreq>
      <priority>1</priority>
      <lastmod>${path.published}</lastmod>
    </url>
  `;
    })
    .join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
        <url>
            <loc>${process.env.BLOG_URL}</loc>
            <changefreq>daily</changefreq>
            <priority>1</priority>
            <lastmod>${new Date().toISOString()}</lastmod>
        </url>
        <url>
            <loc>${process.env.BLOG_URL}/about</loc>
            <changefreq>daily</changefreq>
            <priority>1</priority>
            <lastmod>${new Date().toISOString()}</lastmod>
        </url>
        ${urlSet}
    </urlset>
  `;

  return sitemap;
};

export default generateSitemap;
