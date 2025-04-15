import dayjs from 'dayjs';
import { GetServerSideProps } from 'next';
import { GetPageResponse } from 'notion-to-utils';

import { PostMeta } from '@/interfaces';
import { getPostsMeta, fetchNotionPostsMeta } from '@/utils';

type PostIdentifier = Pick<PostMeta, 'slug' | 'published'>;

const Sitemap = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  if (!process.env.NOTION_POST_DATABASE_ID)
    throw new Error('NOTION_POST_DATABASE_ID is not defined');
  const databaseItems = await fetchNotionPostsMeta(process.env.NOTION_POST_DATABASE_ID);
  res.setHeader('Content-Type', 'text/xml');
  res.write(generateSitemap(databaseItems));
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;

const generateSitemap = (notionPostsResponse: GetPageResponse[]) => {
  const paths: PostIdentifier[] = getSitemapPostIdentifiers(notionPostsResponse);

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

const getSitemapPostIdentifiers = (notionPostsResponse: GetPageResponse[]) => {
  const posts = getPostsMeta(notionPostsResponse);
  const postsMeta = posts
    .map((post) => {
      const { slug, published } = post;
      const formattedPublished = published ? dayjs(published).format('YYYY-MM-DD') : '';
      return { slug, published: formattedPublished };
    })
    .filter((postMeta: PostIdentifier | null): postMeta is PostIdentifier =>
      postMeta ? 'slug' in postMeta : false,
    );

  return postsMeta;
};
