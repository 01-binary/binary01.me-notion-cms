import { useAtomValue } from 'jotai';

import { selectedCategoryAtom } from '@/atoms/categories';
import { postsFilterByCategoryAtom } from '@/atoms/posts';
import { useInfiniteScroll } from '@/hooks';

const useInfiniteScrollPostList = () => {
  const postsFilterByCategory = useAtomValue(postsFilterByCategoryAtom);
  const selectedCategory = useAtomValue(selectedCategoryAtom);
  const { entries, pagedData } = useInfiniteScroll({
    data: postsFilterByCategory,
    initFlag: selectedCategory,
  });

  return {
    entries,
    pagedPosts: pagedData,
  };
};

export default useInfiniteScrollPostList;
