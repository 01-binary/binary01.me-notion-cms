import RSS from 'rss';
import { siteConfig } from 'site.config';

import { type PostMeta } from '@/interfaces';
import { createXmlErrorResponse, createXmlResponse } from '@/utils/createXmlResponse';
import { getCachedPostsMeta } from '@/utils/fetchNotionPostsMeta';

const generateRssFeed = (postsMeta: PostMeta[]) => {
  const feedOptions = {
    title: `${siteConfig.homeTitle} | ${siteConfig.blogName}`,
    description: siteConfig.seoDefaultDesc,
    site_url: siteConfig.url,
    feed_url: `${siteConfig.url}/rss.xml`,
    pubDate: new Date(),
    copyright: `All rights reserved ${new Date().getFullYear()}, ${siteConfig.author}`,
  };

  const feed = new RSS(feedOptions);
  postsMeta.forEach(({ title, description, slug, published }) => {
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
    const postsMeta = await getCachedPostsMeta();
    const rssXml = generateRssFeed(postsMeta);
    return createXmlResponse(rssXml);
  } catch (error) {
    return createXmlErrorResponse('Could not generate RSS feed.', error);
  }
}
