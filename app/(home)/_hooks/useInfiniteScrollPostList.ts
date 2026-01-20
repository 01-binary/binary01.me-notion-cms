import { useAtom, useAtomValue } from 'jotai';

import { postPageResettableAtom, postsFilterByCategoryAtom } from '../_atoms';
import useInfiniteScroll from './useInfiniteScroll';

const useInfiniteScrollPostList = () => {
  const postsFilterByCategory = useAtomValue(postsFilterByCategoryAtom);
  const [postPage, setPostPage] = useAtom(postPageResettableAtom);

  const { sentinelRef, pagedData } = useInfiniteScroll({
    data: postsFilterByCategory,
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

export default useInfiniteScrollPostList;
