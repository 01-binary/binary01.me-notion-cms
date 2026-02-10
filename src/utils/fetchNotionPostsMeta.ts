import { cacheLife, cacheTag } from 'next/cache';
import type { GetPageResponse } from 'notion-to-utils';

import type { PostMeta } from '@/interfaces';
import { env } from '@/lib/env';
import notionClient from '@/utils/notionClient';

import getPostsMeta from './getPostsMeta';

/** Notion 데이터베이스 쿼리용 공통 옵션을 생성합니다 */
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

/**
 * Notion에서 포스트 메타데이터를 가져옵니다. (Route Handler용)
 *
 * 캐싱 없이 직접 호출되며, Route의 revalidate로 캐싱됩니다.
 *
 * @param databaseId - Notion 데이터베이스 ID
 * @returns Notion 페이지 응답 배열
 */
export async function fetchNotionPostsMeta(databaseId: string): Promise<GetPageResponse[]> {
  const response = await notionClient.dataSources.query({
    data_source_id: databaseId,
    ...createPostsQueryOptions(),
  } as Parameters<typeof notionClient.dataSources.query>[0]);

  return response.results as GetPageResponse[];
}

/**
 * Notion에서 포스트 메타데이터를 가져옵니다. (페이지 컴포넌트용)
 *
 * 'use cache'를 사용하여 시간 단위로 캐싱됩니다.
 *
 * @returns 블로그 포스트 메타데이터 배열
 */
export async function getCachedPostsMeta(): Promise<PostMeta[]> {
  'use cache';
  cacheTag('posts');
  cacheLife('hoursForever');

  const response = await notionClient.dataSources.query({
    data_source_id: env.notionPostDatabaseId,
    ...createPostsQueryOptions(),
  } as Parameters<typeof notionClient.dataSources.query>[0]);

  const notionPostsResponse = response.results as GetPageResponse[];
  return getPostsMeta(notionPostsResponse);
}
