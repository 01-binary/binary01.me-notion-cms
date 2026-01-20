'use client';

import { useHydrateAtoms } from 'jotai/utils';

import type { Category, PostMeta } from '@/interfaces';

import { categoriesAtom, postsAtom } from '../_atoms';
import HomeContent from './HomeContent';

interface HomeHydratorProps {
  posts: PostMeta[];
  categories: Category[];
}

/**
 * Server에서 받은 데이터로 Jotai atoms를 hydrate합니다.
 * Client boundary 역할을 담당합니다.
 */
const HomeHydrator = ({ posts, categories }: HomeHydratorProps) => {
  useHydrateAtoms([
    [postsAtom, posts],
    [categoriesAtom, categories],
  ]);

  return <HomeContent />;
};

export default HomeHydrator;
