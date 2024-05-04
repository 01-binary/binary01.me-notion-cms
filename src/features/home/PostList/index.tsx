import React, { memo } from 'react';

import { usePostList } from '@/features/home/hooks';
import CardItem from '@/features/home/PostList/Post';

const PostList = () => {
  const { processedPosts, entries } = usePostList();

  return (
    <>
      <section className="mt-[74px] border-t-[1px] border-[#eee] pt-4">
        <ul className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {processedPosts.map((post) => (
            <CardItem
              key={post.id}
              cardItem={post}
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
