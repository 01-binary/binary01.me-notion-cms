'use client';

import { useInfiniteScrollPostList } from '../_hooks';
import Post from './Post';

const ulClassName = ['grid grid-cols-1 gap-8', 'md:grid-cols-2'].join(' ');

const PostList = () => {
  const { pagedPosts, sentinelRef } = useInfiniteScrollPostList();

  return (
    <>
      <div className="h-[74px]" />
      <section className="border-t border-[rgb(var(--color-border))] pt-4">
        <ul className={ulClassName}>
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
