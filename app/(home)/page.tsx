import type { Metadata } from 'next';
import { Suspense } from 'react';

import { buildSocialMetadata } from '@/utils/buildSocialMetadata';
import { cachedFetchNotionProfileUrl } from '@/utils/fetchNotionProfileUrl';

import CategoryListServer from './_components/CategoryListServer';
import CategoryListSkeleton from './_components/CategoryListSkeleton';
import Intro from './_components/Intro';
import PostListServer from './_components/PostListServer';

// 페이지 메타데이터 생성
export async function generateMetadata(): Promise<Metadata> {
  const profileUrl = await cachedFetchNotionProfileUrl();
  return buildSocialMetadata({ imageUrl: profileUrl });
}

const Page = async () => {
  const profileUrl = await cachedFetchNotionProfileUrl();

  return (
    <section className="mx-auto max-w-[900px] px-4">
      <Intro profileUrl={profileUrl} />
      <Suspense fallback={<CategoryListSkeleton />}>
        <CategoryListServer />
      </Suspense>
      <PostListServer />
    </section>
  );
};

export default Page;
