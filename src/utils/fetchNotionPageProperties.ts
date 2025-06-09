import { cache } from 'react';

import notionClient from '@/utils/notionClient';

/**
 * Fetches page properties for a given page ID from Notion.
 * This is the original, uncached version.
 */
export const fetchNotionPageProperties = async (pageId: string) => {
  if (!pageId) {
    console.error('fetchPageProperties: pageId is undefined or empty');
    // 상황에 따라 null을 반환하거나 에러를 던질 수 있습니다.
    // 여기서는 null을 반환하여 호출하는 쪽에서 처리하도록 합니다.
    return null;
  }
  try {
    const properties = await notionClient.getPageProperties(pageId);
    return properties;
  } catch (error) {
    console.error(`Error fetching page properties for ID "${pageId}":`, error);
    // 에러 발생 시 null 또는 빈 객체 등을 반환하거나, 에러를 다시 던질 수 있습니다.
    // 여기서는 null을 반환합니다.
    return null;
  }
};

/**
 * Cached version of fetchPageProperties.
 * Uses React.cache to memoize results within a single rendering pass.
 */
export const cachedFetchNotionPageProperties = cache(fetchNotionPageProperties);
