import { useCallback, useEffect, useRef } from 'react';

interface UseIntersectionObserverProps {
  root?: null | HTMLElement;
  rootMargin?: string;
  threshold?: number[] | number;
  onIntersect: IntersectionObserverCallback;
  isLoading?: boolean;
}

interface UseIntersectionObserverReturn {
  sentinelRef: (node: HTMLElement | null) => void;
}

/**
 * IntersectionObserver를 사용하여 요소의 가시성을 감지합니다.
 *
 * @param onIntersect - 요소가 뷰포트에 들어올 때 호출되는 콜백
 * @param threshold - 콜백을 트리거할 가시성 임계값 (0-1)
 * @param rootMargin - root 요소의 마진
 * @param isLoading - 로딩 중일 때 observer를 일시 중지
 *
 * @returns sentinelRef - 관찰할 요소에 연결할 ref 콜백
 *
 * @example
 * const { sentinelRef } = useIntersectionObserver({
 *   onIntersect: (entries) => {
 *     if (entries[0].isIntersecting) loadMore();
 *   },
 * });
 *
 * return <div ref={sentinelRef} />;
 */
const useIntersectionObserver = ({
  root = null,
  onIntersect,
  threshold = [0.8],
  rootMargin = '0px 0px',
  isLoading = false,
}: UseIntersectionObserverProps): UseIntersectionObserverReturn => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);
  const onIntersectRef = useRef(onIntersect);

  useEffect(() => {
    onIntersectRef.current = onIntersect;
  }, [onIntersect]);

  useEffect(() => {
    if (isLoading || !elementRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries, observer) => onIntersectRef.current(entries, observer),
      { root, rootMargin, threshold },
    );

    observerRef.current.observe(elementRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [root, rootMargin, threshold, isLoading]);

  const sentinelRef = useCallback((node: HTMLElement | null) => {
    if (elementRef.current && observerRef.current) {
      observerRef.current.unobserve(elementRef.current);
    }

    elementRef.current = node;

    if (node && observerRef.current) {
      observerRef.current.observe(node);
    }
  }, []);

  return { sentinelRef };
};

export default useIntersectionObserver;
