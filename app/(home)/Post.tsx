import Link from 'next/link';
import { memo } from 'react';

import { COLOR_TABLE } from '@/assets/constants';
import type { PostMeta } from '@/interfaces';

import PostCoverImage from './PostCoverImage';

interface PostProps {
  item: PostMeta;
}

const Post = ({ item }: PostProps) => {
  const { cover, description, published, category, title, slug, blurImage } = item;

  return (
    <li
      className="
        group flex flex-col rounded-2xl
        hover:bg-[hsla(44,6%,50%,.05)]
      "
    >
      <Link
        href={`posts/${slug}`}
        prefetch={false}
      >
        <PostCoverImage
          src={cover}
          alt={title}
          blurDataURL={blurImage}
        />
        <div className="h-[6px]" />
        <section className="flex flex-col gap-1 p-[10px]">
          <h4 className="text-[28px] leading-[34px] font-bold">{title}</h4>
          {description ? (
            <p className="text-[14px] font-normal text-[#37352F]">{description}</p>
          ) : null}
          <div className="h-2" />
          <div className="flex items-center gap-2">
            <span
              className="rounded-sm bg-(--category-bg) px-2 py-px text-[12px]"
              style={
                {
                  '--category-bg': category
                    ? COLOR_TABLE[category.color as keyof typeof COLOR_TABLE]
                    : COLOR_TABLE.default,
                } as React.CSSProperties
              }
            >
              {category.name}
            </span>
            <time className="text-[12px] font-normal text-[#37352F]">{published}</time>
          </div>
        </section>
      </Link>
    </li>
  );
};

export default memo(Post);
