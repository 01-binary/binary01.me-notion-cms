import {
  GetPageResponse,
  MultiSelectPropertyItemObjectResponse,
  PageObjectResponse,
} from 'notion-to-utils';

export type { GetPageResponse, PageObjectResponse };
export type SelectPropertyResponse = MultiSelectPropertyItemObjectResponse['multi_select'][number];
export type SelectColor = SelectPropertyResponse['color'];

export type PageProperties = PageObjectResponse['properties'][string];

export interface PostMeta {
  id: string;
  cover: string;
  icon: PageObjectResponse['icon'];
  category: Category;
  published: string;
  description: string;
  title: string;
  slug: string;
  blurImage?: string;
}

export interface Category extends SelectPropertyResponse {
  count?: number;
}
