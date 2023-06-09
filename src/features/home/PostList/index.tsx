import React from 'react';

import { Post } from '@/interfaces';

import CardList from '@/components/card/CardList';

interface Props {
  posts: Post[];
}

const List = ({ posts }: Props) => {
  return (
    <section className="mx-auto max-w-[900px]">
      <CardList cardItems={posts} />
    </section>
  );
};

export default List;
