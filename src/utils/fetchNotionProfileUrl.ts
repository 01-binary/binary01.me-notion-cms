import { formatNotionImageUrl } from 'notion-to-utils';

import notionClient from '@/utils/notionClient';

const fetchNotionProfileUrl = async () => {
  if (!process.env.NOTION_PROFILE_ID) throw new Error('NOTION_PROFILE_ID is not defined');
  const url = await notionClient.getFileUrl(process.env.NOTION_PROFILE_ID, 'media');
  const formattedUrl = formatNotionImageUrl(url, process.env.NOTION_PROFILE_ID);
  return formattedUrl;
};

export default fetchNotionProfileUrl;
