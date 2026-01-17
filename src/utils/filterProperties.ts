import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import { DEFAULT_CATEGORY_COLOR } from '@/assets/constants';
import { PageObjectResponse, PageProperties } from '@/interfaces';

dayjs.extend(localizedFormat);

export const filterCategoryProperties = (target: PageProperties) => {
  return target.type === 'multi_select'
    ? target.multi_select[0]
    : { id: '', name: '', color: DEFAULT_CATEGORY_COLOR };
};

export const filterDescSlugProperties = (target: PageProperties) => {
  return target.type === 'rich_text' && target.rich_text.length > 0
    ? target.rich_text[0].plain_text
    : '';
};

export const filterTitleProperties = (target: PageProperties) => {
  return target.type === 'title' && target.title.length > 0 ? target.title[0].plain_text : '';
};

export const filterCoverProperties = (target: PageObjectResponse['cover']) => {
  return target?.type === 'file' ? target.file.url : (target?.external.url ?? '');
};

export const filterDateProperties = (target: PageProperties) => {
  return target.type === 'date' ? dayjs(target.date?.start).format('LL') : '';
};
