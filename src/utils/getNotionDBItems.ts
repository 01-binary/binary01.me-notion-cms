import { notionClient } from '@/utils';

interface QueryOption {
  filter?: {
    tagName?: string;
  };
}

const getNotionDBItems = async (databaseId: string, option?: QueryOption) => {
  const response = await notionClient.databases.query({
    database_id: databaseId,
    filter: {
      and: [
        {
          property: 'isPublished',
          checkbox: {
            equals: true,
          },
        },
        {
          property: 'Tags',
          multi_select: {
            contains: option?.filter?.tagName || '',
          },
        },
      ],
    },
    sorts: [
      {
        property: 'Date',
        direction: 'descending',
      },
    ],
  });

  return response.results;
};

export default getNotionDBItems;
