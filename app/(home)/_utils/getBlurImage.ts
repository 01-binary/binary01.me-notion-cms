import { cacheLife, cacheTag } from 'next/cache';
import { getPlaiceholder } from 'plaiceholder';

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
