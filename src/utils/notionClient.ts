import { Client } from 'notion-to-utils';

const notionClient = new Client({
  auth: process.env.NOTION_TOKEN,
});

export default notionClient;
