'use client';

import { useAtomValue, useSetAtom } from 'jotai';
import { RESET } from 'jotai/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

import { INITIAL_CATEGORY } from '@/assets/constants';

import { postPageResettableAtom, selectedCategoryAtom } from '../atoms';

/**
 * 카테고리 클릭 핸들러를 생성합니다.
 * URL 쿼리를 업데이트하고, 포스트 페이지를 리셋합니다.
 *
 * @returns 카테고리 클릭 핸들러 함수를 반환합니다.
 *
 * 참고: URL → atom 동기화는 useSyncCategoryFromUrl에서 처리합니다.
 */
const useCategorySelect = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedCategory = useAtomValue(selectedCategoryAtom);
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

  return { handleClickCategory };
};

export default useCategorySelect;
