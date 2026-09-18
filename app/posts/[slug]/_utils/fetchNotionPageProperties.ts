import { cacheLife, cacheTag } from 'next/cache';

import notionClient from '@/utils/notionClient';

export async function getCachedPageProperties(pageId: string) {
  'use cache';
  cacheTag('page-properties', pageId);
  cacheLife('weeksForever');

  // notion-to-utils는 조회 실패를 undefined로 돌려주므로,
  // 실패가 weeksForever로 캐시되지 않도록 여기서 throw 합니다
  const properties = await notionClient.getPageProperties(pageId);
  if (!properties) {
    throw new Error(`Failed to fetch page properties for ID "${pageId}"`);
  }

  return properties;
}
