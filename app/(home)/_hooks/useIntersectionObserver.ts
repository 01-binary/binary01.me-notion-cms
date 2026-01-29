import type { RefObject } from 'react';
import { useEffect } from 'react';

const DEFAULT_THRESHOLD: number[] = [0.8];

interface UseIntersectionObserverOptions {
  root?: null | HTMLElement;
  rootMargin?: string;
  threshold?: number[] | number;
  onIntersect: IntersectionObserverCallback;
  isLoading?: boolean;
}

/**
 * IntersectionObserver를 사용하여 요소의 가시성을 감지합니다.
 *
 * @param ref - 관찰할 요소의 ref
 * @param options.onIntersect - 요소가 뷰포트에 들어올 때 호출되는 콜백
 * @param options.threshold - 콜백을 트리거할 가시성 임계값 (0-1)
 * @param options.rootMargin - root 요소의 마진
 * @param options.isLoading - 로딩 중일 때 observer를 일시 중지
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * useIntersectionObserver(ref, {
 *   onIntersect: (entries) => {
 *     if (entries[0].isIntersecting) loadMore();
 *   },
 * });
 *
 * return <div ref={ref} />;
 */
const useIntersectionObserver = (
  ref: RefObject<HTMLElement | null>,
  {
    root = null,
    onIntersect,
    threshold = DEFAULT_THRESHOLD,
    rootMargin = '0px 0px',
    isLoading = false,
  }: UseIntersectionObserverOptions,
): void => {
  useEffect(() => {
    if (isLoading || !ref.current) return;

    const observer = new IntersectionObserver(onIntersect, {
      root,
      rootMargin,
      threshold,
    });

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, root, rootMargin, threshold, isLoading, onIntersect]);
};

export default useIntersectionObserver;
