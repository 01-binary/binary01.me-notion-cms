import { useAtom, useAtomValue } from 'jotai';
import { useMemo } from 'react';

import type { PostMeta } from '@/interfaces';

import { postPageResettableAtom, selectedCategoryAtom } from '../_atoms';
import { INITIAL_CATEGORY } from '../_constants';
import useInfiniteScroll from './useInfiniteScroll';

interface UseFilteredPostsReturn {
  sentinelRef: (node: HTMLElement | null) => void;
  pagedPosts: PostMeta[];
}

const useFilteredPosts = (initialPosts: PostMeta[]): UseFilteredPostsReturn => {
  const selectedCategory = useAtomValue(selectedCategoryAtom);
  const [postPage, setPostPage] = useAtom(postPageResettableAtom);

  const filteredPosts = useMemo(() => {
    return selectedCategory === INITIAL_CATEGORY
      ? initialPosts
      : initialPosts.filter((post) => post.category.name === selectedCategory);
  }, [initialPosts, selectedCategory]);

  const { sentinelRef, pagedData } = useInfiniteScroll({
    data: filteredPosts,
    page: postPage,
    intersectCb: () => {
      setPostPage((prev) => prev + 1);
    },
  });

  return {
    sentinelRef,
    pagedPosts: pagedData,
  };
};

export default useFilteredPosts;
