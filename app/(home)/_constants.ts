/** Notion 카테고리 색상을 HEX 코드로 매핑 */
const COLOR_TABLE = {
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

type CategoryColor = keyof typeof COLOR_TABLE;

/** Notion 카테고리 색상 이름을 HEX 코드로 변환합니다 */
export const getCategoryColor = (color: string | undefined): string =>
  COLOR_TABLE[color as CategoryColor] ?? COLOR_TABLE.default;

/** 카테고리 필터 초기값 ('All' = 전체 보기) */
export const INITIAL_CATEGORY = 'All';

/** 무한 스크롤 시작 페이지 */
export const INITIAL_PAGE = 0;

/** 한 페이지당 표시할 포스트 수 */
export const DEFAULT_PAGE_SIZE = 8;

/** 이미지 로딩 전 표시할 blur placeholder (1x1 회색 픽셀) */
export const DEFAULT_BLUR_BASE64 =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNGM0Y0RjYiLz48L3N2Zz4=';

/** 스켈레톤 컴포넌트 공통 스타일 */
export const SKELETON_BASE_CLASS = 'animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700';
