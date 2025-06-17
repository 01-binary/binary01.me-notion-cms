import type { GetPageResponse } from '@notionhq/client/build/src/api-endpoints';
import { unstable_cache } from 'next/cache';

import { notionClient } from '@/utils';

const fetchNotionPostsMetaFn = async (databaseId: string) => {
  const response = await notionClient.databases.query({
    database_id: databaseId,
    filter:
      process.env.NODE_ENV === 'production'
        ? {
            and: [
              {
                property: 'isPublished',
                checkbox: {
                  equals: true,
                },
              },
              {
                property: 'Slug',
                rich_text: {
                  is_not_empty: true,
                },
              },
            ],
          }
        : {
            property: 'Slug',
            rich_text: {
              is_not_empty: true,
            },
          },
    sorts: [
      {
        property: 'Date',
        direction: 'descending',
      },
    ],
  });

  return response.results as GetPageResponse[];
};

export const cachedFetchNotionPostsMeta = unstable_cache(
  fetchNotionPostsMetaFn,
  ['posts-meta'],
  { revalidate: 300 }, // 5 minutes
);

export const fetchNotionPostsMeta = fetchNotionPostsMetaFn;
