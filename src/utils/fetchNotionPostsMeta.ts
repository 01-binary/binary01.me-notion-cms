import { cache } from 'react';

import { GetPageResponse } from 'notion-to-utils';

import { notionClient } from '@/utils';

export const fetchNotionPostsMeta = async (databaseId: string) => {
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

export const cachedFetchNotionPostsMeta = cache(fetchNotionPostsMeta);
