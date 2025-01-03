import {
  PageObjectResponse,
  MultiSelectPropertyItemObjectResponse,
  GetPageResponse,
} from 'notion-to-utils';

import { PreviewImage } from '@/interfaces/notion';

export type { PageObjectResponse, GetPageResponse };
export type SelectPropertyResponse = MultiSelectPropertyItemObjectResponse['multi_select'][number];
export type SelectColor = SelectPropertyResponse['color'];

export type PageProperties = PageObjectResponse['properties'][string];

export interface Post {
  id: string;
  cover: string;
  icon: PageObjectResponse['icon'];
  category: Category;
  published: string;
  description: string;
  title: string;
  slug: string;
  previewImage?: PreviewImage | null;
}

export type SlugAndDate = Pick<Post, 'slug' | 'published'>;
export interface Category extends SelectPropertyResponse {
  count?: number;
}
