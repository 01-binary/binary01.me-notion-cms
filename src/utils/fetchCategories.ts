import { cacheLife, cacheTag } from 'next/cache';

import type { Category, GetPageResponse, SelectPropertyResponse } from '@/interfaces';
import { env } from '@/lib/env';
import { filterCategoryProperties } from '@/utils/filterProperties';
import notionClient from '@/utils/notionClient';

export async function getCachedCategories(): Promise<Category[]> {
  'use cache';
  cacheTag('categories');
  cacheLife('minutes');

  const response = await notionClient.dataSources.query({
    data_source_id: env.notionPostDatabaseId,
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
              {
                property: 'Slug',
                rich_text: {
                  is_not_empty: true,
                },
              },
            ],
          }
        : {
            property: 'Slug',
            rich_text: {
              is_not_empty: true,
            },
          },
    sorts: [
      {
        property: 'Date',
        direction: 'descending',
      },
    ],
  });

  const notionPostsResponse = response.results as GetPageResponse[];

  const categories = notionPostsResponse
    .map((post) => {
      if (!('properties' in post)) return null;
      const { Category } = post.properties;
      const category = filterCategoryProperties(Category);
      return category;
    })
    .filter((category): category is SelectPropertyResponse => category !== null);

  const countMap = new Map<string, number>();
  categories.forEach((cat) => {
    countMap.set(cat.name, (countMap.get(cat.name) ?? 0) + 1);
  });

  const seenNames = new Set<string>();
  const uniqueCategories = categories.filter((category) => {
    if (seenNames.has(category.name)) return false;
    seenNames.add(category.name);
    return true;
  });

  const uniqueCountedCategories = uniqueCategories.map((category) => ({
    ...category,
    count: countMap.get(category.name) ?? 0,
  }));

  return [
    { id: 'all', name: 'All', count: categories.length, color: 'default' },
    ...uniqueCountedCategories,
  ];
}
