import RSS from 'rss';
import { siteConfig } from 'site.config';

import { GetPageResponse } from '@/interfaces';
import { env } from '@/lib/env';
import { createXmlErrorResponse, createXmlResponse } from '@/utils/createXmlResponse';
import { cachedFetchNotionPostsMeta } from '@/utils/fetchNotionPostsMeta';
import getPostsMeta from '@/utils/getPostsMeta';

export const revalidate = 300; // 5 minutes

const generateRssFeed = (notionPostsResponse: GetPageResponse[]) => {
  const feedOptions = {
    title: `${siteConfig.homeTitle} | ${siteConfig.blogName}`,
    description: siteConfig.seoDefaultDesc,
    site_url: siteConfig.url,
    feed_url: `${siteConfig.url}/rss.xml`,
    pubDate: new Date(),
    copyright: `All rights reserved ${new Date().getFullYear()}, ${siteConfig.author}`,
  };

  const feed = new RSS(feedOptions);
  getPostsMeta(notionPostsResponse).forEach(({ title, description, slug, published }) => {
    feed.item({
      title,
      description,
      url: `${siteConfig.url}/posts/${slug}`,
      date: new Date(published),
    });
  });

  return feed.xml({ indent: true }); // indent: true 로 가독성 향상
};

export async function GET() {
  try {
    const databaseItems = await cachedFetchNotionPostsMeta(env.notionPostDatabaseId);
    const rssXml = generateRssFeed(databaseItems);
    return createXmlResponse(rssXml);
  } catch (error) {
    return createXmlErrorResponse('Could not generate RSS feed.', error);
  }
}
