import { useEffect, useMemo, useState } from 'react';

import { useIntersectionObserver } from '@/hooks';
import { Post } from '@/interfaces';

interface Props {
  rawData: Post[];
  rootMargin?: string;
  threshold?: number[] | number;
  pageSize?: number;
}

const INITIAL_PAGE = 0;

const useInfiniteScroll = ({ rawData, pageSize = 20 }: Props) => {
  const [page, setPage] = useState<number>(INITIAL_PAGE);
  const data = useMemo(
    () => rawData.slice(INITIAL_PAGE, (page + 1) * pageSize),
    [page, pageSize, rawData],
  );

  const entries = useIntersectionObserver({
    onIntersect: (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        setPage((prevPage) => prevPage + 1);
      });
    },
  });

  useEffect(() => {
    setPage(INITIAL_PAGE);
  }, [rawData]);

  return {
    entries,
    data,
  };
};

export default useInfiniteScroll;
