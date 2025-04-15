import { makePreviewImage } from 'notion-to-utils';

import { Post } from '@/interfaces';

export const getPreviewImages = async (posts: Post[]) => {
  const postsWithPreview = Promise.all(
    posts.map(async (post) => {
      const { id, cover } = post;

      const previewImage = await makePreviewImage(cover);
      const coverFromNotion = `/api/cover-image?pageId=${id}`;
      return {
        ...post,
        previewImage,
        cover: coverFromNotion,
      };
    }),
  );

  return postsWithPreview;
};
