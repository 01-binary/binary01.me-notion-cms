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

const isNotionPageProperties = (obj: unknown): obj is NotionPageProperties => {
  return typeof obj === 'object' && obj !== null;
};

/**
 * Notion 페이지 속성에서 SEO 메타데이터를 추출합니다.
 */
export const extractPostMetadata = (
  properties: unknown,
  defaultTitle: string = 'Post',
): PostSEOData => {
  if (!isNotionPageProperties(properties)) {
    return {
      title: defaultTitle,
      description: siteConfig.seoDefaultDesc,
      keywords: '',
      coverUrl: '',
    };
  }

  return {
    title: properties.Name || defaultTitle,
    description: properties.Desc || siteConfig.seoDefaultDesc,
    keywords: properties.Category?.name || '',
    coverUrl: properties.coverUrl || '',
  };
};
