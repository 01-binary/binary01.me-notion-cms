import type { NextApiRequest, NextApiResponse } from 'next';

import { siteConfig } from 'site.config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch(siteConfig.profileImg);
    const contentType = response.headers.get('content-type');

    if (!contentType) throw new Error('content header does not exist');

    res.setHeader('Content-Type', contentType);
    res.send(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    return res.status(404).end();
  }
}
