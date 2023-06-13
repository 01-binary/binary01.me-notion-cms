import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Post } from '@/interfaces';

import { COLOR_TABLE } from '@/assets/constants';

interface Props {
  cardItem: Post;
}

const CardItem = ({ cardItem }: Props) => {
  const { cover, description, id, published, category, title } = cardItem;

  return (
    <li className="group flex flex-col rounded-2xl hover:bg-[hsla(44,6%,50%,.05)]">
      <Link href={`posts/${id}`}>
        <div className="relative h-[190px] w-full overflow-hidden rounded-2xl shadow-[2px_2px_8px_4px_hsla(0,0%,6%,.1)]">
          <Image
            src={cover}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105 group-hover:brightness-125"
          />
        </div>

        <section className="flex flex-col gap-1 p-[10px]">
          <h4 className="text-[28px] font-bold">{title}</h4>
          {description ? (
            <p className="text-[14px] font-medium text-[#37352F]">{description}</p>
          ) : null}
          <time className="text-[12px] font-normal text-[#37352F]">{published}</time>
          <div className="mt-2 flex items-center">
            <span
              className="rounded px-[6px] text-[12px]"
              style={{
                backgroundColor: category
                  ? COLOR_TABLE[category.color as keyof typeof COLOR_TABLE]
                  : COLOR_TABLE.default,
              }}
            >
              {category?.name}
            </span>
          </div>
        </section>
      </Link>
    </li>
  );
};

export default CardItem;
