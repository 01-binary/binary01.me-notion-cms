'use client';

import { useAtomValue } from 'jotai';
import { memo, useCallback } from 'react';

import { getCategoryColor } from '@/assets/constants';
import type { Category } from '@/interfaces';

import { categoriesAtom, selectedCategoryAtom } from './atoms';
import { useCategoryQueryParam } from './hooks';

interface CategoryButtonProps {
  category: Category;
  isSelected: boolean;
  onSelect: (name: string) => void;
}

const CategoryButton = memo(({ category, isSelected, onSelect }: CategoryButtonProps) => {
  const { name, color, count } = category;
  const borderColor = isSelected ? getCategoryColor(color) : 'transparent';

  const handleClick = useCallback(() => {
    onSelect(name);
  }, [onSelect, name]);

  return (
    <li>
      <button
        type="button"
        className={`
          cursor-pointer rounded-3xl border-2 border-solid bg-white px-4 py-2
          text-[14px] whitespace-nowrap shadow-[0_2px_4px_rgba(0,0,0,.1)]
        `}
        onClick={handleClick}
        style={{ borderColor }}
        aria-pressed={isSelected}
      >
        {`${name} (${count})`}
      </button>
    </li>
  );
});

CategoryButton.displayName = 'CategoryButton';

const CategoryList = () => {
  const { handleClickCategory } = useCategoryQueryParam();
  const categories = useAtomValue(categoriesAtom);
  const selectedCategory = useAtomValue(selectedCategoryAtom);

  return (
    <nav aria-label="카테고리 필터">
      <div className="h-[28px]" />
      <div className="overflow-x-auto rounded-lg bg-[#ebe8e8] px-[6px]">
        <ul
          className="
            flex min-h-[65px] list-none gap-3 overflow-x-auto
            bg-[hsla(0,0%,100%,.8)] p-3
          "
        >
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

export default memo(CategoryList);
