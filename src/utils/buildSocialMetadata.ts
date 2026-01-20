import type { Metadata } from 'next';

interface SocialMetadataOptions {
  imageUrl?: string;
  pageUrl?: string;
}

/**
 * OpenGraph와 Twitter 메타데이터를 생성합니다.
 *
 * @param options.imageUrl - 소셜 미디어에 표시할 이미지 URL
 * @param options.pageUrl - 페이지의 canonical URL
 * @returns openGraph와 twitter 메타데이터 객체
 *
 * @example
 * const metadata = buildSocialMetadata({
 *   imageUrl: profileUrl,
 *   pageUrl: `${siteConfig.url}/about`,
 * });
 * // { openGraph: { images: [...], url: '...' }, twitter: { images: [...] } }
 */
export const buildSocialMetadata = ({
  imageUrl,
  pageUrl,
}: SocialMetadataOptions): Pick<Metadata, 'openGraph' | 'twitter'> => {
  return {
    openGraph: {
      ...(imageUrl && { images: [{ url: imageUrl }] }),
      ...(pageUrl && { url: pageUrl }),
    },
    twitter: {
      ...(imageUrl && { images: [imageUrl] }),
    },
  };
};
