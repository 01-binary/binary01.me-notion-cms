const skeletonClassName = ['animate-pulse rounded-lg', 'bg-gray-200 dark:bg-gray-700'].join(' ');

const IntroSkeleton = () => {
  return (
    <section aria-label="프로필 로딩 중">
      <article
        className="
          flex gap-4
          md:gap-6
        "
      >
        <div
          className={`
            ${skeletonClassName}
            size-[110px] rounded-full
          `}
        />
        <section className="flex flex-col justify-around gap-1">
          <section className="flex flex-col gap-2">
            <div
              className={`
                ${skeletonClassName}
                h-[34px] w-[120px]
              `}
            />
            <div
              className={`
                ${skeletonClassName}
                h-[24px] w-[200px]
              `}
            />
          </section>
          <section className="flex items-center gap-3">
            <div
              className={`
                ${skeletonClassName}
                size-[26px] rounded-full
              `}
            />
            <div
              className={`
                ${skeletonClassName}
                size-[26px] rounded-full
              `}
            />
            <div
              className={`
                ${skeletonClassName}
                size-[26px] rounded-full
              `}
            />
          </section>
        </section>
      </article>
    </section>
  );
};

export default IntroSkeleton;
