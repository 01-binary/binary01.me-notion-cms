import { useAtomValue } from 'jotai';

import { categoriesAtom } from '@/atoms/categories';
import CategoryList from '@/features/home/CategoryList';
import { useHomeData } from '@/features/home/hooks';
import Intro from '@/features/home/Intro';
import PostList from '@/features/home/PostList';

const Home = () => {
  const { processedPosts, seletedCategory, entries } = useHomeData();

  return (
    <section className="mx-auto max-w-[900px] px-4">
      <Intro />
      <CategoryList seletedCategory={seletedCategory} />
      <PostList posts={processedPosts} />
      <div
        ref={($elem) => {
          entries.current[0] = $elem as HTMLDivElement;
        }}
      />
    </section>
  );
};

export default Home;
