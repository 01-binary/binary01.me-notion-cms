import RSS from 'rss';

import { GetPageResponse } from '@/interfaces';
import { parsePosts } from '@/utils';
import { siteConfig } from 'site.config';

const generateRssFeed = (notionPostsResponse: GetPageResponse[]) => {
  const feedOptions = {
    title: `${siteConfig.homeTitle} | ${siteConfig.blogName}`,
    description: siteConfig.seoDefaultDesc,
    site_url: siteConfig.url,
    feed_url: `${siteConfig.url}/rss.xml`,
    pubDate: new Date(),
    copyright: `All rights reserved ${new Date().getFullYear()}, Jinsoo`,
  };

  const feed = new RSS(feedOptions);
  parsePosts(notionPostsResponse).forEach(({ title, description, slug, published }) => {
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
