import React from 'react';

import { Item } from '@/interfaces';

import CardItem from '@/components/card/CardItem';

interface CardListProps {
  cardItems: Item[];
}

const CardList = ({ cardItems }: CardListProps) => {
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
