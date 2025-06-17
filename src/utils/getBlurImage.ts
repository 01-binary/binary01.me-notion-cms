import { unstable_cache } from 'next/cache';
import { getPlaiceholder } from 'plaiceholder';

const getBlurImage = unstable_cache(
  async (imgSrc: string) => {
    try {
      // fetch is automatically cached by Next.js
      const res = await fetch(imgSrc);
      const buffer = Buffer.from(await res.arrayBuffer());
      const { base64 } = await getPlaiceholder(buffer, { size: 10 });
      return base64;
    } catch (e) {
      console.log(`[getBlurImage] 오류 발생: ${imgSrc}`);
      return '';
    }
  },
  ['blur-images'], // A unique cache key prefix for this function
  {
    revalidate: false, // This means the cache is indefinite until the next deployment
  },
);

export default getBlurImage;
