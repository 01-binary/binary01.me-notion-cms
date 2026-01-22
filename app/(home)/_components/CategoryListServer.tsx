import { getCachedCategories } from '@/utils/fetchCategories';

import CategoryListClient from './CategoryListClient';

const CategoryListServer = async () => {
  const categories = await getCachedCategories();
  return <CategoryListClient categories={categories} />;
};

export default CategoryListServer;
