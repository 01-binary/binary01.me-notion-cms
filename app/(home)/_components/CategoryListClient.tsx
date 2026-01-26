'use client';

import { useAtomValue } from 'jotai';

import type { Category } from '@/interfaces';

import { selectedCategoryAtom } from '../_atoms';
import { getCategoryBorderClass } from '../_constants';
import { useCategoryQueryParam } from '../_hooks';

interface CategoryButtonProps {
  category: Category;
  isSelected: boolean;
  onSelect: (name: string) => void;
}

const categoryButtonClassName = [
  'cursor-pointer rounded-3xl border-2 border-solid px-4 py-2',
  'text-[14px] whitespace-nowrap',
  'bg-white shadow-[0_2px_4px_rgba(0,0,0,.1)]',
  'dark:bg-[rgb(var(--color-bg-tertiary))] dark:shadow-[0_2px_4px_rgba(0,0,0,.3)]',
].join(' ');

const CategoryButton = ({ category, isSelected, onSelect }: CategoryButtonProps) => {
  const { name, color, count } = category;
  const borderColorClass = isSelected ? getCategoryBorderClass(color) : 'border-transparent';

  const handleClick = () => {
    onSelect(name);
  };

  return (
    <li>
      <button
        type="button"
        className={`
          ${categoryButtonClassName}
          ${borderColorClass}
        `}
        onClick={handleClick}
        aria-pressed={isSelected}
      >
        {`${name} (${count})`}
      </button>
    </li>
  );
};

const wrapperClassName = [
  'overflow-x-auto rounded-lg px-[6px]',
  'bg-[#ebe8e8] dark:bg-[rgb(var(--color-bg-tertiary))]',
].join(' ');

const listClassName = [
  'flex min-h-[65px] list-none gap-3 overflow-x-auto p-3',
  'bg-[hsla(0,0%,100%,.8)] dark:bg-[rgb(var(--color-bg-secondary)/.8)]',
].join(' ');

interface CategoryListClientProps {
  categories: Category[];
}

const CategoryListClient = ({ categories }: CategoryListClientProps) => {
  const { handleClickCategory } = useCategoryQueryParam();
  const selectedCategory = useAtomValue(selectedCategoryAtom);

  return (
    <nav aria-label="카테고리 필터">
      <div className="h-[28px]" />
      <div className={wrapperClassName}>
        <ul className={listClassName}>
          {categories.map((category) => (
            <CategoryButton
              key={category.id}
              category={category}
              isSelected={selectedCategory === category.name}
              onSelect={handleClickCategory}
            />
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default CategoryListClient;
