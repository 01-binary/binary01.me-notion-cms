import { atom } from 'jotai';
import { atomWithReset } from 'jotai/utils';

import { INITIAL_CATEGORY, INITIAL_PAGE } from '@/assets/constants';
import type { Category, PostMeta } from '@/interfaces';

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

export const postPageResettableAtom = atomWithReset<number>(INITIAL_PAGE);
