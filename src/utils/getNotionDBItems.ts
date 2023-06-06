import { notionClient } from '@/utils';

const getNotionDBItems = async (databaseId: string) => {
  const response = await notionClient.databases.query({
    database_id: databaseId,
    filter: {
      property: 'isPublished',
      checkbox: {
        equals: true,
      },
    },
    // sorts: [
    //   {
    //     property: '작성일',
    //     direction: 'descending',
    //   },
    // ],
  });

  return response.results;
};

export default getNotionDBItems;
