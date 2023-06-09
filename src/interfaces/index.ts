import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

export interface Post {
  id: string;
  cover: string;
  icon: PageObjectResponse['icon'];
  category: Category | null;
  published: string;
  description: string;
  title: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}
