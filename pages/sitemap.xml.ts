import { GetServerSideProps } from 'next';

import { getNotionPosts, getSlugs } from '@/utils';

const Sitemap = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  if (!process.env.NOTION_POST_DATABASE_ID)
    throw new Error('NOTION_POST_DATABASE_ID is not defined');
  const databaseItems = await getNotionPosts(process.env.NOTION_POST_DATABASE_ID);
  const slugs = getSlugs(databaseItems);

  const paths = slugs.map((slug) => slug);

  const urlSet = paths
    .map((path) => {
      return `
    <url>
      <loc>${process.env.BLOG_URL}/posts/${path}</loc>
      <changefreq>daily</changefreq>
      <priority>1</priority>
      <lastmod>${new Date().toISOString()}</lastmod>
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

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;
