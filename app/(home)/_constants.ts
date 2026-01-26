/** Notion 카테고리 색상을 Tailwind 배경색 클래스로 매핑 */
const BG_COLORS = {
  purple: 'bg-purple-200',
  yellow: 'bg-yellow-200',
  green: 'bg-green-200',
  blue: 'bg-blue-200',
  pink: 'bg-pink-200',
  brown: 'bg-stone-200',
  red: 'bg-red-200',
  orange: 'bg-orange-200',
  gray: 'bg-gray-200',
  default: 'bg-slate-200',
} as const;

/** Notion 카테고리 색상을 Tailwind 테두리색 클래스로 매핑 */
const BORDER_COLORS = {
  purple: 'border-purple-200',
  yellow: 'border-yellow-200',
  green: 'border-green-200',
  blue: 'border-blue-200',
  pink: 'border-pink-200',
  brown: 'border-stone-200',
  red: 'border-red-200',
  orange: 'border-orange-200',
  gray: 'border-gray-200',
  default: 'border-slate-200',
} as const;

type CategoryColor = keyof typeof BG_COLORS;

/** Notion 카테고리 색상 이름을 Tailwind 배경색 클래스로 변환합니다 */
export const getCategoryBgClass = (color: string | undefined): string =>
  BG_COLORS[color as CategoryColor] ?? BG_COLORS.default;

/** Notion 카테고리 색상 이름을 Tailwind 테두리색 클래스로 변환합니다 */
export const getCategoryBorderClass = (color: string | undefined): string =>
  BORDER_COLORS[color as CategoryColor] ?? BORDER_COLORS.default;

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
