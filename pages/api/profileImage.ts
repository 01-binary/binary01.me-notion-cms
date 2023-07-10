import got from 'got';
import type { NextApiRequest, NextApiResponse } from 'next';

import { siteConfig } from 'site.config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const content = await got(siteConfig.profileImg, {
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
