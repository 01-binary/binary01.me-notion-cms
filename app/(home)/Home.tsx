import { memo, Suspense } from 'react';

import CategoryList from './CategoryList';
import Intro from './Intro';
import PostList from './PostList';

const Home = () => {
  return (
    <section className="mx-auto max-w-[900px] px-4">
      <Intro />
      <Suspense>
        <CategoryList />
      </Suspense>
      <PostList />
    </section>
  );
};

export default memo(Home);
