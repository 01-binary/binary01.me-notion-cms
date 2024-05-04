import { useAtomValue } from 'jotai';

import { categoriesAtom, selectedCategoryAtom } from '@/atoms/categories';
import useCategorySelect from '@/features/home/hooks/useCategorySelect';

const CategoryList = () => {
  const categories = useAtomValue(categoriesAtom);
  const seletedCategory = useAtomValue(selectedCategoryAtom);

  const { handleClickCategory } = useCategorySelect();
  return (
    <section>
      <div className="h-[28px]" />
      <section className="overflow-x-auto rounded-lg bg-[#ebe8e8] px-[6px]">
        <section className="flex min-h-[65px] gap-3 overflow-x-auto bg-[hsla(0,0%,100%,.8)] p-3">
          {categories.map((category) => {
            const { id, name, color, count } = category;
            return (
              <section
                className={`cursor-pointer whitespace-nowrap rounded-3xl border-[2px] border-solid bg-[#fff] py-2 px-4 text-[14px] shadow-[0_2px_4px_rgba(0,0,0,.1)] ${
                  seletedCategory === name ? 'border-[#c0c0c0]' : 'border-transparent'
                }`}
                key={id}
                style={{ color }}
                onClick={handleClickCategory(name)}
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

export default CategoryList;
