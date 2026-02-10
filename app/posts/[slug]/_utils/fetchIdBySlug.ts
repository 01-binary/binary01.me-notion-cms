import { cacheLife, cacheTag } from 'next/cache';

import notionClient from '@/utils/notionClient';

export async function getCachedIdBySlug(slug: string, databaseId: string): Promise<string | null> {
  'use cache';
  cacheTag('post-id', slug);
  cacheLife('max');

  const response = await notionClient.dataSources.query({
    data_source_id: databaseId,
    filter: {
      and: [
        {
          property: 'Slug',
          rich_text: {
            equals: slug,
          },
        },
      ],
    },
  });

  const firstResult = response.results[0];
  if (!firstResult) {
    return null;
  }

  return firstResult.id;
}
