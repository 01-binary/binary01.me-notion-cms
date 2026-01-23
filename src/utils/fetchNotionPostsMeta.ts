import { cacheLife, cacheTag } from 'next/cache';
import type { GetPageResponse } from 'notion-to-utils';

import type { PostMeta } from '@/interfaces';
import { env } from '@/lib/env';
import notionClient from '@/utils/notionClient';

import getPostsMeta from './getPostsMeta';

// Route Handler용 (캐싱 없음 - Route의 revalidate로 캐싱)
export async function fetchNotionPostsMeta(databaseId: string): Promise<GetPageResponse[]> {
  const response = await notionClient.dataSources.query({
    data_source_id: databaseId,
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
}

// 페이지 컴포넌트용 ('use cache' 캐싱)
export async function getCachedPostsMeta(): Promise<PostMeta[]> {
  'use cache';
  cacheTag('posts');
  cacheLife('minutes');

  const response = await notionClient.dataSources.query({
    data_source_id: env.notionPostDatabaseId,
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

  const notionPostsResponse = response.results as GetPageResponse[];
  return getPostsMeta(notionPostsResponse);
}
