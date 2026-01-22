import pMap from 'p-map';

import type { PostMeta } from '@/interfaces';
import { getCachedPostsMeta } from '@/utils/fetchNotionPostsMeta';

import { getBlurImage } from '../_utils';
import PostListClient from './PostListClient';

const PostListServer = async () => {
  const allPostsMeta = await getCachedPostsMeta();

  const posts = await pMap(
    allPostsMeta,
    async (post: PostMeta) => {
      const blurImage = await getBlurImage(post.cover);
      return { ...post, blurImage };
    },
    { concurrency: 10 },
  );

  return <PostListClient initialPosts={posts} />;
};

export default PostListServer;
