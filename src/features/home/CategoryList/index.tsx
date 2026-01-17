'use client';

import { useAtomValue } from 'jotai';
import { memo } from 'react';

import { COLOR_TABLE } from '@/assets/constants';
import { categoriesAtom, selectedCategoryAtom } from '@/atoms/categories';
import { useCategorySelect } from '@/features/home/hooks';

const CategoryList = () => {
  const categories = useAtomValue(categoriesAtom);
  const seletedCategory = useAtomValue(selectedCategoryAtom);
  const { handleClickCategory } = useCategorySelect();

  return (
    <section>
      <div className="h-[28px]" />
      <section className="overflow-x-auto rounded-lg bg-[#ebe8e8] px-[6px]">
        <section
          className="
            flex min-h-[65px] gap-3 overflow-x-auto bg-[hsla(0,0%,100%,.8)] p-3
          "
        >
          {categories.map((category) => {
            const { id, name, color, count } = category;
            const selectedColor = COLOR_TABLE[color as keyof typeof COLOR_TABLE];

            return (
              <section
                className={`
                  cursor-pointer rounded-3xl border-2 border-solid bg-white px-4
                  py-2 text-[14px] whitespace-nowrap
                  shadow-[0_2px_4px_rgba(0,0,0,.1)]
                `}
                key={id}
                onClick={handleClickCategory(name)}
                style={{ borderColor: seletedCategory === name ? selectedColor : 'transparent' }}
              >
                {`${name} (${count})`}
              </section>
            );
          })}
        </section>
      </section>
    </section>
  );
};

export default memo(CategoryList);
