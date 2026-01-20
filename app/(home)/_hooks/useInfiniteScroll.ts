import { useMemo } from 'react';

import { DEFAULT_PAGE_SIZE, INITIAL_PAGE } from '../_constants';
import useIntersectionObserver from './useIntersectionObserver';

interface UseInfiniteScrollProps<T> {
  data: T[];
  page: number;
  pageSize?: number;
  intersectCb?: () => void;
  rootMargin?: string;
  threshold?: number[] | number;
}

interface UseInfiniteScrollReturn<T> {
  sentinelRef: (node: HTMLElement | null) => void;
  pagedData: T[];
}

/**
 * 무한 스크롤을 위한 페이지네이션 및 IntersectionObserver를 제공합니다.
 *
 * @example
 * const { sentinelRef, pagedData } = useInfiniteScroll({
 *   data: posts,
 *   page: currentPage,
 *   intersectCb: () => setCurrentPage(prev => prev + 1),
 * });
 *
 * return (
 *   <>
 *     {pagedData.map(item => <Item key={item.id} />)}
 *     <div ref={sentinelRef} />
 *   </>
 * );
 */
const useInfiniteScroll = <T>({
  data,
  page,
  pageSize = DEFAULT_PAGE_SIZE,
  intersectCb,
  rootMargin,
  threshold,
}: UseInfiniteScrollProps<T>): UseInfiniteScrollReturn<T> => {
  const pagedData = useMemo(
    () => data.slice(INITIAL_PAGE, (page + 1) * pageSize),
    [page, pageSize, data],
  );

  const { sentinelRef } = useIntersectionObserver({
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
    sentinelRef,
    pagedData,
  };
};

export default useInfiniteScroll;
