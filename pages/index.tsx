import React from 'react';

import { GetStaticProps } from 'next';

import { Item } from '@/interfaces';
import { parseItems, getNotionDBItems } from '@/utils';

import Intro from '@/components/home/Intro';
import List from '@/components/home/List';

interface HomeProps {
  items: Item[];
}

const Home = ({ items }: HomeProps) => {
  return (
    <div>
      <Intro />
      <List items={items} />
    </div>
  );
};

export default Home;

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  if (!process.env.NOTION_DATABASE_ID) throw new Error('NOTION_DATABASE_ID is not defined');
  const databaseItems = await getNotionDBItems(process.env.NOTION_DATABASE_ID);
  const items = parseItems(databaseItems);

  return {
    props: {
      items,
    },
  };
};
