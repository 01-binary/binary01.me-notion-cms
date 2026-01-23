import { SKELETON_BASE_CLASS } from '../_constants';

const imageContainerClassName = [
  'h-[190px] w-full rounded-2xl',
  'dark:shadow-[2px_2px_8px_4px_hsla(0,0%,0%,.3)]',
].join(' ');

const ulClassName = ['grid grid-cols-1 gap-8', 'md:grid-cols-2'].join(' ');

const PostCardSkeleton = () => {
  return (
    <li className="flex flex-col rounded-2xl">
      <div
        className={`
          ${SKELETON_BASE_CLASS}
          ${imageContainerClassName}
        `}
      />
      <div className="h-[6px]" />
      <section className="flex flex-col gap-1 p-[10px]">
        <div
          className={`
            ${SKELETON_BASE_CLASS}
            h-[34px] w-[85%]
          `}
        />
        <div
          className={`
            ${SKELETON_BASE_CLASS}
            mt-1 h-[20px] w-[60%]
          `}
        />
        <div className="h-2" />
        <div className="flex items-center gap-2">
          <div
            className={`
              ${SKELETON_BASE_CLASS}
              h-[22px] w-[70px] rounded-sm
            `}
          />
          <div
            className={`
              ${SKELETON_BASE_CLASS}
              h-[18px] w-[80px]
            `}
          />
        </div>
      </section>
    </li>
  );
};

const PostListSkeleton = () => {
  return (
    <section aria-label="포스트 목록 로딩 중">
      <div className="h-[74px]" />
      <section className="border-t border-[rgb(var(--color-border))] pt-4">
        <ul className={ulClassName}>
          {Array.from({ length: 4 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </ul>
      </section>
    </section>
  );
};

export default PostListSkeleton;
