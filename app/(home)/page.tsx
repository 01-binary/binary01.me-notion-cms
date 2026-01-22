import type { Metadata } from 'next';
import { Suspense } from 'react';

import { buildSocialMetadata } from '@/utils/buildSocialMetadata';
import { cachedFetchNotionProfileUrl } from '@/utils/fetchNotionProfileUrl';

import CategoryListServer from './_components/CategoryListServer';
import CategoryListSkeleton from './_components/CategoryListSkeleton';
import Intro from './_components/Intro';
import IntroSkeleton from './_components/IntroSkeleton';
import PostListServer from './_components/PostListServer';
import PostListSkeleton from './_components/PostListSkeleton';

// 페이지 메타데이터 생성
export async function generateMetadata(): Promise<Metadata> {
  const profileUrl = await cachedFetchNotionProfileUrl();
  return buildSocialMetadata({ imageUrl: profileUrl });
}

const Page = () => {
  return (
    <section className="mx-auto max-w-[900px] px-4">
      <Suspense fallback={<IntroSkeleton />}>
        <Intro />
      </Suspense>
      <Suspense fallback={<CategoryListSkeleton />}>
        <CategoryListServer />
      </Suspense>
      <Suspense fallback={<PostListSkeleton />}>
        <PostListServer />
      </Suspense>
    </section>
  );
};

export default Page;
