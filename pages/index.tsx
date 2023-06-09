import React from 'react';

import { GetStaticProps } from 'next';

import Intro from '@/features/home/Intro';
import List from '@/features/home/PostList';
import { Category, Post } from '@/interfaces';
import { parsePosts, getNotionPosts, getCategories } from '@/utils';

interface Props {
  posts: Post[];
  categories: Category[];
}

const Home = ({ posts, categories }: Props) => {
  return (
    <>
      <Intro />
      <List posts={posts} />
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps<Props> = async () => {
  if (!process.env.NOTION_DATABASE_ID) throw new Error('NOTION_DATABASE_ID is not defined');
  const rawPosts = await getNotionPosts(process.env.NOTION_DATABASE_ID);
  const posts = parsePosts(rawPosts);
  const categories = getCategories(rawPosts);

  return {
    props: {
      posts,
      categories,
    },
    revalidate: 300,
  };
};
