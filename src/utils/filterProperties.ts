import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import { DEFAULT_CATEGORY_COLOR } from '@/assets/constants';
import { PageObjectResponse, PageProperties } from '@/interfaces';

dayjs.extend(localizedFormat);

/**
 * Notion multi_select 속성에서 첫 번째 카테고리를 추출합니다.
 *
 * 블로그 디자인상 포스트당 하나의 카테고리만 표시하므로,
 * Notion에서 여러 카테고리를 선택해도 첫 번째만 사용합니다.
 *
 * @param target - Notion 페이지 속성 객체
 * @returns 카테고리 객체 (id, name, color) 또는 기본값
 *
 * @example
 * // multi_select 속성인 경우
 * filterCategoryProperties({ type: 'multi_select', multi_select: [{ id: '1', name: 'React', color: 'blue' }] });
 * // { id: '1', name: 'React', color: 'blue' }
 *
 * @example
 * // 빈 속성이거나 다른 타입인 경우
 * filterCategoryProperties({ type: 'rich_text', rich_text: [] });
 * // { id: '', name: '', color: 'default' }
 */
export const filterCategoryProperties = (target: PageProperties) => {
  return target.type === 'multi_select'
    ? target.multi_select[0]
    : { id: '', name: '', color: DEFAULT_CATEGORY_COLOR };
};

/**
 * Notion rich_text 속성에서 plain text를 추출합니다.
 * 주로 description이나 slug 필드에 사용됩니다.
 *
 * @param target - Notion 페이지 속성 객체
 * @returns 텍스트 문자열 또는 빈 문자열
 */
export const filterDescSlugProperties = (target: PageProperties) => {
  return target.type === 'rich_text' && target.rich_text.length > 0
    ? target.rich_text[0].plain_text
    : '';
};

/**
 * Notion title 속성에서 제목 텍스트를 추출합니다.
 *
 * @param target - Notion 페이지 속성 객체
 * @returns 제목 문자열 또는 빈 문자열
 */
export const filterTitleProperties = (target: PageProperties) => {
  return target.type === 'title' && target.title.length > 0 ? target.title[0].plain_text : '';
};

/**
 * Notion 커버 이미지 URL을 추출합니다.
 * Notion 내부 파일과 외부 URL을 모두 지원합니다.
 *
 * @param target - Notion 페이지의 cover 객체
 * @returns 이미지 URL 또는 빈 문자열
 */
export const filterCoverProperties = (target: PageObjectResponse['cover']) => {
  return target?.type === 'file' ? target.file.url : (target?.external.url ?? '');
};

/**
 * Notion date 속성에서 날짜를 포맷팅합니다.
 * dayjs의 localizedFormat 플러그인을 사용하여 'LL' 형식으로 출력합니다.
 *
 * @param target - Notion 페이지 속성 객체
 * @returns 포맷팅된 날짜 문자열 (예: "January 20, 2026") 또는 빈 문자열
 */
export const filterDateProperties = (target: PageProperties) => {
  return target.type === 'date' ? dayjs(target.date?.start).format('LL') : '';
};
