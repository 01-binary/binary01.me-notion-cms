import { GetStaticProps } from 'next';

import Home from '@/features/home';
import { HomeProps } from '@/interfaces';
import { parsePosts, getNotionPosts, getCategories } from '@/utils';
import { siteConfig } from 'site.config';

import PageHead from '@/components/common/PageHead';

import { REVALIDATE_TIME } from '@/assets/constants';

import { getPreviewImages } from '@/utils/previewImage';

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

  const rawPosts = await getNotionPosts(process.env.NOTION_POST_DATABASE_ID);
  const posts = parsePosts(rawPosts);
  const postsWithPreview = await getPreviewImages(posts);
  const categories = getCategories(rawPosts);

  return {
    props: {
      posts: postsWithPreview,
      categories,
    },
    revalidate: REVALIDATE_TIME,
  };
};
