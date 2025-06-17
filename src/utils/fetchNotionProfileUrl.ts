import { unstable_cache } from 'next/cache';
import { formatNotionImageUrl } from 'notion-to-utils';

import notionClient from '@/utils/notionClient';

const fetchNotionProfileUrlFn = async () => {
  if (!process.env.NOTION_PROFILE_ID) throw new Error('NOTION_PROFILE_ID is not defined');
  const url = await notionClient.getFileUrl(process.env.NOTION_PROFILE_ID, 'media');
  const formattedUrl = formatNotionImageUrl(url, process.env.NOTION_PROFILE_ID);
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
