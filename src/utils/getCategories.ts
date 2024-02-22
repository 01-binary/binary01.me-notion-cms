import countBy from 'lodash/countBy';
import uniqBy from 'lodash/uniqBy';

import { Category, GetPageResponse, SelectPropertyResponse } from '@/interfaces';

import { filterCategoryProperties } from '@/utils/filterProperties';

const getCategories = (notionPostsResponse: GetPageResponse[]): Category[] => {
  const categories = notionPostsResponse
    .map((post) => {
      if (!('properties' in post)) return null;
      const { Category } = post.properties;
      const category = filterCategoryProperties(Category);
      return category;
    }, [])
    .filter((category): category is SelectPropertyResponse => category !== null);

  const countedCategories = countBy(categories, 'name');
  const uniqueCategories = uniqBy(categories, (category) => category.name);
  const uniqueCountedCategories = uniqueCategories.map((category) => ({
    ...category,
    count: countedCategories[category.name],
  }));
  return [
    { id: 'all', name: 'All', count: categories.length, color: 'default' },
    ...uniqueCountedCategories,
  ];
};

export default getCategories;
