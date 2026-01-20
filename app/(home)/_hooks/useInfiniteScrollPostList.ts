import { useAtom, useAtomValue } from 'jotai';
import { useCallback } from 'react';

import { postPageResettableAtom, postsFilterByCategoryAtom } from '../_atoms';
import useInfiniteScroll from './useInfiniteScroll';

const useInfiniteScrollPostList = () => {
  const postsFilterByCategory = useAtomValue(postsFilterByCategoryAtom);
  const [postPage, setPostPage] = useAtom(postPageResettableAtom);

  const { sentinelRef, pagedData } = useInfiniteScroll({
    data: postsFilterByCategory,
    page: postPage,
    intersectCb: useCallback(() => {
      setPostPage((prev) => prev + 1);
    }, [setPostPage]),
  });

  return {
    sentinelRef,
    pagedPosts: pagedData,
  };
};

export default useInfiniteScrollPostList;
