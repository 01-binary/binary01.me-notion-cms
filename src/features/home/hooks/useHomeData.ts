import { useMemo } from 'react';

import { useAtomValue } from 'jotai';

import { selectedCategoryAtom } from '@/atoms/categories';
import { postsAtom } from '@/atoms/posts';
import { useInfiniteScroll } from '@/hooks';

import { INITIAL_CATEGORY } from '@/assets/constants';

const useHomeData = () => {
  const posts = useAtomValue(postsAtom);

  const seletedCategory = useAtomValue(selectedCategoryAtom);

  const filteredPosts = useMemo(
    () =>
      seletedCategory === INITIAL_CATEGORY
        ? posts
        : posts.filter((post) => post.category.name === seletedCategory),
    [posts, seletedCategory],
  );

  const { entries, data } = useInfiniteScroll({ rawData: filteredPosts });

  return {
    entries,
    processedPosts: data,
  };
};

export default useHomeData;
