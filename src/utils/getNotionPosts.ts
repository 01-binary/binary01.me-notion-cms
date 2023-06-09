import { notionClient } from '@/utils';

const getNotionPosts = async (databaseId: string) => {
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
        // {
        //   property: 'Category',
        //   multi_select: {
        //     contains: option?.filter?.tagName || '',
        //   },
        // },
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

export default getNotionPosts;
