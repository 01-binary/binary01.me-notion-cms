import React from 'react';

import { Item } from '@/interfaces';

import CardList from '@/components/card/CardList';

interface Props {
  items: Item[];
}

const List = ({ items }: Props) => {
  return (
    <section>
      <div className="mx-auto flex w-4/5 max-w-5xl flex-col gap-6 py-8">
        <h3 className="text-3xl font-bold">Posts</h3>
        <CardList cardItems={items} />
        {/* pagination */}
      </div>
    </section>
  );
};

export default List;
