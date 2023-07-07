import got from 'got';
import type { NextApiRequest, NextApiResponse } from 'next';

import { getPage, getPageCoverImage } from '@/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { pageId } = req.query;

  try {
    const recordMap = await getPage(pageId as string);
    const notionCoverUrl = getPageCoverImage(recordMap) as unknown as URL;
    const content = await got(notionCoverUrl, {
      responseType: 'buffer',
    });

    const contentType = content.headers['content-type'];

    if (!contentType) throw new Error('content header is not exist');

    res.setHeader('Content-Type', contentType);
    res.send(content.body);
  } catch (error) {
    return res.status(404).end();
  }
}
