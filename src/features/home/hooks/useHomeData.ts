import { useCallback, useMemo, useState } from 'react';

import { Post } from '@/interfaces';

import { INITIAL_CATEGORY } from '@/assets/constants';

interface Props {
  posts: Post[];
}

const useHomeData = ({ posts }: Props) => {
  const [seletedCategory, setSeletedCategory] = useState<string>(INITIAL_CATEGORY);

  const filteredPosts = useMemo(() => {
    if (seletedCategory === INITIAL_CATEGORY) return posts;
    return posts.filter((post) => post.category?.name === seletedCategory);
  }, [posts, seletedCategory]);

  const handleClickCategory = useCallback(
    (selected: string) => () => {
      setSeletedCategory(selected);
    },
    [],
  );

  return {
    filteredPosts,
    seletedCategory,
    handleClickCategory,
  };
};

export default useHomeData;
