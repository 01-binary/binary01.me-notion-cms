import React from 'react';

import { Item } from '@/interfaces';

import CardItem from '@/components/card/CardItem';

interface CardListProps {
  cardItems: Item[];
}

const CardList = ({ cardItems }: CardListProps) => {
  return (
    <ul className="flex flex-col gap-8">
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
