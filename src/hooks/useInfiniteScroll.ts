import { useMemo } from 'react';

import { useIntersectionObserver } from '@/hooks';
import { PostMeta } from '@/interfaces';

interface Props {
  data: PostMeta[];
  page: number;
  pageSize?: number;
  intersectCb?: () => void;
  rootMargin?: string;
  threshold?: number[] | number;
}

const INITIAL_PAGE = 0;
const DEFAULT_PAGE_SIZE = 8;

const useInfiniteScroll = ({
  data,
  page,
  pageSize = DEFAULT_PAGE_SIZE,
  intersectCb,
  rootMargin,
  threshold,
}: Props) => {
  const pagedData = useMemo(
    () => data.slice(INITIAL_PAGE, (page + 1) * pageSize),
    [page, pageSize, data],
  );

  const entries = useIntersectionObserver({
    rootMargin,
    threshold,
    onIntersect: (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        if (typeof intersectCb === 'function') intersectCb();
      });
    },
  });

  return {
    entries,
    pagedData,
  };
};

export default useInfiniteScroll;
