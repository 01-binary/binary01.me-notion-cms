import CategoryList from '@/features/home/CategoryList';
import useHomeData from '@/features/home/hooks/useHomeData';
import Intro from '@/features/home/Intro';
import PostList from '@/features/home/PostList';
import { HomeProps } from '@/interfaces';

const Home = ({ posts, categories }: HomeProps) => {
  const { filteredPosts, seletedCategory, handleClickCategory } = useHomeData({ posts });

  return (
    <section className="mx-auto max-w-[900px] px-4">
      <Intro />
      <CategoryList
        categories={categories}
        seletedCategory={seletedCategory}
        handleClickCategory={handleClickCategory}
      />
      <PostList posts={filteredPosts} />
    </section>
  );
};

export default Home;
