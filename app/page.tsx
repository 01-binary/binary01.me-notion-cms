import type { Metadata } from 'next';
import pMap from 'p-map';

import HomePageClient from '@/features/home/HomePageClient';
import type { PostMeta } from '@/interfaces';
import {
  getPostsMeta,
  cachedFetchNotionPostsMeta,
  getCategories,
  getBlurImage,
  cachedFetchNotionProfileUrl,
} from '@/utils';

import { REVALIDATE_TIME } from '@/assets/constants';

export const revalidate = REVALIDATE_TIME;

// 페이지 메타데이터 생성
export async function generateMetadata(): Promise<Metadata> {
  const profileUrl = await cachedFetchNotionProfileUrl();
  return {
    openGraph: {
      images: profileUrl ? [{ url: profileUrl }] : [],
    },
    twitter: {
      images: profileUrl ? [profileUrl] : [],
    },
  };
}

const Page = async () => {
  if (!process.env.NOTION_POST_DATABASE_ID)
    throw new Error('NOTION_POST_DATABASE_ID is not defined');

  if (!process.env.NOTION_PROFILE_ID) throw new Error('NOTION_PROFILE_ID is not defined');

  const profileUrl = await cachedFetchNotionProfileUrl();
  const notionPostsResponse = await cachedFetchNotionPostsMeta(process.env.NOTION_POST_DATABASE_ID);

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

  return (
    <HomePageClient
      profileUrl={profileUrl}
      posts={posts}
      categories={categories}
    />
  );
};

export default Page;
