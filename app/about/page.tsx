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
  cacheLife('minutes');

  return notionClient.getPageBlocks(env.notionAboutId);
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
