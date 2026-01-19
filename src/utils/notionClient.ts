import { Client } from 'notion-to-utils';

import { env } from '@/lib/env';

const notionClient = new Client({
  auth: env.notionToken,
});

export default notionClient;
