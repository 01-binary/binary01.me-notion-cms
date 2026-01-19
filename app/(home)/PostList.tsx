import React, { memo } from 'react';

import { useInfiniteScrollPostList } from './hooks';
import Post from './Post';

const PostList = () => {
  const { pagedPosts, entries } = useInfiniteScrollPostList();

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
              item={post}
            />
          ))}
        </ul>
      </section>
      <div
        ref={($elem) => {
          entries.current[0] = $elem as HTMLDivElement;
        }}
      />
    </>
  );
};

export default memo(PostList);
