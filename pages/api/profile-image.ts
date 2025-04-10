import type { NextApiRequest, NextApiResponse } from 'next';

import { notionClient } from '@/utils';

import { IMAGE_MAX_AGE } from '@/assets/constants';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!process.env.NOTION_PROFILE_ID) throw new Error('NOTION_PROFILE_ID is not defined');
  const pageId = process.env.NOTION_PROFILE_ID;
  try {
    const url = await notionClient.getFileUrl(pageId, 'media');

    if (url) {
      const response = await fetch(url);
      const contentType = response.headers.get('content-type');

      if (!contentType) throw new Error('content header does not exist');

      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', `public, s-maxage=${IMAGE_MAX_AGE}, max-age=${IMAGE_MAX_AGE}`);

      res.send(Buffer.from(await response.arrayBuffer()));
    } else {
      return res.status(404).json({ message: 'No file found' });
    }
  } catch (error) {
    console.error('Error retrieving page:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
