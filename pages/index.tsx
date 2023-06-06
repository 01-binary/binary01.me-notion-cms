import React from 'react';

import { GetStaticProps } from 'next';

import { parseItems, getNotionDBItems } from '@/utils';

import { Item } from '@/utils/parseItems';

interface HomeProps {
  databaseItems: Item[];
}

const Home = ({ databaseItems }: HomeProps) => {
  console.log('databaseItems :>> ', databaseItems);

  return <div>Home</div>;
};

export default Home;

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  if (!process.env.DATABASE_ID) throw new Error('DATABASE_ID is not defined');
  const databaseItems = await getNotionDBItems(process.env.DATABASE_ID);
  const parsedDatabaseItems = parseItems(databaseItems);

  return {
    props: {
      databaseItems: parsedDatabaseItems,
    },
  };
};
