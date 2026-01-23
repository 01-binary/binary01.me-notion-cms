import { cacheLife, cacheTag } from 'next/cache';

import notionClient from '@/utils/notionClient';

export async function getCachedPageProperties(pageId: string) {
  'use cache';
  cacheTag('page-properties', pageId);
  cacheLife('hours');

  if (!pageId) {
    console.error('fetchPageProperties: pageId is undefined or empty');
    return null;
  }
  try {
    const properties = await notionClient.getPageProperties(pageId);
    return properties;
  } catch (error) {
    console.error(`Error fetching page properties for ID "${pageId}":`, error);
    return null;
  }
}
