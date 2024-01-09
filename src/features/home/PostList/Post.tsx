import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Post } from '@/interfaces';
import { siteConfig } from 'site.config';

import { COLOR_TABLE, DEFAULT_BLUR_BASE64 } from '@/assets/constants';

interface Props {
  cardItem: Post;
}

const Post = ({ cardItem }: Props) => {
  const [onError, setOnError] = useState<boolean>(false);
  const { cover, description, published, category, title, slug, previewImage } = cardItem;
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rotateY = calculate(e.offsetX, ref.current.offsetWidth);
      const rotateX = -calculate(e.offsetY, ref.current.offsetHeight);
      console.log(rotateY, rotateX);

      ref.current.style = `transform: perspective(350px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    ref.current?.addEventListener('mousemove', handleMouseMove);

    return () => {
      ref.current?.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <li className="group flex flex-col rounded-2xl hover:bg-[hsla(44,6%,50%,.05)]">
      <Link href={`posts/${slug}`}>
        <div
          className="relative h-[190px] w-full overflow-hidden rounded-2xl shadow-[2px_2px_8px_4px_hsla(0,0%,6%,.1)]"
          ref={ref}
        >
          {!onError ? (
            <Image
              className="object-cover transition-transform group-hover:scale-105 group-hover:brightness-125"
              src={cover}
              alt={title}
              fill
              placeholder="blur"
              blurDataURL={previewImage?.dataURIBase64 || DEFAULT_BLUR_BASE64}
              onError={() => setOnError(true)}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-[28px] font-bold">{siteConfig.blogName}</span>
            </div>
          )}
        </div>

        <section className="mt-[6px] flex flex-col gap-1 p-[10px]">
          <h4 className="text-[28px] font-bold leading-[34px]">{title}</h4>
          {description ? (
            <p className="text-[14px] font-normal text-[#37352F]">{description}</p>
          ) : null}
          <div className="mt-2 flex items-center gap-2">
            <span
              className="rounded px-2 py-[1px] text-[12px]"
              style={{
                backgroundColor: category
                  ? COLOR_TABLE[category.color as keyof typeof COLOR_TABLE]
                  : COLOR_TABLE.default,
              }}
            >
              {category?.name}
            </span>
            <time className="text-[12px] font-normal text-[#37352F]">{published}</time>
          </div>
        </section>
      </Link>
    </li>
  );
};

const calculate = (x: number, maxX: number) => {
  const intercept = 3;
  const [y1, y2, y3] = [intercept, 0, -intercept];

  const slope1 = (y2 - y1) / (maxX / 2);
  const slope2 = (y3 - y2) / (maxX / 2);

  if (x <= maxX / 2) {
    return slope1 * x + (y1 - slope1 * 0);
  } else {
    return slope2 * x + (y2 - slope2 * (maxX / 2));
  }
};

export default Post;
