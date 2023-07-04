import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { notionClient } from '@/utils';

const getPageProperties = async (pageId: string) => {
  const pageObj = (await getNotionClientPage(pageId)) as PageObjectResponse;
  const { Category, Desc } = pageObj.properties;
  const category = Category?.type === 'multi_select' ? Category?.multi_select[0] || null : null;
  const description = Desc?.type === 'rich_text' ? Desc?.rich_text[0]?.plain_text || '' : '';

  return {
    description,
    keywords: category?.name || '',
  };
};

const getNotionClientPage = async (pageId: string) => {
  const response = await notionClient.pages.retrieve({
    page_id: pageId,
  });

  return response;
};

export default getPageProperties;
