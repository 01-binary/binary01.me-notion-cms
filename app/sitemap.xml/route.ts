import dayjs from 'dayjs';
import { siteConfig } from 'site.config';

import { type PostMeta } from '@/interfaces';
import { createXmlErrorResponse, createXmlResponse } from '@/utils/createXmlResponse';
import { getCachedPostsMeta } from '@/utils/fetchNotionPostsMeta';

type SitemapPostIdentifier = Pick<PostMeta, 'slug' | 'published'>;

const getSitemapPostIdentifiers = (postsMeta: PostMeta[]): SitemapPostIdentifier[] => {
  return postsMeta
    .map((post) => {
      const { slug, published } = post;
      const formattedPublished = published ? dayjs(published).format('YYYY-MM-DD') : '';
      return { slug, published: formattedPublished };
    })
    .filter(
      (postMeta): postMeta is SitemapPostIdentifier => !!postMeta?.slug && !!postMeta?.published,
    );
};

const generateSitemapXml = (postsMeta: PostMeta[]): string => {
  const postIdentifiers = getSitemapPostIdentifiers(postsMeta);

  const now = dayjs();
  const postUrls = postIdentifiers
    .map((identifier) => {
      const isRecent = now.diff(dayjs(identifier.published), 'day') <= 30;
      return `
    <url>
      <loc>${siteConfig.url}/posts/${encodeURIComponent(identifier.slug)}</loc>
      <changefreq>${isRecent ? 'weekly' : 'monthly'}</changefreq>
      <priority>0.7</priority>
      <lastmod>${identifier.published}</lastmod>
    </url>`;
    })
    .join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteConfig.url}</loc>
    <changefreq>weekly</changefreq>
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
    const postsMeta = await getCachedPostsMeta();
    const sitemapXml = generateSitemapXml(postsMeta);
    return createXmlResponse(sitemapXml);
  } catch (error) {
    return createXmlErrorResponse('Could not generate sitemap.', error);
  }
}
