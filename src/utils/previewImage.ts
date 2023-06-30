import got from 'got';
import lqip from 'lqip-modern';
import { PreviewImage } from 'notion-types';

import { Post } from '@/interfaces';

export const makePreviewImage = async (url: string) => {
  const buffer = await got(url, {
    responseType: 'buffer',
    resolveBodyOnly: true,
  });

  try {
    const {
      metadata: { dataURIBase64, originalHeight, originalWidth },
    } = await lqip(buffer as unknown as string);
    const result: PreviewImage = {
      dataURIBase64,
      originalHeight,
      originalWidth,
    };
    return result;
  } catch (error) {
    return null;
  }
};

export const getPreviewImages = async (posts: Post[]) => {
  const previewImage = Promise.all(
    posts.map(async (post) => {
      const { cover } = post;

      const previewImage = await makePreviewImage(cover);

      return {
        ...post,
        previewImage,
      };
    }),
  );

  return previewImage;
};
