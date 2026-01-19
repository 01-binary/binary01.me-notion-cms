import { atom } from 'jotai';
import { atomWithReset } from 'jotai/utils';

import { INITIAL_CATEGORY } from '@/assets/constants';
import type { Category, PostMeta } from '@/interfaces';

// Profile
export const profileImageAtom = atom<string>('');

// Categories
export const categoriesAtom = atom<Category[]>([]);
export const selectedCategoryAtom = atom<string>('');

// Posts
export const postsAtom = atom<PostMeta[]>([]);

export const postsFilterByCategoryAtom = atom<PostMeta[]>((get) => {
  const posts = get(postsAtom);
  const selectedCategory = get(selectedCategoryAtom);

  return selectedCategory === INITIAL_CATEGORY
    ? posts
    : posts.filter((post) => post.category.name === selectedCategory);
});

const INITIAL_PAGE = 0;

export const postPageResettableAtom = atomWithReset<number>(INITIAL_PAGE);
