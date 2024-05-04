import { useCallback, useEffect } from 'react';

import { useAtom, useSetAtom } from 'jotai';
import { RESET } from 'jotai/utils';
import { useRouter } from 'next/router';

import { selectedCategoryAtom } from '@/atoms/categories';
import { postPageResettableAtom } from '@/atoms/posts';

import { INITIAL_CATEGORY } from '@/assets/constants';

const useCategorySelect = () => {
  const router = useRouter();
  const [selectedCategory, setSeletedCategory] = useAtom(selectedCategoryAtom);
  const setPostPage = useSetAtom(postPageResettableAtom);

  const handleClickCategory = useCallback(
    (target: string) => () => {
      if (selectedCategory === target) return;
      router.replace(
        target === INITIAL_CATEGORY ? '/' : { query: { ...router.query, category: target } },
        undefined,
        { shallow: true },
      );
      setPostPage(RESET);
    },
    [router, selectedCategory, setPostPage],
  );

  useEffect(() => {
    if (!router.isReady) return;
    const { category } = router.query;
    setSeletedCategory((category as string) || INITIAL_CATEGORY);
  }, [router.isReady, router.query, setSeletedCategory]);

  return { handleClickCategory };
};

export default useCategorySelect;
