import { useCallback, useEffect, useMemo, useState } from 'react';

import { useRouter } from 'next/router';

import { useInfiniteScroll } from '@/hooks';
import { Post } from '@/interfaces';

import { INITIAL_CATEGORY } from '@/assets/constants';

interface Props {
  posts: Post[];
}

const useHomeData = ({ posts }: Props) => {
  const router = useRouter();
  const [seletedCategory, setSeletedCategory] = useState<string>(INITIAL_CATEGORY);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const filteredPosts = useMemo(
    () =>
      seletedCategory === INITIAL_CATEGORY
        ? posts
        : posts.filter((post) => post.category?.name === seletedCategory),
    [posts, seletedCategory],
  );

  const { entries, data } = useInfiniteScroll({ rawData: filteredPosts });

  const handleClickCategory = useCallback(
    (target: string) => () => {
      if (target === INITIAL_CATEGORY) {
        router.replace('/', undefined, { shallow: true });
      } else {
        router.replace({ query: { ...router.query, category: target } }, undefined, {
          shallow: true,
        });
      }
    },
    [router],
  );

  useEffect(() => {
    if (!router.isReady) return;
    const { category } = router.query;
    setSeletedCategory((category as string) || INITIAL_CATEGORY);
    setIsLoading(false);
  }, [router, router.query]);

  return {
    entries,
    processedPosts: data,
    seletedCategory,
    handleClickCategory,
    isLoading,
  };
};

export default useHomeData;
