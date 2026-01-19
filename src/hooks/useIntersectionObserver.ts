import { useEffect, useRef } from 'react';

interface IntersectionObserverProps {
  root?: null | HTMLElement;
  rootMargin?: string;
  threshold?: number[] | number;
  onIntersect: IntersectionObserverCallback;
  isLoading?: boolean;
}

const useIntersectionObserver = ({
  root = null,
  onIntersect,
  threshold = [0.8],
  rootMargin = '0px 0px',
  isLoading = false,
}: IntersectionObserverProps) => {
  const entries = useRef<HTMLDivElement[]>([]);
  const onIntersectRef = useRef(onIntersect);

  // 콜백 ref를 최신 상태로 유지 (effect 재실행 없이)
  useEffect(() => {
    onIntersectRef.current = onIntersect;
  }, [onIntersect]);

  useEffect(() => {
    if (!entries.current.length || isLoading) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries, observer) => onIntersectRef.current(entries, observer),
      { root, rootMargin, threshold },
    );

    entries.current.forEach((target) => {
      if (target) observer.observe(target);
    });

    return () => {
      observer.disconnect();
    };
  }, [root, rootMargin, threshold, isLoading]);

  return entries;
};

export default useIntersectionObserver;
