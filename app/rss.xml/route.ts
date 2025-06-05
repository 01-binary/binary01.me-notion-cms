import { NextResponse } from 'next/server';
import RSS from 'rss';

import { GetPageResponse } from '@/interfaces';
import { fetchNotionPostsMeta, getPostsMeta } from '@/utils';
import { siteConfig } from 'site.config';

import { REVALIDATE_TIME } from '@/assets/constants';

// RSS 피드 경로에 대한 revalidate 설정 (선택 사항, Vercel 캐시 동작에 영향)
export const revalidate = REVALIDATE_TIME;

const generateRssFeed = (notionPostsResponse: GetPageResponse[]) => {
  const feedOptions = {
    title: `${siteConfig.homeTitle} | ${siteConfig.blogName}`,
    description: siteConfig.seoDefaultDesc,
    site_url: siteConfig.url,
    feed_url: `${siteConfig.url}/rss.xml`,
    pubDate: new Date(),
    copyright: `All rights reserved ${new Date().getFullYear()}, ${siteConfig.author}`,
  };

  const feed = new RSS(feedOptions);
  getPostsMeta(notionPostsResponse).forEach(({ title, description, slug, published }) => {
    feed.item({
      title,
      description,
      url: `${siteConfig.url}/posts/${slug}`,
      date: new Date(published),
    });
  });

  return feed.xml({ indent: true }); // indent: true 로 가독성 향상
};

export async function GET() {
  if (!process.env.NOTION_POST_DATABASE_ID) {
    console.error('NOTION_POST_DATABASE_ID is not defined for RSS feed generation.');
    return new NextResponse('Internal Server Error: Configuration missing.', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  try {
    const databaseItems = await fetchNotionPostsMeta(process.env.NOTION_POST_DATABASE_ID);
    const rssXml = generateRssFeed(databaseItems);

    return new NextResponse(rssXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        // Vercel의 Edge Caching을 활용하기 위한 Cache-Control 헤더
        // s-maxage: CDN에서 캐시할 시간 (초)
        // stale-while-revalidate: 캐시가 만료된 후에도 백그라운드에서 새로운 데이터를 가져오는 동안 이전 캐시된 데이터를 제공
        'Cache-Control': `public, s-maxage=${REVALIDATE_TIME}, stale-while-revalidate=${
          REVALIDATE_TIME * 2
        }`,
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new NextResponse('Internal Server Error: Could not generate RSS feed.', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}
