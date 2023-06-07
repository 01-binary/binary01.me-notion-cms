import React from 'react';

import Link from 'next/link';

import { Item } from '@/interfaces';

import { COLOR_TABLE } from '@/assets/constants';

interface Props {
  tagItem: Item['tags'][number];
}

const TagItem = ({ tagItem }: Props) => {
  const { name, color } = tagItem;

  return (
    <li>
      <Link
        href={`/tags/${name.toLowerCase()}`}
        className="block rounded-full px-2 py-1 text-sm font-light text-gray-800 transition-all hover:-translate-y-1 hover:underline hover:shadow-md"
        style={{
          backgroundColor: COLOR_TABLE[color],
        }}
      >
        #{name}
      </Link>
    </li>
  );
};

export default TagItem;
