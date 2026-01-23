import { cacheLife, cacheTag } from 'next/cache';
import { formatNotionImageUrl } from 'notion-to-utils';

import { env } from '@/lib/env';
import notionClient from '@/utils/notionClient';

async function fetchNotionProfileUrlFn() {
  const url = await notionClient.getFileUrl(env.notionProfileId, 'media');
  const formattedUrl = formatNotionImageUrl(url, env.notionProfileId);
  return formattedUrl;
}

/**
 * Notion에서 프로필 이미지 URL을 가져옵니다.
 *
 * 'use cache'를 사용하여 최대 시간 동안 캐싱됩니다.
 *
 * @returns 프로필 이미지 URL
 */
export async function getCachedProfileUrl(): Promise<string> {
  'use cache';
  cacheTag('profile');
  cacheLife('max');

  return fetchNotionProfileUrlFn();
}
