import {
  MultiSelectPropertyItemObjectResponse,
  PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

export interface Item {
  id: string;
  cover: string;
  icon: PageObjectResponse['icon'];
  tags: MultiSelectPropertyItemObjectResponse['multi_select'];
  published: string;
  description: string;
  title: string;
}
