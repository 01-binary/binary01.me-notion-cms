import { GetServerSideProps } from 'next';

import { generateRssFeed, getNotionPosts } from '@/utils';

const Rss = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  if (!process.env.NOTION_POST_DATABASE_ID)
    throw new Error('NOTION_POST_DATABASE_ID is not defined');
  const databaseItems = await getNotionPosts(process.env.NOTION_POST_DATABASE_ID);

  res.setHeader('Content-Type', 'text/xml');
  res.write(generateRssFeed(databaseItems));
  res.end();

  return {
    props: {},
  };
};

export default Rss;
