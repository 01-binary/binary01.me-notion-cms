import type { Metadata } from 'next';
import { cacheLife, cacheTag } from 'next/cache';
import { siteConfig } from 'site.config';

import { env } from '@/lib/env';
import { buildSocialMetadata } from '@/utils/buildSocialMetadata';
import { getCachedProfileUrl } from '@/utils/fetchNotionProfileUrl';
import notionClient from '@/utils/notionClient';

import AboutRenderer from './_components/AboutRenderer';

async function getAboutPageBlocks() {
  'use cache';
  cacheTag('about');
  cacheLife('daysForever');

  const blocks = await notionClient.getPageBlocks(env.notionAboutId);

  // notion-to-utils는 블록 조회 실패를 빈 배열로 돌려주므로, 실패가 캐시되지 않도록 throw 합니다
  if (blocks.length === 0) {
    throw new Error(`Failed to fetch blocks for about page (${env.notionAboutId})`);
  }

  return blocks;
}

export async function generateMetadata(): Promise<Metadata> {
  const profileUrl = await getCachedProfileUrl();
  const pageUrl = `${siteConfig.url}/about`;

  return {
    title: 'About',
    alternates: { canonical: pageUrl },
    ...buildSocialMetadata({ imageUrl: profileUrl, pageUrl }),
  };
}

const AboutPage = async () => {
  const blocks = await getAboutPageBlocks();

  return (
    <article>
      <AboutRenderer blocks={blocks} />
    </article>
  );
};

export default AboutPage;
