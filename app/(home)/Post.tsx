import Image from 'next/image';
import Link from 'next/link';
import { memo, useCallback, useState } from 'react';
import { siteConfig } from 'site.config';

import { COLOR_TABLE, DEFAULT_BLUR_BASE64 } from '@/assets/constants';
import { PostMeta as Item } from '@/interfaces';

/** 최대 틸트 각도 (degrees) */
const MAX_TILT_ANGLE = 3;

/**
 * 마우스 위치에 따른 3D 틸트 회전 각도를 계산합니다.
 */
const calculateTiltAngle = (mousePosition: number, containerSize: number): number => {
  const halfSize = containerSize / 2;
  const leftSlope = -MAX_TILT_ANGLE / halfSize;
  const rightSlope = -MAX_TILT_ANGLE / halfSize;

  if (mousePosition <= halfSize) {
    return MAX_TILT_ANGLE + leftSlope * mousePosition;
  } else {
    return rightSlope * (mousePosition - halfSize);
  }
};

/** 3D 카드 효과를 위한 perspective 값 (px) */
const CARD_PERSPECTIVE = 350;

interface Props {
  item: Item;
}

const Post = ({ item }: Props) => {
  const [onError, setOnError] = useState<boolean>(false);
  const { cover, description, published, category, title, slug, blurImage } = item;

  /** 마우스 이동 시 3D 틸트 효과 적용 */
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const rotateY = calculateTiltAngle(e.nativeEvent.offsetX, target.offsetWidth);
    const rotateX = -calculateTiltAngle(e.nativeEvent.offsetY, target.offsetHeight);
    target.style.transform = `perspective(${CARD_PERSPECTIVE}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }, []);

  /** 마우스가 벗어나면 카드 원위치 */
  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = `perspective(${CARD_PERSPECTIVE}px) rotateX(0deg) rotateY(0deg)`;
  }, []);

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
          {!onError ? (
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
              onError={() => setOnError(true)}
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
              style={{
                backgroundColor: category
                  ? COLOR_TABLE[category.color as keyof typeof COLOR_TABLE]
                  : COLOR_TABLE.default,
              }}
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
