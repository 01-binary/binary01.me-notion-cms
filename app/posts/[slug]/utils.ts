import { siteConfig } from 'site.config';

/**
 * Notion 페이지 속성에서 추출한 SEO 데이터
 */
export interface PostSEOData {
  title: string;
  description: string;
  keywords: string;
  coverUrl: string;
}

/**
 * Notion 페이지 속성 타입 (타입 안전성을 위한 명시적 정의)
 */
interface NotionPageProperties {
  Name?: string;
  Desc?: string;
  Category?: { name?: string };
  coverUrl?: string;
}

/**
 * Notion 페이지 속성에서 SEO 메타데이터를 추출합니다.
 *
 * @param properties - Notion API에서 반환된 페이지 속성
 * @param defaultTitle - 제목이 없을 경우 사용할 기본값
 * @returns SEO 메타데이터 객체
 */
export const extractPostMetadata = (
  properties: unknown,
  defaultTitle: string = 'Post',
): PostSEOData => {
  const props = properties as NotionPageProperties | null;

  return {
    title: props?.Name || defaultTitle,
    description: props?.Desc || siteConfig.seoDefaultDesc,
    keywords: props?.Category?.name || '',
    coverUrl: props?.coverUrl || '',
  };
};
