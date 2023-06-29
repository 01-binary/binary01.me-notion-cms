import { GetStaticProps } from 'next';

import Home from '@/features/home';
import { HomeProps } from '@/interfaces';
import { parsePosts, getNotionPosts, getCategories } from '@/utils';

const HomePage = ({ posts, categories }: HomeProps) => {
  return (
    <Home
      posts={posts}
      categories={categories}
    />
  );
};

export default HomePage;

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  if (!process.env.NOTION_POST_DATABASE_ID)
    throw new Error('NOTION_POST_DATABASE_ID is not defined');

  const rawPosts = await getNotionPosts(process.env.NOTION_POST_DATABASE_ID);
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
