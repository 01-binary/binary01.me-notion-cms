import { Category } from '@/interfaces';

interface Props {
  categories: Category[];
  seletedCategory: string;
  handleClickCategory: (selected: string) => () => void;
}

const CategoryList = ({ categories, seletedCategory, handleClickCategory }: Props) => {
  return (
    <section className="mt-[28px]">
      <section className="overflow-x-auto rounded-lg bg-[#cccccc] px-[6px]">
        <section className="flex gap-3 overflow-x-auto bg-[hsla(0,0%,100%,.9)] p-3">
          {categories.map((category) => {
            const { id, name, color, count } = category;
            return (
              <section
                className={`cursor-pointer whitespace-nowrap rounded-xl border-[2px] border-solid bg-[#fff] py-2 px-4 text-[14px] ${
                  seletedCategory === name ? 'border-[#000]' : 'border-transparent'
                }`}
                key={id}
                style={{ color: color || '#000' }}
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
