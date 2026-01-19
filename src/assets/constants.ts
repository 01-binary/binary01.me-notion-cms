import { SelectColor } from '@/interfaces';

export const COLOR_TABLE = {
  purple: '#e9d5ff',
  yellow: '#fef9c3',
  green: '#bbf7d0',
  blue: '#bfdbfe',
  pink: '#fbcfe8',
  brown: '#eee0da',
  red: '#fecaca',
  orange: '#fed7aa',
  gray: '#f3f4f6',
  default: '#c8d6e5',
} as const;

export type CategoryColor = keyof typeof COLOR_TABLE;

/** 카테고리 색상을 안전하게 가져옵니다 */
export const getCategoryColor = (color: string | undefined): string =>
  COLOR_TABLE[color as CategoryColor] ?? COLOR_TABLE.default;

export const INITIAL_CATEGORY = 'All';

export const DEFAULT_CATEGORY_COLOR: SelectColor = 'default';

// Pagination
export const INITIAL_PAGE = 0;
export const DEFAULT_PAGE_SIZE = 8;

export const DEFAULT_BLUR_BASE64 =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNGM0Y0RjYiLz48L3N2Zz4=';
