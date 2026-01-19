'use client';

import { useSetAtom } from 'jotai';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { INITIAL_CATEGORY } from '@/assets/constants';

import { selectedCategoryAtom } from '../atoms';

/**
 * URL 쿼리 파라미터의 category 값을 atom 상태와 동기화합니다.
 *
 * URL을 Single Source of Truth로 사용하며,
 * category 쿼리 파라미터가 변경되면 selectedCategoryAtom을 업데이트합니다.
 */
const useSyncCategoryFromUrl = () => {
  const searchParams = useSearchParams();
  const setSelectedCategory = useSetAtom(selectedCategoryAtom);

  useEffect(() => {
    if (searchParams === null) return;
    const categoryFromQuery = searchParams.get('category');
    setSelectedCategory(categoryFromQuery || INITIAL_CATEGORY);
  }, [searchParams, setSelectedCategory]);
};

export default useSyncCategoryFromUrl;
