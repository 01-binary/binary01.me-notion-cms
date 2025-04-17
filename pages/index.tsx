import { useHydrateAtoms } from 'jotai/utils';
import { GetStaticProps } from 'next';

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
  const posts = await Promise.all(
    getPostsMeta(notionPostsResponse).map(async (post) => ({
      ...post,
      blurImage: await getBlurImage(post.cover),
    })),
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
