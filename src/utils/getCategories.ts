import countBy from 'lodash/countBy';
import uniqBy from 'lodash/uniqBy';

import { Category } from '@/interfaces';
import { getNotionPosts } from '@/utils';

const getCategories = (posts: Awaited<ReturnType<typeof getNotionPosts>>) => {
  const categories = posts
    .map((post) => {
      if (!('properties' in post)) return null;

      const { Category } = post.properties;

      const category = Category.type === 'multi_select' ? Category.multi_select[0] : null;

      return category;
    }, [])
    .filter(Boolean);

  const countedCategories = countBy(categories, 'name');
  const uniqueCategories = uniqBy(categories, (category) => category?.name);
  const uniqueCountedCategories = uniqueCategories.map((category) => ({
    ...category,
    count: countedCategories[category?.name as string],
  }));
  return [
    { id: 'all', name: 'All', count: categories.length },
    ...uniqueCountedCategories,
  ] as Category[];
};

export default getCategories;
