import { unstable_cache } from 'next/cache';

import notionClient from '@/utils/notionClient';

const fetchNotionPagePropertiesFn = async (pageId: string) => {
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
};

export const cachedFetchNotionPageProperties = unstable_cache(
  fetchNotionPagePropertiesFn,
  ['page-properties'],
  {
    revalidate: 3600, // 1 hour
  },
);

export const fetchNotionPageProperties = fetchNotionPagePropertiesFn;
