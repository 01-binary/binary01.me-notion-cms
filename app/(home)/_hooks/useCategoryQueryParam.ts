'use client';

import { useSetAtom, useStore } from 'jotai';
import { RESET } from 'jotai/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';

import { INITIAL_CATEGORY } from '@/assets/constants';

import { postPageResettableAtom, selectedCategoryAtom } from '../_atoms';

/**
 * URL 쿼리 파라미터와 카테고리 상태를 양방향으로 동기화합니다.
 *
 * - URL → Atom: URL의 category 쿼리가 변경되면 selectedCategoryAtom을 업데이트
 * - Atom → URL: handleClickCategory로 카테고리 클릭 시 URL 업데이트
 *
 * URL을 Single Source of Truth로 사용합니다.
 */
const useCategoryQueryParam = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const store = useStore();

  const setSelectedCategory = useSetAtom(selectedCategoryAtom);
  const setPostPage = useSetAtom(postPageResettableAtom);

  // URL → Atom 동기화
  useEffect(() => {
    if (searchParams === null) return;
    const categoryFromQuery = searchParams.get('category');
    setSelectedCategory(categoryFromQuery || INITIAL_CATEGORY);
  }, [searchParams, setSelectedCategory]);

  // Atom → URL 업데이트 (store.get으로 명령형 읽기하여 불필요한 구독 방지)
  const handleClickCategory = useCallback(
    (target: string) => {
      const currentCategory = store.get(selectedCategoryAtom);
      if (currentCategory === target) return;

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
    [store, router, pathname, searchParams, setPostPage],
  );

  return { handleClickCategory };
};

export default useCategoryQueryParam;
