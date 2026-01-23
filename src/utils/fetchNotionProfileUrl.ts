import { cacheLife, cacheTag } from 'next/cache';
import { formatNotionImageUrl } from 'notion-to-utils';

import { env } from '@/lib/env';
import notionClient from '@/utils/notionClient';

async function fetchNotionProfileUrlFn() {
  const url = await notionClient.getFileUrl(env.notionProfileId, 'media');
  const formattedUrl = formatNotionImageUrl(url, env.notionProfileId);
  return formattedUrl;
}

export async function getCachedProfileUrl(): Promise<string> {
  'use cache';
  cacheTag('profile');
  cacheLife('max');

  return fetchNotionProfileUrlFn();
}
