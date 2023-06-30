import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { PreviewImage } from 'notion-types';

export interface Post {
  id: string;
  cover: string;
  icon: PageObjectResponse['icon'];
  category: Category | null;
  published: string;
  description: string;
  title: string;
  previewImage?: PreviewImage | null;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface HomeProps {
  posts: Post[];
  categories: Category[];
}
