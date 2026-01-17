import dayjs from 'dayjs';
import { NextResponse } from 'next/server';
import { GetPageResponse } from 'notion-to-utils';

import { PostMeta } from '@/interfaces';
import { cachedFetchNotionPostsMeta, getPostsMeta } from '@/utils';
import { siteConfig } from 'site.config';

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
      <loc>${siteConfig.url}/posts/${identifier.slug}</loc>
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
  if (!process.env.NOTION_POST_DATABASE_ID) {
    console.error('NOTION_POST_DATABASE_ID is not defined for sitemap generation.');
    return new NextResponse('Internal Server Error: Configuration missing.', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  try {
    const databaseItems = await cachedFetchNotionPostsMeta(process.env.NOTION_POST_DATABASE_ID);
    const sitemapXml = generateSitemapXml(databaseItems);

    return new NextResponse(sitemapXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Internal Server Error: Could not generate sitemap.', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}
