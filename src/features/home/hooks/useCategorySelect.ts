import { useCallback, useEffect } from 'react';

import { useSetAtom } from 'jotai';
import { useRouter } from 'next/router';

import { selectedCategoryAtom } from '@/atoms/categories';

import { INITIAL_CATEGORY } from '@/assets/constants';

const useCategorySelect = () => {
  const router = useRouter();
  const setSeletedCategory = useSetAtom(selectedCategoryAtom);

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
  }, [router.isReady, router.query, setSeletedCategory]);

  return { handleClickCategory };
};

export default useCategorySelect;
