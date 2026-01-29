'use client';

import { useSetAtom } from 'jotai';
import { useRef } from 'react';

import type { PostMeta } from '@/interfaces';

import { postPageResettableAtom } from '../_atoms';
import { useFilteredPagedPosts } from '../_hooks';
import useIntersectionObserver from '../_hooks/useIntersectionObserver';
import Post from './Post';

const ulClassName = ['grid grid-cols-1 gap-8', 'md:grid-cols-2'].join(' ');

const LoadMoreTrigger = ({ onLoadMore }: { onLoadMore: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);

  useIntersectionObserver(ref, {
    onIntersect: (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        onLoadMore();
      }
    },
  });

  return <div ref={ref} />;
};

interface PostListClientProps {
  initialPosts: PostMeta[];
}

const PostListClient = ({ initialPosts }: PostListClientProps) => {
  const pagedPosts = useFilteredPagedPosts(initialPosts);
  const setPostPage = useSetAtom(postPageResettableAtom);

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
      <LoadMoreTrigger onLoadMore={() => setPostPage((prev) => prev + 1)} />
    </>
  );
};

export default PostListClient;
