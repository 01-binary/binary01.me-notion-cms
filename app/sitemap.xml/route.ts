import dayjs from 'dayjs';
import { type GetPageResponse } from 'notion-to-utils';
import { siteConfig } from 'site.config';

import { PostMeta } from '@/interfaces';
import { env } from '@/lib/env';
import { createXmlErrorResponse, createXmlResponse } from '@/utils/createXmlResponse';
import { fetchNotionPostsMeta } from '@/utils/fetchNotionPostsMeta';
import getPostsMeta from '@/utils/getPostsMeta';

export const revalidate = 600; // 10 minutes

type SitemapPostIdentifier = Pick<PostMeta, 'slug' | 'published'>;

const getSitemapPostIdentifiers = (
  notionPostsResponse: GetPageResponse[],
): SitemapPostIdentifier[] => {
  const posts = getPostsMeta(notionPostsResponse);
  return posts
    .map((post) => {
      const { slug, published } = post;
      const formattedPublished = published ? dayjs(published).format('YYYY-MM-DD') : '';
      return { slug, published: formattedPublished };
    })
    .filter(
      (postMeta): postMeta is SitemapPostIdentifier => !!postMeta?.slug && !!postMeta?.published,
    );
};

const generateSitemapXml = (notionPostsResponse: GetPageResponse[]): string => {
  const postIdentifiers = getSitemapPostIdentifiers(notionPostsResponse);

  const postUrls = postIdentifiers
    .map((identifier) => {
      return `
    <url>
      <loc>${siteConfig.url}/posts/${encodeURIComponent(identifier.slug)}</loc>
      <changefreq>daily</changefreq>
      <priority>0.7</priority>
      <lastmod>${identifier.published}</lastmod>
    </url>`;
    })
    .join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteConfig.url}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <lastmod>${dayjs().format('YYYY-MM-DD')}</lastmod>
  </url>
  <url>
    <loc>${siteConfig.url}/about</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>${dayjs().format('YYYY-MM-DD')}</lastmod>
  </url>
  ${postUrls}
</urlset>`;

  return sitemap;
};

export async function GET() {
  try {
    const databaseItems = await fetchNotionPostsMeta(env.notionPostDatabaseId);
    const sitemapXml = generateSitemapXml(databaseItems);
    return createXmlResponse(sitemapXml);
  } catch (error) {
    return createXmlErrorResponse('Could not generate sitemap.', error);
  }
}
