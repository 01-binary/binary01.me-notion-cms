import React from 'react';

import Link from 'next/link';

import { Item } from '@/interfaces';

import { COLOR_TABLE } from '@/assets/constants';

interface TagItemProps {
  tagItem: Item['tags'][number];
}

const TagItem = ({ tagItem }: TagItemProps) => {
  const { name, color } = tagItem;

  return (
    <li>
      <Link
        href={`tag/${name.toLowerCase()}`}
        className="rounded-full px-2 py-1 font-light hover:underline"
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
