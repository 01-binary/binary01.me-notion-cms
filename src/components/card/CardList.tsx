import React from 'react';

import { Post } from '@/interfaces';

import CardItem from '@/components/card/CardItem';

interface Props {
  cardItems: Post[];
}

const CardList = ({ cardItems }: Props) => {
  if (cardItems.length === 0)
    return <div className="text-center text-2xl font-bold">No items found!</div>;

  return (
    <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {cardItems.map((cardItem) => (
        <CardItem
          key={cardItem.id}
          cardItem={cardItem}
        />
      ))}
    </ul>
  );
};

export default CardList;
