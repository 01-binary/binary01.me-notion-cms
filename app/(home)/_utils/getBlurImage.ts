import { cacheLife, cacheTag } from 'next/cache';
import { getPlaiceholder } from 'plaiceholder';

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
    const res = await fetch(imgSrc);
    const buffer = Buffer.from(await res.arrayBuffer());
    const { base64 } = await getPlaiceholder(buffer, { size: 10 });
    return base64;
  } catch {
    console.log(`[getBlurImage] 오류 발생: ${imgSrc}`);
    return '';
  }
}

export default getBlurImage;
