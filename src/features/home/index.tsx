import CategoryList from '@/features/home/CategoryList';
import { useHomeData } from '@/features/home/hooks';
import Intro from '@/features/home/Intro';
import PostList from '@/features/home/PostList';
import { HomeProps } from '@/interfaces';

const Home = ({ posts, categories }: HomeProps) => {
  const { processedPosts, seletedCategory, handleClickCategory, entries, isLoading } = useHomeData({
    posts,
  });

  return (
    <section className="mx-auto max-w-[900px] px-4">
      <Intro />
      <CategoryList
        isLoading={isLoading}
        categories={categories}
        seletedCategory={seletedCategory}
        handleClickCategory={handleClickCategory}
      />
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
