'use client';

import type { PostMeta } from '@/interfaces';

import { useFilteredPosts } from '../_hooks';
import Post from './Post';

const ulClassName = ['grid grid-cols-1 gap-8', 'md:grid-cols-2'].join(' ');

interface PostListClientProps {
  initialPosts: PostMeta[];
}

const PostListClient = ({ initialPosts }: PostListClientProps) => {
  const { pagedPosts, sentinelRef } = useFilteredPosts(initialPosts);

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

export default PostListClient;
