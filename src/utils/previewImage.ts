import lqip from 'lqip-modern';
import { ExtendedRecordMap, PreviewImage, PreviewImageMap } from 'notion-types';
import { getPageImageUrls } from 'notion-utils';
import { defaultMapImageUrl } from 'react-notion-x';

import { Post } from '@/interfaces';

export const makePreviewImage = async (url: string) => {
  try {
    const response = await fetch(url);
    const buffer = Buffer.from(await response.arrayBuffer());

    const {
      metadata: { dataURIBase64, originalHeight, originalWidth },
    } = await lqip(buffer);
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
  const postsWithPreview = Promise.all(
    posts.map(async (post) => {
      const { id, cover } = post;

      const previewImage = await makePreviewImage(cover);
      const coverFromNotion = `/api/coverImage?pageId=${id}`;
      return {
        ...post,
        previewImage,
        cover: coverFromNotion,
      };
    }),
  );

  return postsWithPreview;
};

export const getPreviewImageFromRecordMap = async (
  recordMap: ExtendedRecordMap,
): Promise<PreviewImageMap | undefined> => {
  const urls = getPageImageUrls(recordMap, {
    mapImageUrl: defaultMapImageUrl,
  });

  const previewImageMap = await Promise.all(
    urls.map(async (url) => [url, await makePreviewImage(url)]),
  );

  return Object.fromEntries(previewImageMap);
};
