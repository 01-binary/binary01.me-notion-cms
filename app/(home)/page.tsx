import type { Metadata } from 'next';
import pMap from 'p-map';

import type { PostMeta } from '@/interfaces';
import { env } from '@/lib/env';
import { buildSocialMetadata } from '@/utils/buildSocialMetadata';
import { cachedFetchNotionPostsMeta } from '@/utils/fetchNotionPostsMeta';
import { cachedFetchNotionProfileUrl } from '@/utils/fetchNotionProfileUrl';
import getPostsMeta from '@/utils/getPostsMeta';

import HomeHydrator from './_components/HomeHydrator';
import Intro from './_components/Intro';
import { getBlurImage, getCategories } from './_utils';

// Next.js 16: revalidate는 리터럴 값만 허용
export const revalidate = 300; // 5 minutes

// 페이지 메타데이터 생성
export async function generateMetadata(): Promise<Metadata> {
  const profileUrl = await cachedFetchNotionProfileUrl();
  return buildSocialMetadata({ imageUrl: profileUrl });
}

const Page = async () => {
  // 병렬 실행으로 waterfall 제거
  const [profileUrl, notionPostsResponse] = await Promise.all([
    cachedFetchNotionProfileUrl(),
    cachedFetchNotionPostsMeta(env.notionPostDatabaseId),
  ]);

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
    <section className="mx-auto max-w-[900px] px-4">
      <Intro profileUrl={profileUrl} />
      <HomeHydrator
        posts={posts}
        categories={categories}
      />
    </section>
  );
};

export default Page;
