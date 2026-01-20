import { siteConfig } from 'site.config';

export interface PostSEOData {
  title: string;
  description: string;
  keywords: string;
  coverUrl: string;
}

interface NotionPageProperties {
  Name?: string;
  Desc?: string;
  Category?: { name?: string };
  coverUrl?: string;
}

/**
 * Notion 페이지 속성에서 SEO 메타데이터를 추출합니다.
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
