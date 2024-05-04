import { atom } from 'jotai';

import { Post } from '@/interfaces';

export const postsAtom = atom<Post[]>([]);
