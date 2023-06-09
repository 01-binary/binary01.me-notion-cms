import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Post } from '@/interfaces';

import IconRenderer from '@/components/card/IconRenderer';
// import TagList from '@/components/tag/TagList';

interface Props {
  cardItem: Post;
}

const CardItem = ({ cardItem }: Props) => {
  const { cover, description, icon, id, published, tags, title } = cardItem;

  return (
    <li className="group flex flex-col overflow-hidden rounded-2xl shadow-lg">
      <Link
        href={`posts/${id}`}
        className="grow"
      >
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
          <time className="text-sm font-light text-gray-700">{published}</time>
        </div>
      </Link>
      {/* {tags.length > 0 ? <TagList tags={tags} /> : null} */}
    </li>
  );
};

export default CardItem;
