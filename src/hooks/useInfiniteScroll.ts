import { useEffect, useMemo, useState } from 'react';

import { useIntersectionObserver } from '@/hooks';
import { Post } from '@/interfaces';

interface Props {
  data: Post[];
  initFlag?: string | number | boolean;
  pageSize?: number;
  rootMargin?: string;
  threshold?: number[] | number;
}

const INITIAL_PAGE = 0;
const DEFAULT_PAGE_SIZE = 8;

const useInfiniteScroll = ({
  data,
  initFlag,
  pageSize = DEFAULT_PAGE_SIZE,
  rootMargin,
  threshold,
}: Props) => {
  const [page, setPage] = useState<number>(INITIAL_PAGE);
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
        setPage((prevPage) => prevPage + 1);
      });
    },
  });

  useEffect(() => {
    setPage(INITIAL_PAGE);
  }, [initFlag]);

  return {
    entries,
    pagedData,
  };
};

export default useInfiniteScroll;
