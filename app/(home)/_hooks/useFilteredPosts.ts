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

/**
 * 카테고리 필터링과 무한 스크롤이 적용된 포스트 목록을 반환합니다.
 *
 * @param initialPosts - 전체 포스트 목록
 * @returns sentinelRef와 필터링/페이지네이션된 포스트 목록
 */
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
