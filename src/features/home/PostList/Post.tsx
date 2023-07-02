import Image from 'next/image';
import Link from 'next/link';

import { Post } from '@/interfaces';

import { BLOG_NAME, COLOR_TABLE, DEFAULT_BLUR_BASE64 } from '@/assets/constants';

interface Props {
  cardItem: Post;
}

const Post = ({ cardItem }: Props) => {
  const { cover, description, id, published, category, title, previewImage } = cardItem;
  return (
    <li className="group flex flex-col rounded-2xl hover:bg-[hsla(44,6%,50%,.05)]">
      <Link href={`posts/${id}`}>
        <div className="relative h-[190px] w-full overflow-hidden rounded-2xl shadow-[2px_2px_8px_4px_hsla(0,0%,6%,.1)]">
          {cover ? (
            <Image
              className="object-cover transition-transform group-hover:scale-105 group-hover:brightness-125"
              src={cover}
              alt={title}
              fill
              placeholder="blur"
              blurDataURL={previewImage?.dataURIBase64 || DEFAULT_BLUR_BASE64}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-[28px] font-bold">{BLOG_NAME}</span>
            </div>
          )}
        </div>

        <section className="flex flex-col gap-1 p-[10px]">
          <h4 className="text-[28px] font-bold">{title}</h4>
          {description ? (
            <p className="text-[14px] font-normal text-[#37352F]">{description}</p>
          ) : null}
          <div className="mt-2 flex items-center gap-2">
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
            <time className="text-[12px] font-normal text-[#37352F]">{published}</time>
          </div>
        </section>
      </Link>
    </li>
  );
};

export default Post;
