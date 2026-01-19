'use client';

import Image from 'next/image';
import Link from 'next/link';
import { memo, useState } from 'react';
import { siteConfig } from 'site.config';

import { DEFAULT_BLUR_BASE64, getCategoryColor } from '@/assets/constants';
import type { PostMeta } from '@/interfaces';

import { useTiltEffect } from './hooks';

interface PostProps {
  item: PostMeta;
}

const Post = ({ item }: PostProps) => {
  const [hasImageLoadError, setHasImageLoadError] = useState(false);
  const { cover, description, published, category, title, slug, blurImage } = item;
  const { handleMouseMove, handleMouseLeave } = useTiltEffect();

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
        <div
          className="
            relative h-[190px] w-full overflow-hidden rounded-2xl
            shadow-[2px_2px_8px_4px_hsla(0,0%,6%,.1)]
          "
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {!hasImageLoadError ? (
            <Image
              className="
                object-cover transition-transform
                group-hover:scale-105 group-hover:brightness-125
              "
              src={cover}
              alt={title}
              fill
              placeholder="blur"
              blurDataURL={blurImage || DEFAULT_BLUR_BASE64}
              onError={() => setHasImageLoadError(true)}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-[28px] font-bold">{siteConfig.blogName}</span>
            </div>
          )}
        </div>
        <div className="h-[6px]" />
        <section className="flex flex-col gap-1 p-[10px]">
          <h4 className="text-[28px] leading-[34px] font-bold">{title}</h4>
          {description ? (
            <p className="text-[14px] font-normal text-[#37352F]">{description}</p>
          ) : null}
          <div className="h-2" />
          <div className="flex items-center gap-2">
            <span
              className="rounded-sm px-2 py-px text-[12px]"
              style={{ backgroundColor: getCategoryColor(category?.color) }}
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
