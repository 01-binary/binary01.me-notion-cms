import { cacheLife, cacheTag } from 'next/cache';
import { getPlaiceholder } from 'plaiceholder';
import { siteConfig } from 'site.config';

/**
 * Notion 이미지 프록시(www.notion.so/image)는 Node fetch의 기본 User-Agent("node")를
 * Cloudflare에서 403으로 차단하므로, 출처를 밝히는 User-Agent를 명시합니다.
 */
const USER_AGENT = `${siteConfig.blogName} (+${siteConfig.url})`;

/**
 * 이미지 URL에서 blur placeholder용 base64 문자열을 생성합니다.
 *
 * @param imgSrc - 원본 이미지 URL
 * @returns base64 인코딩된 blur 이미지, 실패 시 빈 문자열
 */
async function getBlurImage(imgSrc: string): Promise<string> {
  'use cache';
  cacheTag('blur-image');
  cacheLife('max');

  try {
    const res = await fetch(imgSrc, { headers: { 'user-agent': USER_AGENT } });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    const { base64 } = await getPlaiceholder(buffer, { size: 10 });
    return base64;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.log(`[getBlurImage] 오류 발생 (${reason}): ${imgSrc}`);
    return '';
  }
}

export default getBlurImage;
