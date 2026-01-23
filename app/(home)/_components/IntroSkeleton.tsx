import { SKELETON_BASE_CLASS } from '../_constants';

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
            ${SKELETON_BASE_CLASS}
            size-[110px] rounded-full
          `}
        />
        <section className="flex flex-col justify-around gap-1">
          <section className="flex flex-col gap-2">
            <div
              className={`
                ${SKELETON_BASE_CLASS}
                h-[34px] w-[120px]
              `}
            />
            <div
              className={`
                ${SKELETON_BASE_CLASS}
                h-[24px] w-[200px]
              `}
            />
          </section>
          <section className="flex items-center gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className={`
                  ${SKELETON_BASE_CLASS}
                  size-[26px] rounded-full
                `}
              />
            ))}
          </section>
        </section>
      </article>
    </section>
  );
};

export default IntroSkeleton;
