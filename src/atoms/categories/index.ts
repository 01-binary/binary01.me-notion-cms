import { atom } from 'jotai';

import { Category } from '@/interfaces';

export const categoriesAtom = atom<Category[]>([]);
