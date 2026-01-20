'use client';

import { useInfiniteScrollPostList } from '../_hooks';
import Post from './Post';

const PostList = () => {
  const { pagedPosts, sentinelRef } = useInfiniteScrollPostList();

  return (
    <>
      <div className="h-[74px]" />
      <section className="border-t border-[#eee] pt-4">
        <ul
          className="
            grid grid-cols-1 gap-8
            md:grid-cols-2
          "
        >
          {pagedPosts.map((post) => (
            <Post
              key={post.id}
              post={post}
            />
          ))}
        </ul>
      </section>
      <div ref={sentinelRef} />
    </>
  );
};

export default PostList;
