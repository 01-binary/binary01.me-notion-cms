import { GetServerSideProps } from 'next';
import RSS from 'rss';

import { GetPageResponse } from '@/interfaces';
import { fetchNotionPostsMeta, getPostsMeta } from '@/utils';
import { siteConfig } from 'site.config';

const Rss = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  if (!process.env.NOTION_POST_DATABASE_ID)
    throw new Error('NOTION_POST_DATABASE_ID is not defined');
  const databaseItems = await fetchNotionPostsMeta(process.env.NOTION_POST_DATABASE_ID);

  res.setHeader('Content-Type', 'text/xml');
  res.write(generateRssFeed(databaseItems));
  res.end();

  return {
    props: {},
  };
};

export default Rss;

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
  getPostsMeta(notionPostsResponse).forEach(({ title, description, slug, published }) => {
    feed.item({
      title,
      description,
      url: `${siteConfig.url}/posts/${slug}`,
      date: new Date(published),
    });
  });

  return feed.xml();
};
