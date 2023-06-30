import React from 'react';

import CardItem from '@/features/home/PostList/Post';
import { Post } from '@/interfaces';

interface Props {
  posts: Post[];
}

const PostList = ({ posts }: Props) => {
  return (
    <section className="mt-[74px] border-t-[1px] border-[#eee] pt-4">
      <ul className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {posts.map((post) => (
          <CardItem
            key={post.id}
            cardItem={post}
          />
        ))}
      </ul>
    </section>
  );
};

export default PostList;
