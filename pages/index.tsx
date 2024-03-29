import { GetStaticProps } from 'next';

import Home from '@/features/home';
import { HomeProps } from '@/interfaces';
import { parsePosts, getNotionPosts, getCategories } from '@/utils';
import { getPreviewImages } from '@/utils';
import { siteConfig } from 'site.config';

import PageHead from '@/components/common/PageHead';

import { REVALIDATE_TIME } from '@/assets/constants';

const HomePage = ({ posts, categories }: HomeProps) => {
  return (
    <>
      <PageHead title={siteConfig.homeTitle} />
      <Home
        posts={posts}
        categories={categories}
      />
    </>
  );
};

export default HomePage;

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  if (!process.env.NOTION_POST_DATABASE_ID)
    throw new Error('NOTION_POST_DATABASE_ID is not defined');

  const notionPostsResponse = await getNotionPosts(process.env.NOTION_POST_DATABASE_ID);
  const posts = parsePosts(notionPostsResponse);
  const categories = getCategories(notionPostsResponse);
  const postsWithPreview = await getPreviewImages(posts);

  return {
    props: {
      posts: postsWithPreview,
      categories,
    },
    revalidate: REVALIDATE_TIME,
  };
};
