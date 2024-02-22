import { PageObjectResponse } from '@/interfaces';
import { notionClient } from '@/utils';

import { filterCategoryProperties, filterDescSlugProperties } from '@/utils/filterProperties';

const getPageProperties = async (pageId: string) => {
  const pageObj = (await getNotionClientPage(pageId)) as PageObjectResponse;
  const { Category, Desc } = pageObj.properties;
  const category = filterCategoryProperties(Category);
  const description = filterDescSlugProperties(Desc);

  return {
    description,
    keywords: (category && category.name) || '',
  };
};

const getNotionClientPage = async (pageId: string) => {
  const response = await notionClient.pages.retrieve({
    page_id: pageId,
  });

  return response;
};

export default getPageProperties;
