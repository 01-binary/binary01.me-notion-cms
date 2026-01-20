import { unstable_cache } from 'next/cache';

import notionClient from '@/utils/notionClient';

const fetchIdBySlugFn = async (slug: string, databaseId: string): Promise<string | null> => {
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
};

export const cachedFetchIdBySlug = unstable_cache(fetchIdBySlugFn, ['id-by-slug'], {
  revalidate: 3600, // 1 hour
});

export const fetchIdBySlug = fetchIdBySlugFn;
