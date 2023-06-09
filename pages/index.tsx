import React from 'react';

import { GetStaticProps } from 'next';

import Intro from '@/features/home/Intro';
import List from '@/features/home/List';
import { Item } from '@/interfaces';
import { parseItems, getNotionDBItems } from '@/utils';

interface HomeProps {
  items: Item[];
}

const Home = ({ items }: HomeProps) => {
  return (
    <>
      <Intro />
      <List items={items} />
    </>
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
    revalidate: 300,
  };
};
