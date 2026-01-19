'use client';

import { useHydrateAtoms } from 'jotai/utils';

import type { Category, PostMeta } from '@/interfaces';

import { categoriesAtom, postsAtom } from './atoms';
import Home from './Home';

interface HomePageClientProps {
  posts: PostMeta[];
  categories: Category[];
}

const HomePageClient = ({ posts, categories }: HomePageClientProps) => {
  useHydrateAtoms([
    [postsAtom, posts],
    [categoriesAtom, categories],
  ]);

  return <Home />;
};

export default HomePageClient;
