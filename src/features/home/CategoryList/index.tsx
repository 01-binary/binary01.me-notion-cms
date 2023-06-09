import React from 'react';

import { Category } from '@/interfaces';

interface Props {
  categories: Category[];
}

const CategoryList = ({ categories }: Props) => {
  return (
    <section className="mt-[28px]">
      <section className="overflow-x-auto rounded-lg bg-[#cccccc] px-[6px]">
        <section className="flex gap-3 bg-[hsla(0,0%,100%,.9)] p-3">
          {categories.map((category) => {
            const { id, name, color } = category;
            return (
              <section
                className="cursor-pointer rounded-xl bg-[#fff] py-2 px-4 text-[14px]"
                key={id}
                style={{ color: color || '#000' }}
              >
                {name}
              </section>
            );
          })}
        </section>
      </section>
    </section>
  );
};

export default CategoryList;
