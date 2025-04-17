import { getPlaiceholder } from 'plaiceholder';

const getBlurImage = async (imgSrc: string) => {
  try {
    const buffer = await fetch(imgSrc).then(async (res) => Buffer.from(await res.arrayBuffer()));
    const { base64 } = await getPlaiceholder(buffer, { size: 10 });
    return base64;
  } catch (e) {
    console.log(`[getBlurImage] 오류 발생: ${imgSrc}`, e);
    return '';
  }
};

export default getBlurImage;
