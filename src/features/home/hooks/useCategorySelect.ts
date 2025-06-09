import { useCallback, useEffect } from 'react';

import { useAtom, useSetAtom } from 'jotai';
import { RESET } from 'jotai/utils';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import { selectedCategoryAtom } from '@/atoms/categories';
import { postPageResettableAtom } from '@/atoms/posts';

import { INITIAL_CATEGORY } from '@/assets/constants';

const useCategorySelect = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedCategory, setSeletedCategory] = useAtom(selectedCategoryAtom);
  const setPostPage = useSetAtom(postPageResettableAtom);

  const handleClickCategory = useCallback(
    (target: string) => () => {
      if (selectedCategory === target) return;
      const currentQuery = new URLSearchParams(Array.from(searchParams.entries()));
      if (target === INITIAL_CATEGORY) {
        currentQuery.delete('category');
      } else {
        currentQuery.set('category', target);
      }
      const queryString = currentQuery.toString();
      router.replace(`${pathname}${queryString ? `?${queryString}` : ''}`);
      setPostPage(RESET);
    },
    [router, pathname, searchParams, selectedCategory, setPostPage],
  );

  useEffect(() => {
    // searchParams가 null이면 아직 초기 렌더링 중이거나 사용할 수 없는 상태
    if (searchParams === null) return;
    const categoryFromQuery = searchParams.get('category');
    setSeletedCategory(categoryFromQuery || INITIAL_CATEGORY);
  }, [searchParams, setSeletedCategory]);

  return { handleClickCategory };
};

export default useCategorySelect;
