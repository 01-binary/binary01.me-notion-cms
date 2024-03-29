import type { NextApiRequest, NextApiResponse } from 'next';

import { getPage, getPageCoverImage } from '@/utils';

import { IMAGE_MAX_AGE } from '@/assets/constants';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { pageId } = req.query;

  try {
    const recordMap = await getPage(pageId as string);
    const notionCoverUrl = getPageCoverImage(recordMap) as unknown as URL;
    const response = await fetch(notionCoverUrl);
    const contentType = response.headers.get('content-type');

    if (!contentType) throw new Error('content header does not exist');

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', `public, s-maxage=${IMAGE_MAX_AGE}, max-age=${IMAGE_MAX_AGE}`);

    res.send(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    return res.status(404).end();
  }
}
