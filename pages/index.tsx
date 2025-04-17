import { useHydrateAtoms } from 'jotai/utils';
import { GetStaticProps } from 'next';
import pMap from 'p-map';

import { categoriesAtom } from '@/atoms/categories';
import { postsAtom } from '@/atoms/posts';
import { profileImageAtom } from '@/atoms/profile';
import Home from '@/features/home';
import { Category, PostMeta } from '@/interfaces';
import {
  getPostsMeta,
  fetchNotionPostsMeta,
  getCategories,
  getBlurImage,
  fetchNotionProfileUrl,
} from '@/utils';
import { siteConfig } from 'site.config';

import PageHead from '@/components/common/PageHead';

import { REVALIDATE_TIME } from '@/assets/constants';

interface Props {
  profileUrl: string;
  posts: PostMeta[];
  categories: Category[];
}
const HomePage = ({ profileUrl, posts, categories }: Props) => {
  useHydrateAtoms([
    [profileImageAtom, profileUrl],
    [postsAtom, posts],
    [categoriesAtom, categories],
  ]);

  return (
    <>
      <PageHead
        title={siteConfig.homeTitle}
        image={profileUrl}
      />
      <Home />
    </>
  );
};

export default HomePage;

export const getStaticProps: GetStaticProps<Props> = async () => {
  if (!process.env.NOTION_POST_DATABASE_ID)
    throw new Error('NOTION_POST_DATABASE_ID is not defined');

  if (!process.env.NOTION_PROFILE_ID) throw new Error('NOTION_PROFILE_ID is not defined');

  const profileUrl = await fetchNotionProfileUrl();
  const notionPostsResponse = await fetchNotionPostsMeta(process.env.NOTION_POST_DATABASE_ID);

  const allPostsMeta = getPostsMeta(notionPostsResponse);
  const posts = await pMap(
    allPostsMeta,
    async (post: PostMeta) => {
      const blurImage = await getBlurImage(post.cover);
      return { ...post, blurImage };
    },
    { concurrency: 10 },
  );
  const categories = getCategories(notionPostsResponse);

  return {
    props: {
      profileUrl,
      posts,
      categories,
    },
    revalidate: REVALIDATE_TIME,
  };
};
