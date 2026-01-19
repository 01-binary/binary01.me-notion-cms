'use client';

import { useHydrateAtoms } from 'jotai/utils';

import type { Category, PostMeta } from '@/interfaces';

import { categoriesAtom, postsAtom, profileImageAtom } from './atoms';
import Home from './Home';

interface HomePageClientProps {
  profileUrl: string;
  posts: PostMeta[];
  categories: Category[];
}

const HomePageClient = ({ profileUrl, posts, categories }: HomePageClientProps) => {
  useHydrateAtoms([
    [profileImageAtom, profileUrl],
    [postsAtom, posts],
    [categoriesAtom, categories],
  ]);

  return <Home />;
};

export default HomePageClient;
