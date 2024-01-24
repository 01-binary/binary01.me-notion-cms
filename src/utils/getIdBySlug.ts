import { notionClient } from '@/utils';

const getIdBySlug = async (slug: string, databaseId: string) => {
  const response = await notionClient.databases.query({
    database_id: databaseId,
    filter: {
      and: [
        {
          property: 'Slug',
          rich_text: {
            equals: slug,
          },
        },
      ],
    },
  });

  return response.results[0].id;
};

export default getIdBySlug;
