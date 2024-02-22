import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localizedFormat);

import { PageObjectResponse, PageProperties } from '@/interfaces';

export const filterCategoryProperties = (target: PageProperties) => {
  return target.type === 'multi_select' ? target.multi_select[0] : null;
};

export const filterDescSlugProperties = (target: PageProperties) => {
  return target.type === 'rich_text' ? target.rich_text[0].plain_text : '';
};

export const filterTitleProperties = (target: PageProperties) => {
  return target.type === 'title' ? target.title[0].plain_text : '';
};

export const filterCoverProperties = (target: PageObjectResponse['cover']) => {
  return target?.type === 'file' ? target.file.url : target?.external.url ?? '';
};

export const filterDateProperties = (target: PageProperties) => {
  return target.type === 'date' ? dayjs(target.date?.start).format('LL') : '';
};
