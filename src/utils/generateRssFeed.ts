import RSS from 'rss';

import { getNotionPosts, parsePosts } from '@/utils';
import { siteConfig } from 'site.config';

const generateRssFeed = (posts: Awaited<ReturnType<typeof getNotionPosts>>) => {
  const feedOptions = {
    title: `${siteConfig.homeTitle} | ${siteConfig.blogName}`,
    description: siteConfig.seoDefaultDesc,
    site_url: siteConfig.url,
    feed_url: `${siteConfig.url}/rss.xml`,
    pubDate: new Date(),
    copyright: `All rights reserved ${new Date().getFullYear()}, Jinsoo`,
  };

  const feed = new RSS(feedOptions);
  parsePosts(posts).forEach(({ title, description, slug, published }) => {
    feed.item({
      title,
      description,
      url: `${siteConfig.url}/posts/${slug}`,
      date: new Date(published),
    });
  });

  return feed.xml();
};

export default generateRssFeed;
