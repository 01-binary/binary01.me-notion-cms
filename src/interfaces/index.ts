import {
  PageObjectResponse,
  MultiSelectPropertyItemObjectResponse,
  GetPageResponse,
} from 'notion-to-utils';

export type { PageObjectResponse, GetPageResponse };
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
}

export interface Category extends SelectPropertyResponse {
  count?: number;
}
