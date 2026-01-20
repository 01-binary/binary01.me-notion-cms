import { Category, GetPageResponse, SelectPropertyResponse } from '@/interfaces';
import { filterCategoryProperties } from '@/utils/filterProperties';

const getCategories = (notionPostsResponse: GetPageResponse[]): Category[] => {
  const categories = notionPostsResponse
    .map((post) => {
      if (!('properties' in post)) return null;
      const { Category } = post.properties;
      const category = filterCategoryProperties(Category);
      return category;
    })
    .filter((category): category is SelectPropertyResponse => category !== null);

  // 카테고리별 카운트 (native Map)
  const countMap = new Map<string, number>();
  categories.forEach((cat) => {
    countMap.set(cat.name, (countMap.get(cat.name) ?? 0) + 1);
  });

  // 유니크 카테고리 추출 (native Set)
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
};

export default getCategories;
