import { atom } from 'jotai';
import { atomWithReset } from 'jotai/utils';

import { selectedCategoryAtom } from '@/atoms/categories';
import { PostMeta } from '@/interfaces';

import { INITIAL_CATEGORY } from '@/assets/constants';

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
