'use client';

import { memo, Suspense } from 'react';

import CategoryList from './CategoryList';
import PostList from './PostList';

const Home = () => {
  return (
    <>
      <Suspense>
        <CategoryList />
      </Suspense>
      <PostList />
    </>
  );
};

export default memo(Home);
