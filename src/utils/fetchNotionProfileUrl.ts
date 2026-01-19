import { unstable_cache } from 'next/cache';
import { formatNotionImageUrl } from 'notion-to-utils';

import { env } from '@/lib/env';
import notionClient from '@/utils/notionClient';

const fetchNotionProfileUrlFn = async () => {
  const url = await notionClient.getFileUrl(env.notionProfileId, 'media');
  const formattedUrl = formatNotionImageUrl(url, env.notionProfileId);
  return formattedUrl;
};

export const cachedFetchNotionProfileUrl = unstable_cache(
  fetchNotionProfileUrlFn,
  ['profile-url'],
  {
    revalidate: false, // Indefinite cache
  },
);

export const fetchNotionProfileUrl = fetchNotionProfileUrlFn;
