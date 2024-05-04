import { memo } from 'react';

import CategoryList from '@/features/home/CategoryList';
import Intro from '@/features/home/Intro';
import PostList from '@/features/home/PostList';

const Home = () => {
  return (
    <section className="mx-auto max-w-[900px] px-4">
      <Intro />
      <CategoryList />
      <PostList />
    </section>
  );
};

export default memo(Home);
