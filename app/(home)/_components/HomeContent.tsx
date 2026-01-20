'use client';

import { Suspense } from 'react';

import CategoryList from './CategoryList';
import PostList from './PostList';

const HomeContent = () => {
  return (
    <>
      <Suspense>
        <CategoryList />
      </Suspense>
      <PostList />
    </>
  );
};

export default HomeContent;
