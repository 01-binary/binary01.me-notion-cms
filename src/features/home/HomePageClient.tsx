'use client';

import { useHydrateAtoms } from 'jotai/utils';

import { categoriesAtom } from '@/atoms/categories';
import { postsAtom } from '@/atoms/posts';
import { profileImageAtom } from '@/atoms/profile';
import Home from '@/features/home';
import type { Category, PostMeta } from '@/interfaces';

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
