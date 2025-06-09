import type { Metadata } from 'next';
import { NotionBlock, Renderer } from 'notion-to-jsx';

import { cachedFetchNotionProfileUrl, notionClient } from '@/utils';
import { siteConfig } from 'site.config';

import { REVALIDATE_TIME } from '@/assets/constants';

// 페이지 단위 revalidation 설정
export const revalidate = REVALIDATE_TIME;

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
  const aboutId = process.env.NOTION_ABOUT_ID;

  if (!aboutId) {
    console.error('NOTION_ABOUT_ID is not defined');
    throw new Error('NOTION_ABOUT_ID is not defined. This page cannot be rendered.');
  }

  const blocks = (await notionClient.getPageBlocks(aboutId)) as NotionBlock[];

  return (
    <article>
      <Renderer blocks={blocks} />
    </article>
  );
};

export default AboutPage;
