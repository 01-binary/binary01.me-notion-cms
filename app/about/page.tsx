import type { Metadata } from 'next';
import { NotionBlock } from 'notion-to-jsx';
import { siteConfig } from 'site.config';

import { env } from '@/lib/env';
import { buildSocialMetadata } from '@/utils/buildSocialMetadata';
import { cachedFetchNotionProfileUrl } from '@/utils/fetchNotionProfileUrl';
import notionClient from '@/utils/notionClient';

import AboutRenderer from './_components/AboutRenderer';

// 페이지 단위 revalidation 설정 (Next.js 16: 리터럴 값만 허용)
export const revalidate = 300; // 5 minutes

// 페이지 메타데이터 생성
export async function generateMetadata(): Promise<Metadata> {
  const profileUrl = await cachedFetchNotionProfileUrl();
  const pageUrl = `${siteConfig.url}/about`;

  return {
    title: 'About',
    alternates: { canonical: pageUrl },
    ...buildSocialMetadata({ imageUrl: profileUrl, pageUrl }),
  };
}

const AboutPage = async () => {
  const blocks = (await notionClient.getPageBlocks(env.notionAboutId)) as unknown as NotionBlock[];

  return (
    <article>
      <AboutRenderer blocks={blocks} />
    </article>
  );
};

export default AboutPage;
