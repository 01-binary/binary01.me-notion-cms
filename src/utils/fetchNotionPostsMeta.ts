import { cacheLife, cacheTag } from 'next/cache';
import type { GetPageResponse } from 'notion-to-utils';

import type { PostMeta } from '@/interfaces';
import { env } from '@/lib/env';
import notionClient from '@/utils/notionClient';

import getPostsMeta from './getPostsMeta';

// 공통 쿼리 옵션 생성
const createPostsQueryOptions = () => {
  const filter =
    process.env.NODE_ENV === 'production'
      ? {
          and: [
            { property: 'isPublished', checkbox: { equals: true } },
            { property: 'Slug', rich_text: { is_not_empty: true } },
          ],
        }
      : { property: 'Slug', rich_text: { is_not_empty: true } };

  const sorts = [{ property: 'Date', direction: 'descending' as const }];

  return { filter, sorts };
};

// Route Handler용 (캐싱 없음 - Route의 revalidate로 캐싱)
export async function fetchNotionPostsMeta(databaseId: string): Promise<GetPageResponse[]> {
  const response = await notionClient.dataSources.query({
    data_source_id: databaseId,
    ...createPostsQueryOptions(),
  } as Parameters<typeof notionClient.dataSources.query>[0]);

  return response.results as GetPageResponse[];
}

// 페이지 컴포넌트용 ('use cache' 캐싱)
export async function getCachedPostsMeta(): Promise<PostMeta[]> {
  'use cache';
  cacheTag('posts');
  cacheLife('minutes');

  const response = await notionClient.dataSources.query({
    data_source_id: env.notionPostDatabaseId,
    ...createPostsQueryOptions(),
  } as Parameters<typeof notionClient.dataSources.query>[0]);

  const notionPostsResponse = response.results as GetPageResponse[];
  return getPostsMeta(notionPostsResponse);
}
