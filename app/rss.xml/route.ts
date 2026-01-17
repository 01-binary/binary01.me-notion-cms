import { NextResponse } from 'next/server';
import RSS from 'rss';
import { siteConfig } from 'site.config';

import { GetPageResponse } from '@/interfaces';
import { cachedFetchNotionPostsMeta, getPostsMeta } from '@/utils';

export const revalidate = 300; // 5 minutes

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
    const databaseItems = await cachedFetchNotionPostsMeta(process.env.NOTION_POST_DATABASE_ID);
    const rssXml = generateRssFeed(databaseItems);

    return new NextResponse(rssXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        // Vercel의 Edge Caching을 활용하기 위한 Cache-Control 헤더
        // s-maxage: CDN에서 캐시할 시간 (초)
        // stale-while-revalidate: 캐시가 만료된 후에도 백그라운드에서 새로운 데이터를 가져오는 동안 이전 캐시된 데이터를 제공
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
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
