import { GetPageResponse, Post } from '@/interfaces';

import {
  filterCategoryProperties,
  filterCoverProperties,
  filterDateProperties,
  filterDescSlugProperties,
  filterTitleProperties,
} from '@/utils/filterProperties';

const parsePosts = (notionPostsResponse: GetPageResponse[]) => {
  const parsedPosts = notionPostsResponse.reduce<Post[]>((acc, item) => {
    if (!('properties' in item)) return acc;
    const { id, icon, cover } = item;
    const { Name, Category, Date, Desc, Slug } = item.properties;

    const parsedPost: Post = {
      id,
      icon,
      cover: filterCoverProperties(cover),
      title: filterTitleProperties(Name),
      description: filterDescSlugProperties(Desc),
      slug: filterDescSlugProperties(Slug),
      category: filterCategoryProperties(Category),
      published: filterDateProperties(Date),
    };

    return [...acc, parsedPost];
  }, []);

  return parsedPosts;
};

export default parsePosts;
