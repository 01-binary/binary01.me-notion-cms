import type { Metadata } from 'next';
import { NotionBlock, Renderer } from 'notion-to-jsx';
import { siteConfig } from 'site.config';

import { env } from '@/lib/env';
import { cachedFetchNotionProfileUrl } from '@/utils/fetchNotionProfileUrl';
import notionClient from '@/utils/notionClient';

// 페이지 단위 revalidation 설정 (Next.js 16: 리터럴 값만 허용)
export const revalidate = 300; // 5 minutes

// 페이지 메타데이터 생성
export async function generateMetadata(): Promise<Metadata> {
  const profileUrl = await cachedFetchNotionProfileUrl();
  return {
    title: 'About',
    alternates: {
      canonical: `${siteConfig.url}/about`,
    },
    openGraph: {
      images: profileUrl ? [{ url: profileUrl }] : [],
      url: `${siteConfig.url}/about`,
    },
    twitter: {
      images: profileUrl ? [profileUrl] : [],
    },
  };
}

const AboutPage = async () => {
  const blocks = (await notionClient.getPageBlocks(env.notionAboutId)) as unknown as NotionBlock[];

  return (
    <article>
      <Renderer blocks={blocks} />
    </article>
  );
};

export default AboutPage;
