import { notionClient } from '@/utils';

const getNotionPosts = async (databaseId: string) => {
  const response = await notionClient.databases.query({
    database_id: databaseId,
    filter:
      process.env.NODE_ENV === 'production'
        ? {
            and: [
              {
                property: 'isPublished',
                checkbox: {
                  equals: true,
                },
              },
            ],
          }
        : undefined,
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
