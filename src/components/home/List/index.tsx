import React from 'react';

import { Item } from '@/interfaces';

import CardList from '@/components/card/CardList';

interface Props {
  items: Item[];
}

const List = ({ items }: Props) => {
  return (
    <section className="mx-auto max-w-[900px]">{/* <CardList cardItems={items} /> */}</section>
  );
};

export default List;
