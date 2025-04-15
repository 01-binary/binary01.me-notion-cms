import { useHydrateAtoms } from 'jotai/utils';
import { GetStaticProps } from 'next';

import { categoriesAtom } from '@/atoms/categories';
import { postsAtom } from '@/atoms/posts';
import Home from '@/features/home';
import { Category, PostMeta } from '@/interfaces';
import { getPostsMeta, fetchNotionPostsMeta, getCategories } from '@/utils';
import { siteConfig } from 'site.config';

import PageHead from '@/components/common/PageHead';

import { REVALIDATE_TIME } from '@/assets/constants';

interface Props {
  posts: PostMeta[];
  categories: Category[];
}
const HomePage = ({ posts, categories }: Props) => {
  useHydrateAtoms([
    [postsAtom, posts],
    [categoriesAtom, categories],
  ]);

  return (
    <>
      <PageHead title={siteConfig.homeTitle} />
      <Home />
    </>
  );
};

export default HomePage;

export const getStaticProps: GetStaticProps<Props> = async () => {
  if (!process.env.NOTION_POST_DATABASE_ID)
    throw new Error('NOTION_POST_DATABASE_ID is not defined');

  const notionPostsResponse = await fetchNotionPostsMeta(process.env.NOTION_POST_DATABASE_ID);
  const posts = getPostsMeta(notionPostsResponse);
  const categories = getCategories(notionPostsResponse);

  return {
    props: {
      posts,
      categories,
    },
    revalidate: REVALIDATE_TIME,
  };
};
