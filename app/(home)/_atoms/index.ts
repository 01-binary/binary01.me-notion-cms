import { atom } from 'jotai';
import { atomWithReset } from 'jotai/utils';

import { INITIAL_CATEGORY, INITIAL_PAGE } from '../_constants';

// 클라이언트 인터랙션 상태만 유지
export const selectedCategoryAtom = atom<string>(INITIAL_CATEGORY);
export const postPageResettableAtom = atomWithReset<number>(INITIAL_PAGE);
