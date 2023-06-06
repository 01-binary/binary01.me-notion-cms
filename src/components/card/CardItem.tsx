import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Item } from '@/interfaces';

import IconRenderer from '@/components/card/IconRenderer';

interface CardItemProps {
  cardItem: Item;
}

const CardItem = ({ cardItem }: CardItemProps) => {
  const { cover, description, icon, id, published, tags, title } = cardItem;

  return (
    <li className="group overflow-hidden rounded-2xl shadow-lg">
      <Link href={`blog/${id}`}>
        <a>
          <div className="relative aspect-[1.3/1]">
            <Image
              src={cover}
              alt={title}
              fill
              className="transition-transform group-hover:scale-105"
            />
          </div>

          <div className="flex flex-col gap-5 p-6">
            <h4 className="flex flex-row items-center gap-1 text-2xl font-bold transition-colors group-hover:text-blue-500">
              <IconRenderer icon={icon} />
              {title}
            </h4>
            {description ? <p className="font-medium text-gray-600">{description}</p> : null}
            <time className="font-medium text-gray-700">{published}</time>
          </div>
        </a>
      </Link>
      {/* tags */}
    </li>
  );
};

export default CardItem;
