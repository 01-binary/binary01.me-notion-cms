import { useMemo } from 'react';

import { useIntersectionObserver } from '@/hooks';
import { PostMeta } from '@/interfaces';

interface UseInfiniteScrollProps {
  data: PostMeta[];
  page: number;
  pageSize?: number;
  intersectCb?: () => void;
  rootMargin?: string;
  threshold?: number[] | number;
}

interface UseInfiniteScrollReturn {
  /** 무한 스크롤 트리거 요소에 연결할 ref 콜백 */
  sentinelRef: (node: HTMLElement | null) => void;
  /** 현재 페이지까지의 데이터 */
  pagedData: PostMeta[];
}

const INITIAL_PAGE = 0;
const DEFAULT_PAGE_SIZE = 8;

/**
 * 무한 스크롤을 위한 페이지네이션 및 IntersectionObserver를 제공합니다.
 *
 * @param data - 전체 데이터 배열
 * @param page - 현재 페이지 번호 (0부터 시작)
 * @param pageSize - 페이지당 아이템 수
 * @param intersectCb - 스크롤 트리거 도달 시 호출되는 콜백
 *
 * @returns sentinelRef - 무한 스크롤 트리거 요소에 연결할 ref
 * @returns pagedData - 현재 페이지까지의 데이터
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
const useInfiniteScroll = ({
  data,
  page,
  pageSize = DEFAULT_PAGE_SIZE,
  intersectCb,
  rootMargin,
  threshold,
}: UseInfiniteScrollProps): UseInfiniteScrollReturn => {
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
