/**
 * Notion API 타입 및 블로그 도메인 타입 정의
 */
import { type GetPageResponse, type PageObjectResponse } from 'notion-to-utils';

export type { GetPageResponse, PageObjectResponse };

/** Notion select 속성의 값 타입 */
export interface SelectPropertyResponse {
  id: string;
  name: string;
  color: string;
}

/** Notion 페이지의 개별 속성 타입 (discriminated union) */
export type PageProperties = PageObjectResponse['properties'][string];

/** 블로그 포스트 메타데이터 */
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

/** 카테고리 (포스트 수 포함) */
export interface Category extends SelectPropertyResponse {
  count?: number;
}
