'use client';

import { useAtomValue } from 'jotai';
import { memo } from 'react';

import { getCategoryColor } from '@/assets/constants';

import { categoriesAtom, selectedCategoryAtom } from './atoms';
import { useCategorySelect } from './hooks';

const CategoryList = () => {
  const categories = useAtomValue(categoriesAtom);
  const selectedCategory = useAtomValue(selectedCategoryAtom);
  const { handleClickCategory } = useCategorySelect();

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
          {categories.map((category) => {
            const { id, name, color, count } = category;
            const selectedColor = getCategoryColor(color);
            const isSelected = selectedCategory === name;

            return (
              <li key={id}>
                <button
                  type="button"
                  className={`
                    cursor-pointer rounded-3xl border-2 border-solid bg-white
                    px-4 py-2 text-[14px] whitespace-nowrap
                    shadow-[0_2px_4px_rgba(0,0,0,.1)]
                  `}
                  onClick={handleClickCategory(name)}
                  style={{ borderColor: isSelected ? selectedColor : 'transparent' }}
                  aria-pressed={isSelected}
                >
                  {`${name} (${count})`}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default memo(CategoryList);
