'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { siteConfig } from 'site.config';

import type { PostMeta } from '@/interfaces';

import { DEFAULT_BLUR_BASE64, getCategoryBgClass } from '../_constants';
import { useTiltEffect } from '../_hooks';

interface PostProps {
  post: PostMeta;
}

const liClassName = [
  'group flex flex-col rounded-2xl',
  'hover:bg-[hsla(44,6%,50%,.05)] dark:hover:bg-[hsla(0,0%,100%,.05)]',
].join(' ');

const imageContainerClassName = [
  'relative h-[190px] w-full overflow-hidden rounded-2xl',
  'shadow-[2px_2px_8px_4px_hsla(0,0%,6%,.1)]',
  'dark:shadow-[2px_2px_8px_4px_hsla(0,0%,0%,.3)]',
].join(' ');

const imageClassName = [
  'object-cover transition-transform',
  'group-hover:scale-105 group-hover:brightness-125',
].join(' ');

const descriptionClassName = [
  'text-[14px] font-normal text-[rgb(var(--color-text-secondary))]',
].join(' ');

const timeClassName = ['text-[12px] font-normal text-[rgb(var(--color-text-secondary))]'].join(' ');

const Post = ({ post }: PostProps) => {
  const [hasImageLoadError, setHasImageLoadError] = useState(false);
  const { cover, description, published, category, title, slug, blurImage } = post;
  const { handleMouseMove, handleMouseLeave } = useTiltEffect();

  return (
    <li className={liClassName}>
      <Link
        href={`posts/${slug}`}
        prefetch={false}
      >
        <div
          className={imageContainerClassName}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {!hasImageLoadError ? (
            <Image
              className={imageClassName}
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
          {description ? <p className={descriptionClassName}>{description}</p> : null}
          <div className="h-2" />
          <div className="flex items-center gap-2">
            <span
              className={`
                rounded-sm px-2 py-px text-[12px] text-gray-800
                ${getCategoryBgClass(category?.color)}
              `}
            >
              {category.name}
            </span>
            <time className={timeClassName}>{published}</time>
          </div>
        </section>
      </Link>
    </li>
  );
};

export default Post;
