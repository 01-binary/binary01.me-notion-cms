import { useAtom, useAtomValue } from 'jotai';
import { useCallback } from 'react';

import { useInfiniteScroll } from '@/hooks';

import { postPageResettableAtom, postsFilterByCategoryAtom } from '../atoms';

const useInfiniteScrollPostList = () => {
  const postsFilterByCategory = useAtomValue(postsFilterByCategoryAtom);
  const [postPage, setPostPage] = useAtom(postPageResettableAtom);

  const { entries, pagedData } = useInfiniteScroll({
    data: postsFilterByCategory,
    page: postPage,
    intersectCb: useCallback(() => {
      setPostPage((prev) => prev + 1);
    }, [setPostPage]),
  });

  return {
    entries,
    pagedPosts: pagedData,
  };
};

export default useInfiniteScrollPostList;
