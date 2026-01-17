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
  const entries = useRef<HTMLDivElement[] | []>([]);

  useEffect(() => {
    if (!entries || isLoading) {
      return undefined;
    }
    const observer: IntersectionObserver = new IntersectionObserver(onIntersect, {
      root,
      rootMargin,
      threshold,
    });
    entries.current?.forEach((target) => {
      observer.observe(target);
    });

    return () => {
      observer.disconnect();
    };
     
  }, [entries, isLoading]);

  return entries;
};

export default useIntersectionObserver;
