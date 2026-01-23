const wrapperClassName = [
  'overflow-x-auto rounded-lg px-[6px]',
  'bg-[#ebe8e8] dark:bg-[rgb(var(--color-bg-tertiary))]',
].join(' ');

const listClassName = [
  'flex min-h-[65px] list-none gap-3 overflow-x-auto p-3',
  'bg-[hsla(0,0%,100%,.8)] dark:bg-[rgb(var(--color-bg-secondary)/.8)]',
].join(' ');

const CategoryListSkeleton = () => {
  return (
    <nav aria-label="카테고리 필터 로딩 중">
      <div className="h-[28px]" />
      <div className={wrapperClassName}>
        <div className={listClassName} />
      </div>
    </nav>
  );
};

export default CategoryListSkeleton;
